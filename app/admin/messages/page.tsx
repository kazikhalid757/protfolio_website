'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { Badge, Button, Card, Notice, PageHeader, Spinner } from '@/components/admin/ui';
import { ADMIN_LOGIN_EXPIRED } from '@/lib/adminPath';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function MessagesPage() {
  const { toast, confirm, refreshUnread } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([]);
  const [available, setAvailable] = useState(true);
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages', { cache: 'no-store' });
      if (res.status === 401) return void (window.location.href = ADMIN_LOGIN_EXPIRED);
      const json = await res.json();
      setMessages(json.messages || []);
      setAvailable(json.available);
      setEmailDelivery(json.emailDelivery);
    } catch {
      toast('Could not load messages.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setRead = async (m: Message, read: boolean) => {
    setMessages((all) => all.map((x) => (x.id === m.id ? { ...x, read } : x)));
    const res = await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: m.id, read }),
    });
    if (!res.ok) {
      toast('Could not update the message.', 'error');
      load();
    }
    refreshUnread();
  };

  const toggle = (m: Message) => {
    const opening = open !== m.id;
    setOpen(opening ? m.id : null);
    if (opening && !m.read) setRead(m, true);
  };

  const remove = async (m: Message) => {
    if (!(await confirm(`Delete the message from ${m.name}? This cannot be undone.`, { title: 'Delete message', confirmLabel: 'Delete', danger: true }))) return;
    const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(m.id)}`, { method: 'DELETE' });
    if (!res.ok) return toast('Could not delete the message.', 'error');
    setMessages((all) => all.filter((x) => x.id !== m.id));
    toast('Message deleted.');
    refreshUnread();
  };

  const shown = filter === 'unread' ? messages.filter((m) => !m.read) : messages;
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description="Enquiries sent through the contact form on your website."
        actions={
          (
            <div className="flex border border-char" role="group" aria-label="Filter">
              {(['all', 'unread'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`h-9 px-4 text-sm font-medium capitalize ${filter === f ? 'bg-char text-paper' : 'bg-white text-char hover:bg-paperDeep'}`}
                >
                  {f}
                  {f === 'unread' && unread > 0 ? ` (${unread})` : ''}
                </button>
              ))}
            </div>
          )
        }
      />

      {emailDelivery && (
        <div className="mb-4">
          <Notice>Each new message is also emailed to you.</Notice>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <MailOpen size={32} className="mx-auto text-mute" aria-hidden />
          <p className="mt-4 font-serif text-3xl text-char">{filter === 'unread' ? 'No unread messages' : 'No messages yet'}</p>
          <p className="mt-2 text-sm text-mute">When someone uses the contact form, it will show up here.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {shown.map((m) => {
            const isOpen = open === m.id;
            return (
              <li key={m.id} className={`border bg-white ${isOpen ? 'border-char' : 'border-rule'}`}>
                <button
                  onClick={() => toggle(m)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left"
                >
                  <span className={`mt-1.5 w-2.5 h-2.5 shrink-0 ${m.read ? 'bg-rule' : 'bg-signal'}`} aria-label={m.read ? 'Read' : 'Unread'} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className={`truncate ${m.read ? 'font-medium text-charSoft' : 'font-bold text-char'}`}>{m.name}</span>
                      <span className="font-mono text-xs text-mute">{when(m.date)}</span>
                    </span>
                    <span className="block truncate text-sm text-char">{m.subject}</span>
                    {!isOpen && <span className="block truncate text-sm text-mute">{m.message}</span>}
                  </span>
                  <ChevronDown size={18} className={`mt-1 shrink-0 text-mute transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                </button>

                {isOpen && (
                  <div className="border-t border-rule bg-paper/60 px-5 py-5">
                    <p className="mb-3 text-sm text-mute">
                      From <strong className="text-char">{m.name}</strong> ·{' '}
                      <a href={`mailto:${m.email}`} className="underline underline-offset-2 decoration-signal text-char">
                        {m.email}
                      </a>
                    </p>
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-char">{m.message}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}
                        className="inline-flex items-center gap-2 h-9 px-3 bg-char text-paper text-sm font-medium hover:bg-signal transition-colors"
                      >
                        <Reply size={15} aria-hidden /> Reply by email
                      </a>
                      <Button variant="outline" size="sm" onClick={() => setRead(m, !m.read)}>
                        {m.read ? <Mail size={15} aria-hidden /> : <MailOpen size={15} aria-hidden />}
                        Mark as {m.read ? 'unread' : 'read'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => remove(m)}>
                        <Trash2 size={15} aria-hidden /> Delete
                      </Button>
                      {!m.read && <Badge tone="signal">New</Badge>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
