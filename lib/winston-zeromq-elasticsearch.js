/*
 * winston-zeromq.js: A ZeroMQ-ElasticSearch transport for Winston.
 *
 * (C) 2010 Angel Sanchez
 * MIT LICENCE
 *
 */

var util = require('util'),
    winston = require('winston'),
    zmq = require('zmq');

//
// ### function ZMQ_ES (options)
// #### @options {Object} Options for this instance.
// Constructor function for the ZMQ_ES transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var ZMQ_ES = exports.ZMQ_ES = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  if (!options.socketAddress) {
    throw new Error('Cannot send messages to QLog server without socket address.');
  }

  var self = this;
  self.socketAddress = options.socketAddress;
  self.publisher = zmq.socket('push');

  self.publisher.on('error', function (err) {
    self.emit('error', err);
    throw err;
  });

  self.publisher.connect(self.socketAddress);

};

//
// Inherit from `winston.Transport`.
//
util.inherits(ZMQ_ES, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
ZMQ_ES.prototype.name = 'ZMQ_ES';

winston.transports.ZMQ_ES = ZMQ_ES;

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
ZMQ_ES.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var logEntry = {
    "@timestamp": new Date().toISOString(),
    "level": level,
    "message": msg,
    "meta": meta
  };

  var line = 'POST|' + computePath('data') + '|' + JSON.stringify(logEntry);
  
  var self = this;
  process.nextTick(function () {
    self.publisher.send( line );
  });

  self.emit('logged');
  callback(null, true);
};

ZMQ_ES.prototype.close = function () {
  if ( this.publisher ) {
    this.publisher.close();
  }
}


//
// Util
//
function fill0(s, k) {
  return s.length == k ? s : '0' + fill0(s, k -1);
}

function formatDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = fill0((now.getMonth() + 1) + '', 2);
  var day = fill0((now.getDate()) + '', 2);
  return year + '.' + month + '.' + day;
}

function computePath(data_type) {
  return '/logstash-' + formatDate() + '/' + data_type;
}
