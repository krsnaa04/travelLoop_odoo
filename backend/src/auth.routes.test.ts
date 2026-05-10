import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthUser } from './contracts';
import { signAuthToken } from './utils/jwt';

const registerUserMock = vi.fn();
const loginUserMock = vi.fn();
const getUserByIdMock = vi.fn();

vi.mock('./services/authService', () => ({
  registerUser: registerUserMock,
  loginUser: loginUserMock,
  getUserById: getUserByIdMock,
}));

describe('Auth routes', () => {
  const sampleUser: AuthUser = {
    id: 'a4c97896-0edc-4e89-b86d-bdcf276ff090',
    email: 'demo@traveloop.com',
    name: 'Demo User',
  };

  beforeEach(() => {
    registerUserMock.mockReset();
    loginUserMock.mockReset();
    getUserByIdMock.mockReset();
  });

  it('registers a user with valid payload', async () => {
    registerUserMock.mockResolvedValue(sampleUser);
    const { app } = await import('./app');

    const response = await request(app).post('/api/auth/register').send({
      email: sampleUser.email,
      password: 'password123',
      name: sampleUser.name,
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(sampleUser.email);
    expect(response.body.token).toBeTypeOf('string');
    expect(registerUserMock).toHaveBeenCalledTimes(1);
  });

  it('rejects register payload with invalid email', async () => {
    const { app } = await import('./app');
    const response = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'password123',
      name: 'Bad Input',
    });

    expect(response.status).toBe(400);
    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it('logs in with valid credentials', async () => {
    loginUserMock.mockResolvedValue(sampleUser);
    const { app } = await import('./app');

    const response = await request(app).post('/api/auth/login').send({
      email: sampleUser.email,
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(sampleUser.id);
    expect(response.body.token).toBeTypeOf('string');
  });

  it('returns current user from auth token', async () => {
    getUserByIdMock.mockResolvedValue(sampleUser);
    const token = signAuthToken(sampleUser);
    const { app } = await import('./app');

    const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(sampleUser.email);
    expect(getUserByIdMock).toHaveBeenCalledWith(sampleUser.id);
  });

  it('requires auth token for /me', async () => {
    const { app } = await import('./app');
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });
});
