import { NextResponse } from 'next/server';
import { resetToDefaults } from '@/lib/data';

export async function POST() {
  try {
    const data = resetToDefaults();
    if (!data) {
      return NextResponse.json({ error: 'Failed to reset portfolio data' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Portfolio reset to initial defaults successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
