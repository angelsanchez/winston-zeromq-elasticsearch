var winston = require('winston');

require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch;

var logger = new winston.Logger ({
  transports : [
    new winston.transports.ZeroMQElasticSearch({
      socketAddress : 'tcp://0.0.0.0:9700'
    }),
    new winston.transports.Console ({
      json : false,
      timestamp : true
    })
  ]
});

logger.on('error', function (err) {
  throw err;
});

setInterval(function () {
  
  logger.info('Info message from basic example');

}, 1000);
