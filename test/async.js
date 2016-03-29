'use strict';

require('dotenv').load();
let request = require('supertest');

describe('Test async', () => {
    let url = `http://${process.env.DOCKER_HOST}:3000/checkCMS/`;
    let callbackApp = require('express')();
    let server;
    callbackApp.use(require('body-parser').json());

    let callback = function() {};

    callbackApp.post('/', (req, res) => {
        callback(req.body);
        res.status(200).end();
    });

    server = callbackApp.listen(8000, process.env.TEST_HOST);

    after(() => server.close());

    it('Should return unknown CMS for mail.ru', (done) => {
        let domian = 'mail.ru';
        let cms = 'unknown';

        request(url).get(domian).end(() => {});

        callback = (log) => {
            if (log.cms === cms) done();
        };
    });

    it('Should return wordpress CMS for lifehacker.ru', (done) => {
        let domian = 'lifehacker.ru';
        let cms = 'wordpress';

        request(url).get(domian).end(() => {});

        callback = (log) => {
            if (log.cms === cms) done();
        };
    });

    it('Should return joomla CMS for joomla.ru', (done) => {
        let domian = 'joomla.ru';
        let cms = 'joomla';

        request(url).get(domian).end(() => {});

        callback = (log) => {
            if (log.cms === cms) done();
        };
    });

    it('Should return error for 88888', (done) => {
        let domian = '88888';
        let message = 'Error during request';

        request(url).get(domian).end(() => {});

        callback = (log) => {
            if (log.message === message) done();
        };
    });
});