winston-zeromq-elasticsearch
============================

A ZeroMQ-ElasticSearch transport for Winston.

## Usage

Install the npm dependency:
```js
npm install wiston-zeromq-elasticsearch
```

Basic example:
```js
var winston = require('winston');

require('winston-zeromq-elasticsearch').ZMQ_ES;

var logger = new winston.Logger ({
  transports : [
    new winston.transports.ZMQ_ES({
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
  
  logger.info('Info message!');

}, 1000);
```

## Environment

- [ZeroMQ](http://zeromq.org/)
- [Java bindings for ZeroMQ](http://zeromq.org/bindings:java)
- [Elastic search](http://www.elasticsearch.org/download/)
- [Transport for ZeroMQ in Elastic search](https://github.com/bpaquet/transport-zeromq)

You can manage the saved logs using [Kibana](http://www.elasticsearch.org/overview/kibana/installation/)


__Author:__ [Angel Sanchez](http://www.thegameofcode.com/)
