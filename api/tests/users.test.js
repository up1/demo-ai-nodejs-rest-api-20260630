'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock db pool and amqplib before requiring app
jest.mock('../src/utils/db', () => ({
  query: jest.fn(),
}));

jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn().mockResolvedValue(),
      sendToQueue: jest.fn(),
      close: jest.fn().mockResolvedValue(),
    }),
    close: jest.fn().mockResolvedValue(),
  }),
}));

const pool = require('../src/utils/db');
const app = require('../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

function makeToken(payload = { userId: 1 }) {
  return jwt.sign(payload, JWT_SECRET);
}

describe('GET /api/users/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TC_01: returns 200 with user data for valid user ID and JWT', async () => {
    pool.query.mockResolvedValue({ rows: [mockUser] });

    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id, name, email FROM users WHERE id = $1',
      [1]
    );
  });

  it('TC_02: returns 404 when user ID does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app)
      .get('/api/users/999')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  it('TC_03: returns 401 when JWT token is missing', async () => {
    const res = await request(app).get('/api/users/1');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_04: returns 401 when JWT token is invalid', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_05: returns 500 when database fails', async () => {
    pool.query.mockRejectedValue(new Error('Database connection failed'));

    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('POST /api/users', () => {
  const newUser = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    created_at: '2026-06-30T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TC_06: returns 201 with created user on valid input', async () => {
    pool.query.mockResolvedValue({ rows: [newUser] });

    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: newUser.name,
      email: newUser.email,
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.created_at).toBeDefined();
  });

  it('TC_07: returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'jane.doe@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_08: returns 400 when name is empty string', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '  ', email: 'jane.doe@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_09: returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'valid email is required' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_10: returns 400 when email is invalid format', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'valid email is required' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('TC_11: returns 500 when database fails', async () => {
    pool.query.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  it('TC_12: returns 500 when RabbitMQ publish fails', async () => {
    pool.query.mockResolvedValue({ rows: [newUser] });
    const amqplib = require('amqplib');
    amqplib.connect.mockRejectedValueOnce(new Error('RabbitMQ connection failed'));

    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});
