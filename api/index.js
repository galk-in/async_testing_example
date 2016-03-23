'use strict';

const namespace = 'test:pubsub';
let app = require('express')();

let bunyan = require('bunyan');
let log = bunyan.createLogger({name: "REST API"});

let msb = require('msb');
let producer = msb.channelManager.findOrCreateProducer(namespace);
var messageFactory = msb.messageFactory;

app.get('/checkCMS/:domain', function(req, res) {
    let message = messageFactory.createBroadcastMessage({namespace: namespace});
    message.payload = {domain: req.params.domain};
    messageFactory.completeMeta(message, message.meta);

    log.info({event: 'checkCMS', domain: req.params.domain}, 'New request for checkCMS');

    producer.publish(message, (err) => {
        if (err) {
            log.error(err);
            return req.send(`Error: ${err}`);
        }
        res.send('New task for worker added!');
    });
});

app.listen(3000, function() {
    log.info('REST API listening on port 3000!');
});

