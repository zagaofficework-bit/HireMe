import React, { useState } from 'react';
import { Mail, Clock, ShieldAlert, LifeBuoy, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from "../../layouts/MainLayout";

/**
 * ContactUsPage
 * There is no POST /contact endpoint in the current backend (see the
 * Developer Guide) — this form currently just simulates a submit. Swap the
 * handleSubmit body for a real api.post('/contact', payload) once that
 * route exists, or point it at your support inbox via a Formspree-style
 * endpoint in the meantime.
 */

const REASONS = [
  { value: 'talent', label: "I'm looking for work" },
  { value: 'client', label: "I'm hiring" },
  { value: 'account', label: 'Account or billing issue' },
  { value: 'trust', label: 'Report a profile or abuse' },
  { value: 'press', label: 'Press / partnerships' },
  { value: 'other', label: 'Something else' },
];

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', reason: 'talent', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Fill in your name, email, and a message before sending.');
      return;
    }

    setStatus('sending');
    try {
      // Placeholder — no /contact route exists yet in the backend.
      // await api.post('/contact', form);
      await new Promise((res) => setTimeout(res, 700));
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError('Something went wrong sending that. Try again in a moment.');
    }
  };

  return (
    <MainLayout>
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-14 text-center">
        <span className="badge badge-accent mb-6 inline-flex">Get in touch</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">Talk to Hyrd</h1>
        <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
          Question about your account, a report to file, or just want to say hi — pick what
          fits and send it over. We read every message.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid lg:grid-cols-[1.3fr,1fr] gap-8">
        {/* Form */}
        <div className="card">
          {status === 'sent' ? (
            <div className="py-16 flex flex-col items-center text-center">
              <CheckCircle2 size={40} style={{ color: 'var(--success)' }} className="mb-4" />
              <h2 className="font-display text-xl font-bold mb-2">Message sent</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Thanks, {form.name.split(' ')[0]}. We typically reply within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Your name</label>
                  <input
                    className="theme-input w-full rounded-lg px-3.5 py-2.5"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jordan Lee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    className="theme-input w-full rounded-lg px-3.5 py-2.5"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">What's this about?</label>
                <select
                  className="theme-input w-full rounded-lg px-3.5 py-2.5"
                  value={form.reason}
                  onChange={update('reason')}
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className="theme-input w-full rounded-lg px-3.5 py-2.5 resize-none"
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us what's going on..."
                />
              </div>

              {error && (
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-primary w-full sm:w-auto"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  'Send message'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Side info */}
        <div className="space-y-4">
          <div className="card flex gap-3">
            <Mail size={20} style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Email us directly</div>
              <a href="mailto:support@hyrd.app" className="text-sm" style={{ color: 'var(--accent)' }}>
                support@hyrd.app
              </a>
            </div>
          </div>

          <div className="card flex gap-3">
            <Clock size={20} style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Response time</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Within 1 business day, usually faster.
              </p>
            </div>
          </div>

          <div className="card flex gap-3">
            <ShieldAlert size={20} style={{ color: 'var(--warning)' }} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Reporting abuse?</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Use the "Report" button on any profile for faster review by our trust &amp; safety team.
              </p>
            </div>
          </div>

          <Link to="/help" className="card flex gap-3 hover:opacity-90 transition">
            <LifeBuoy size={20} style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Check the Help Center first</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Most account questions are answered there instantly.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}