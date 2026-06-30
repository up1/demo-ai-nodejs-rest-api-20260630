'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock the db pool before requiring app so all modules get the mock
jest.mock('../src/utils/db', () => ({
  query: jest.fn(),
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
