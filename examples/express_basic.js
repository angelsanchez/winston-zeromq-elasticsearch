var winston = require('winston');
var express = require('express');

require('../lib/winston-zeromq-elasticsearch').ZeroMQElasticSearch;
winston.add(winston.transports.ZeroMQElasticSearch, { socketAddress: 'tcp://0.0.0.0:9700' });

var app = express();

// enable web server logging; pipe those log messages through winston
var winstonStream = {
    write: function(message, encoding){
        winston.info(message);
    }
};
app.use(express.logger({stream:winstonStream}));

app.listen(3030);
