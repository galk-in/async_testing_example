'use strict';

require('dotenv').load();

const topic = process.env.MSB_DEFAULT_TOPIC;

let bunyan = require('bunyan');
let log = bunyan.createLogger({
    name: "Worker",
    streams: [
        {
            type: "raw",
            stream: require('bunyan-logstash').createStream({
                host: process.env.LOGSTASH_HOST,
                port: process.env.LOGSTASH_PORT
            })
        },
        {
            stream: process.stderr
        }
    ],
    env: process.env.NODE_ENV || 'development'
});

let request = require('request');

let msb = require('msb');
let consumer = msb.channelManager.findOrCreateConsumer(topic, {groupId: false});

consumer
    .on('message', (message) => {
        if (!message.payload.url) return log.error({message: message}, 'Not url in task');
        let url = message.payload.url;
        if (url.indexOf('http://') === -1) {
            url = 'http://' + url;
        }
        log.info({message: message, url: url}, 'New task');
        request(url, (error, response, body) => {
            if (error) return log.error({error: error, url: url}, 'Error during request');

            if (response.statusCode !== 200) return log.error({
                response: response,
                url: url
            }, 'Bad response during request');

            let cms = checkCMS(body);
            log.info({url: url, cms: cms}, 'CMS checked');
        });
    })
    .on('error', (err) => {
        log.error({error: err});
    });

function checkCMS(pageContent) {
    if (pageContent.indexOf('wordpress') > -1) {
        return 'wordpress';
    }
    if (pageContent.indexOf('joomla') > -1) {
        return 'joomla';
    }
    return 'unknown';
}