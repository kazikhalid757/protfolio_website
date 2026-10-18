import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPortfolioData, savePortfolioData } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { password, action, newPassword } = await request.json();
    const data = getPortfolioData();
    const currentPin = data?.adminSettings?.adminPin || 'admin123';

    if (action === 'change-password') {
      const cookieStore = cookies();
      const session = cookieStore.get('admin_session');
      if (!session || session.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
      }

      data.adminSettings.adminPin = newPassword;
      savePortfolioData(data);
      return NextResponse.json({ success: true, message: 'Admin password updated successfully' });
    }

    if (password === currentPin) {
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  const isAuthenticated = session?.value === 'true';
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('admin_session');
  return response;
}
