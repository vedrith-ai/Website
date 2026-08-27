'use client';

/**
 * NotificationDashboard
 *
 * Architecture note: This is a protected admin interface, intentionally English-only.
 * Public-facing notification UI (banners, event cards) is bilingual (EN+KN).
 * This component is only reachable via authenticated admin session.
 */

import { useState, useEffect } from 'react';

interface Notification { id: string; title: string; category: string; date: string; published: boolean }

interface Props { sessionToken: string }

export function NotificationDashboard({ sessionToken }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', category: 'general' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/events', {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setNotifications(json.data ?? []); else setError(json.error); })
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, [sessionToken]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await fetch('/api/v1/events/publish', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ ...form, lang: 'en' }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitMsg('Event published successfully.');
        setForm({ title: '', description: '', date: '', category: 'general' });
      } else {
        setSubmitMsg(`Error: ${json.error}`);
      }
    } catch {
      setSubmitMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Notification Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Publish events and manage notifications — Admin only</p>
      </div>

      {/* Publish form */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-4">Publish New Event</h2>
        <form onSubmit={handlePublish} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                maxLength={200}
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="festival">Festival</option>
              <option value="muhurta">Muhurta</option>
              <option value="alert">Alert</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              maxLength={2000}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Publishing…' : 'Publish Event'}
            </button>
            {submitMsg && <p className="text-sm">{submitMsg}</p>}
          </div>
        </form>
      </div>

      {/* Event list */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-4">Recent Events</h2>
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error   && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        )}
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.date} · {n.category}</p>
              </div>
              <span className={`text-xs rounded-full px-2 py-0.5 ${n.published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {n.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
