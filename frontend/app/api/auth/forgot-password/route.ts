import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    return NextResponse.json(
      {
        data: {
          message: `If ${email} matches an account, we sent a reset link.`,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Forgot password failed', details: (error as Error).message },
      { status: 500 },
    );
  }
}