'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Mail, 
  Check, 
  ExternalLink, 
  Clock, 
  User, 
  Eye, 
  X, 
  Reply 
} from 'lucide-react';

export default function AdminMessages() {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setMessages(d.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: !currentRead } : m);
    const updatedData = { ...data, messages: updated };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setMessages(updated);
        setData(updatedData);
        showToast(!currentRead ? 'Marked as read' : 'Marked as unread');
      }
    } catch {
      showToast('Error updating message status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    const updated = messages.filter(m => m.id !== id);
    const updatedData = { ...data, messages: updated };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setMessages(updated);
        setData(updatedData);
        if (activeMessage?.id === id) setActiveMessage(null);
        showToast('Message deleted.');
      }
    } catch {
      showToast('Error deleting message.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Inquiries...</div>;
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {toast && (
        <div className="toast-notice">
          <Check size={18} color="var(--brand-emerald)" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Contact Inquiries Inbox</h1>
            {unreadCount > 0 && (
              <span className="badge badge-rose">{unreadCount} New</span>
            )}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Messages received through the public portfolio contact form.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
          <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Inquiries Yet</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            When clients or recruiters submit messages through your contact form, they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                borderLeft: !msg.read ? '4px solid var(--brand-cyan)' : '4px solid transparent',
                background: !msg.read ? 'rgba(56, 189, 248, 0.05)' : 'var(--bg-card)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{msg.name}</span>
                  {!msg.read && <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>NEW</span>}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--brand-cyan)', marginBottom: '0.4rem' }}>
                  <a href={`mailto:${msg.email}`} style={{ textDecoration: 'underline' }}>{msg.email}</a>
                  {msg.date && (
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                      {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Subject: {msg.subject || 'Portfolio Inquiry'}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxHeight: '42px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveMessage(msg)}
                  className="btn btn-outline btn-sm"
                  title="View Full Message"
                >
                  <Eye size={14} />
                  Read Full
                </button>

                <button
                  onClick={() => handleToggleRead(msg.id, msg.read)}
                  className="btn btn-ghost btn-sm"
                  title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <Check size={14} color={msg.read ? 'var(--brand-emerald)' : 'var(--text-muted)'} />
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="btn btn-ghost btn-sm"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} color="var(--brand-rose)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            className="spec-card"
            style={{
              maxWidth: '600px',
              width: '100%',
              padding: '2rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color="#059669" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Inquiry Details</h2>
              </div>
              <button onClick={() => setActiveMessage(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <strong>From:</strong> {activeMessage.name} (&lt;{activeMessage.email}&gt;)
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <strong>Subject:</strong> {activeMessage.subject || 'General Inquiry'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Received:</strong> {new Date(activeMessage.date).toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                MESSAGE:
              </div>
              <div style={{ padding: '1.25rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {activeMessage.message}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Portfolio Inquiry')}`}
                className="btn btn-primary"
              >
                <Reply size={16} />
                Reply via Email Client
              </a>

              <button
                onClick={() => {
                  handleDelete(activeMessage.id);
                  setActiveMessage(null);
                }}
                className="btn btn-ghost"
                style={{ color: 'var(--brand-rose)' }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
