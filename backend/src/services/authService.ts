import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { query } from '../db/connection';
import { AppError, notFound } from '../errors';
import type { AuthUser } from '../contracts';

const DEMO_USER = {
  id: 'f56e6f83-14f6-4f4f-b88c-b9a5d1fc1a01',
  email: 'demo@traveloop.dev',
  name: 'Demo Traveler',
  passwordHash: '$2a$10$RiCY6RwgYvsRg/WeCe3hUOR4vUh2/8Qc26eEi9WIXN95W.0iJ0Ny6',
};

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
}

const mapUser = (row: UserRow): AuthUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
});

const ensureDemoUser = async () => {
  await query(
    `
      INSERT INTO users (id, email, password_hash, name, avatar_url)
      VALUES ($1, $2, $3, $4, NULL)
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        updated_at = NOW()
    `,
    [DEMO_USER.id, DEMO_USER.email, DEMO_USER.passwordHash, DEMO_USER.name],
  );
};

export const registerUser = async (input: { email: string; password: string; name?: string }) => {
  if (input.email === DEMO_USER.email) {
    throw new AppError('This email is reserved for the demo account', 409);
  }

  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE email = $1', [input.email]);
  if (existing.rowCount) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const insert = await query<UserRow>(
    `
      INSERT INTO users (id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, password_hash
    `,
    [randomUUID(), input.email, hashedPassword, input.name ?? null],
  );

  return mapUser(insert.rows[0]);
};

export const loginUser = async (input: { email: string; password: string }) => {
  if (input.email === DEMO_USER.email) {
    await ensureDemoUser();
  }

  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE email = $1', [input.email]);
  const row = existing.rows[0];
  if (!row) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(input.password, row.password_hash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  return mapUser(row);
};

export const getUserById = async (userId: string) => {
  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE id = $1', [userId]);
  const row = existing.rows[0];
  if (!row) {
    throw notFound('User');
  }
  return mapUser(row);
};
