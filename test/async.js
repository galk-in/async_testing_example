'use strict';

let request = require('supertest');

describe('Test async', () => {
    let url = 'http://localhost:3000/checkCMS';
    let callbackApp = require('express')();
    let server;
    callbackApp.use(require('body-parser').json());

    let callback = function() {};

    callbackApp.post('/', (req, res) => {
        callback(req.body);
        res.status(200).end();
    });

    server = callbackApp.listen(8000, '172.28.23.92');

    after(() => server.close());

    it('Should return unknown CMS for mail.ru', (done) => {
        callback = (body) => {
            if (body.cms === 'unknown') done();
        };
        request(url).get('/mail.ru').end(() => {});
    });

    it('Should return wordpress CMS for lifehacker.ru', (done) => {
        callback = (body) => {
            if (body.cms === 'wordpress') done();
        };
        request(url).get('/lifehacker.ru').end(() => {});
    });

    it('Should return joomla CMS for joomla.ru', (done) => {
        callback = (body) => {
            if (body.cms === 'joomla') done();
        };
        request(url).get('/joomla.ru').end(() => {});
    });

    it('Should return error for 88888', (done) => {
        callback = (body) => {
            if (body.message === 'Error during request') done();
        };
        request(url).get('/88888').end(() => {});
    });
});