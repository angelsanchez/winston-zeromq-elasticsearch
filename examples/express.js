/**
 * Module dependencies
 */
var express = require('express'),
    path = require('path'),
    winston = require('winston'),
    expressWinston = require('express-winston');

require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch

var zmqElasticSearchTransport = new winston.transports.ZeroMQElasticSearch({
  socketAddress: 'tcp://0.0.0.0:9700'
});

var app = express();
app.configure(function() {
  app.use(express.bodyParser());

  var transports = [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.ZeroMQElasticSearch({
      socketAddress: 'tcp://0.0.0.0:9700'
    })
  ];

  // express-winston logger makes sense BEFORE the router.
  app.use(expressWinston.logger({transports: transports}));

  app.use(app.router);

  // express-winston errorLogger makes sense AFTER the router.
  app.use(expressWinston.errorLogger({transports: transports}));

});



app.get('/error', function(req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(new Error("This is an error and it should be logged to the console"));
});

app.get('/', function(req, res, next) {
  res.write('This is a normal request, it should be logged to the console too');
  res.end();
});

app.listen(3030, function(){
  console.log("express-winston demo listening on port 3030 in %s mode", app.settings.env);
});
