import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const data = getPortfolioData();
    if (!data) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'New Portfolio Inquiry',
      message: message.trim(),
      date: new Date().toISOString(),
      read: false
    };

    if (!Array.isArray(data.messages)) {
      data.messages = [];
    }

    data.messages.unshift(newMessage);
    savePortfolioData(data);

    return NextResponse.json({ success: true, message: 'Message sent successfully! Kazi will get back to you shortly.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
