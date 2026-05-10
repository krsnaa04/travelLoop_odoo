/**
 * Traveloop Mock Authentication System
 * Provides dummy credentials and mock user accounts for testing
 */

import type { AuthUser } from './contracts';

/**
 * DUMMY CREDENTIALS FOR TESTING
 * Use these to login to the app without a backend
 */
export const dummyCredentials = [
  {
    email: 'demo@traveloop.dev',
    password: 'DemoPass123!',
    name: 'Demo Traveler',
  },
  {
    email: 'sophia@example.com',
    password: 'Password123!',
    name: 'Sophia Wanderer',
  },
  {
    email: 'tokyo@example.com',
    password: 'Password123!',
    name: 'Tokyo Explorer',
  },
  {
    email: 'mike@example.com',
    password: 'Password123!',
    name: 'Mountain Mike',
  },
];

/**
 * Mock user accounts with profile data
 */
export const mockUsers: Record<string, AuthUser> = {
  'demo@traveloop.dev': {
    id: 'user-demo',
    email: 'demo@traveloop.dev',
    name: 'Demo Traveler',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Exploring the world one trip at a time.',
    location: 'San Francisco, USA',
    joinedAt: new Date('2023-01-15').toISOString(),
  },
  'sophia@example.com': {
    id: 'user-101',
    email: 'sophia@example.com',
    name: 'Sophia Wanderer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Chasing sunsets and hidden gems across 45+ countries. Photographer. Dreamer.',
    location: 'Barcelona, Spain',
    joinedAt: new Date('2022-03-15').toISOString(),
  },
  'tokyo@example.com': {
    id: 'user-102',
    email: 'tokyo@example.com',
    name: 'Tokyo Explorer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Urban explorer obsessed with food culture and street photography.',
    location: 'Tokyo, Japan',
    joinedAt: new Date('2021-08-22').toISOString(),
  },
  'mike@example.com': {
    id: 'user-103',
    email: 'mike@example.com',
    name: 'Mountain Mike',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Adventure athlete. Mountains are my happy place. Always chasing the next peak.',
    location: 'Banff, Canada',
    joinedAt: new Date('2020-06-10').toISOString(),
  },
};

/**
 * Validate credentials against dummy accounts
 */
export function validateCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const credential = dummyCredentials.find(
    (c) => c.email === email && c.password === password,
  );

  if (!credential) {
    return null;
  }

  return mockUsers[email] || null;
}

/**
 * Generate a mock JWT token
 */
export function generateMockToken(email: string): string {
  // Simple mock token - in production this would be a real JWT
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
    }),
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Get user by token (mock implementation)
 */
export function getUserFromToken(token: string): AuthUser | null {
  try {
    // Decode the mock token to get the email
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    const email = payload.sub;

    return mockUsers[email] || null;
  } catch {
    return null;
  }
}

/**
 * Get all dummy credentials (for demo/testing purposes)
 */
export function getDummyCredentials() {
  return dummyCredentials.map((cred) => ({
    email: cred.email,
    password: cred.password,
    name: cred.name,
  }));
}
