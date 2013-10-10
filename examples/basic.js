var winston = require('winston');
require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch;

winston.add(winston.transports.ZeroMQElasticSearch, { socketAddress: 'tcp://0.0.0.0:9700' });

winston.info('Hello World!');
