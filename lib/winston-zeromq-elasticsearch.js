/*
 * winston-zeromq-elasticsearch.js: A ZeroMQ-ElasticSearch transport for Winston.
 *
 * (C) 2013 Angel Sanchez
 * MIT LICENCE
 *
 */

var util = require('util'),
    winston = require('winston'),
    common = require('winston/lib/winston/common'),
    zmq = require('zmq');

//
// ### function ZeroMQElasticSearch (options)
// #### @options {Object} Options for this instance.
// Constructor function for the ZeroMQElasticSearch transport object responsible
// for persisting log messages and metadata to a Elastic search server.
//
var ZeroMQElasticSearch = exports.ZeroMQElasticSearch = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  if (!options.socketAddress) {
    throw new Error('socketAddress option is required.');
  }

  var self = this;
  self.socketAddress = options.socketAddress;
  self.publisher = zmq.socket('push');

  self.publisher.on('error', function (err) {
    self.emit('error', err);
  });

  self.publisher.connect(self.socketAddress);

};

//
// Inherit from `winston.Transport`.
//
util.inherits(ZeroMQElasticSearch, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
ZeroMQElasticSearch.prototype.name = 'ZeroMQElasticSearch';

winston.transports.ZeroMQElasticSearch = ZeroMQElasticSearch;

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
ZeroMQElasticSearch.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var logEntry = common.log({
    level: level,
    message: msg,
    meta: meta,
    json: true,
    timestamp: true,
    logstash: true
  });

  var line = 'POST|' + getLogStashPath() + '|' + logEntry;
  var self = this;
  process.nextTick(function () {
    self.publisher.send( line );
  });

  self.emit('logged');
  callback(null, true);
};

//
// Close the publisher socket.
//
ZeroMQElasticSearch.prototype.close = function () {
  if ( this.publisher ) {
    this.publisher.close();
  }
}


//
// Util
//
function formatDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = common.pad(now.getMonth() + 1);
  var day = common.pad(now.getDate());
  return year + '.' + month + '.' + day;
}

function getLogStashPath() {
  return '/logstash-' + formatDate() + '/data';
}
