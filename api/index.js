'use strict';

require('dotenv').load();

const topic = process.env.MSB_DEFAULT_TOPIC;
let app = require('express')();

let bunyan = require('bunyan');
let log = bunyan.createLogger({name: "REST API"});

let msb = require('msb');
let producer = msb.channelManager.findOrCreateProducer(topic);
var messageFactory = msb.messageFactory;

app.get('/checkCMS/:url', function(req, res) {
    let message = messageFactory.createBroadcastMessage({namespace: topic});
    message.payload = {url: req.params.url};
    messageFactory.completeMeta(message, message.meta);

    log.info({event: 'checkCMS', url: req.params.url}, 'New request for checkCMS');

    producer.publish(message, (err) => {
        if (err) {
            log.error(err);
            return req.send(`Error: ${err}`);
        }
        res.send('New task for worker added!');
    });
});

app.listen(process.env.NODE_PORT, function() {
    log.info(`REST API listening on port ${process.env.NODE_PORT}`);
});

