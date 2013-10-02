var winston = require('winston');

require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch;

winston.add(winston.transports.ZeroMQElasticSearch, { level: 'warn', socketAddress: 'tcp://0.0.0.0:9700' });

setInterval(function () {
  
  winston.info('This message will not send!');
  winston.warn('Hello from basic example!', { anything: 'This is metadata' });

}, 1000);
