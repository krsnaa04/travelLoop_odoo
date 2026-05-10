import { generateMockToken, getUserFromToken, validateCredentials } from '@/lib/mock-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 },
      );
    }

    const user = validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const token = generateMockToken(email);

    return NextResponse.json(
      {
        data: {
          token,
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed', details: (error as Error).message },
      { status: 500 },
    );
  }
}
