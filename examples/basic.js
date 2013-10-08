var winston = require('winston');
require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch;

winston.add(winston.transports.ZeroMQElasticSearch, { socketAddress: 'tcp://ec2-54-217-125-174.eu-west-1.compute.amazonaws.com:9700' });

winston.info({'Hello World!', { project: 'test' });
