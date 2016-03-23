'use strict';

const namespace = 'test:pubsub';

let bunyan = require('bunyan');
let log = bunyan.createLogger({name: "Worker"});
let request = require('request');

let msb = require('msb');
let consumer = msb.channelManager.findOrCreateConsumer(namespace, {groupId: false});

consumer
    .on('message', (message) => {
        if (!message.payload.domain) return log.error({message: message}, 'Not domain in task');
        let domain = message.payload.domain;
        if(domain.indexOf('http://') === -1) {
            domain = 'http://' + domain;
        }
        log.info({message: message, domain: domain}, 'New task');
        request(domain, (error, response, body) => {
            if (error) return log.error({error: error, domain: domain}, 'Error during request');

            if (response.statusCode !== 200) return log.error({
                response: response,
                domain: domain
            }, 'Bad response during request');

            let cms = checkCMS(body);
            log.info({domain: domain, cms: cms}, 'CMS checked');
        });
    })
    .on('error', (err) => {
        log.error({error: err});
    });

function checkCMS(pageContent) {
    if(pageContent.indexOf('wordpress') > -1) {
        return 'wordpress';
    }
    if(pageContent.indexOf('joomla') > -1) {
        return 'joomla';
    }
    return 'unknown';
}