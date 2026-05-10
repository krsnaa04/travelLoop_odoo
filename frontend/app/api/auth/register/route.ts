import { generateMockToken, mockUsers } from '@/lib/mock-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (mockUsers[email]) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 });
    }

    const user = {
      id: `user-${Date.now()}`,
      email,
      name: name ?? 'Traveloop Explorer',
    };

    const token = generateMockToken(email);

    return NextResponse.json(
      {
        data: {
          token,
          user,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed', details: (error as Error).message },
      { status: 500 },
    );
  }
}