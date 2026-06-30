'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('GET /api/hello', () => {
  it('returns 200 with hello world message', async () => {
    const res = await request(app).get('/api/hello');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello world!' });
  });

  it('returns JSON content-type', async () => {
    const res = await request(app).get('/api/hello');

    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
