import React from 'react';
import { MapPin, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import MainLayout from '../../../components/layouts/MainLayout';

/**
 * CareersPage
 * Placeholder roles/copy below the fold — real listings, comp info, and
 * team photos should replace these before this goes live.
 */

const VALUES = [
  { title: 'Ship for the person on the other end', body: 'Every feature has a talent or a client on the receiving end. We build for them first.' },
  { title: 'Small team, wide trust', body: 'We hire few people and give them a lot of room. No approval chains for good judgment.' },
  { title: 'Write it down', body: 'Decisions live in docs, not in one person\u2019s head. Async by default, meetings by exception.' },
];

const ROLES = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote (India)', type: 'Full-time' },
  { title: 'Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Trust & Safety Associate', dept: 'Operations', location: 'Mumbai, India', type: 'Full-time' },
  { title: 'Growth Marketer', dept: 'Marketing', location: 'Remote', type: 'Contract' },
];

export default function CareersPage() {
  return (
    <MainLayout>
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-14 text-center">
        <span className="badge badge-accent mb-6 inline-flex"><Sparkles size={12} /> We're hiring</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">Build the place talent and work find each other</h1>
        <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
          Small team, real ownership, and a product with actual trust mechanics baked in —
          not just a listings board.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid sm:grid-cols-3 gap-5">
        {VALUES.map((v) => (
          <div key={v.title} className="card">
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.body}</p>
          </div>
        ))}
      </section>

      {/* Open roles */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="font-display text-2xl font-bold mb-6">Open roles</h2>
        <div className="space-y-3">
          {ROLES.map((r) => (
            <a
              key={r.title}
              href={`mailto:careers@hyrd.app?subject=${encodeURIComponent('Application: ' + r.title)}`}
              className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:opacity-90 transition"
            >
              <div>
                <div className="font-semibold mb-1.5">{r.title}</div>
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="badge badge-info">{r.dept}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={13} /> {r.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={13} /> {r.type}</span>
                </div>
              </div>
              <span className="btn btn-secondary shrink-0 text-sm">
                Apply <ArrowUpRight size={14} />
              </span>
            </a>
          ))}
        </div>

        <div className="card mt-6 text-center py-8">
          <p style={{ color: 'var(--text-secondary)' }}>
            Don&rsquo;t see a fit but think you should be here anyway?
          </p>
          <a href="mailto:careers@hyrd.app" className="font-semibold" style={{ color: 'var(--accent)' }}>
            careers@hyrd.app
          </a>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}