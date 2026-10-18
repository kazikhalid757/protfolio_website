import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/data';

export async function GET() {
  try {
    const data = getPortfolioData();
    if (!data) {
      return NextResponse.json({ error: 'Failed to load portfolio data' }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.profile) {
      return NextResponse.json({ error: 'Invalid portfolio data payload' }, { status: 400 });
    }

    const success = savePortfolioData(body);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Portfolio updated successfully', data: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
