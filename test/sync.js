'use strict';

let request = require('supertest');

describe('Test sync endpoints', () => {
    let url = 'http://localhost:3000/checkCMS';

    it('Should add tasks', (done) => {
        request(url).get('/google.com').expect(200, 'New task for worker added!', done)
    });
})