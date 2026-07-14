import React from 'react';
import {
  ShieldCheck,
  Users,
  Eye,
  Handshake,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layouts/MainLayout';

/**
 * AboutUsPage
 * Static marketing page. Uses the existing design tokens from global.css
 * (--bg-page, --accent, .btn, .card, .badge, .font-display, etc.) so it
 * inherits dark/light theming automatically — no new tokens introduced.
 *
 * Placeholder copy/stats/team — swap with real content before shipping.
 */

const STATS = [
  { label: 'Talent profiles', value: '1.2K+' },
  { label: 'Hiring clients', value: '340+' },
  { label: 'Verified companies', value: '89' },
  { label: 'Profile views', value: '45K+' },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Verified before visible',
    body:
      'Companies are verified by our team before they can see a single phone number or email. No cold-scraped contact lists, no spam.',
  },
  {
    icon: Handshake,
    title: 'Direct, not brokered',
    body:
      'Once a client is verified, talent and client talk to each other directly. We stay out of the deal — no commission on your rate.',
  },
  {
    icon: Star,
    title: 'Reviews that stick',
    body:
      'One review per client per hire, tied to a real engagement. Ratings recalculate the moment a review changes — nothing sits stale.',
  },
  {
    icon: Eye,
    title: 'You control visibility',
    body:
      'Hide your profile the moment you\u2019re not looking, and it disappears from search instantly. No "still getting calls after I went quiet."',
  },
];

const TEAM = [
  { name: 'Aditi Rao', role: 'Founder & CEO', initials: 'AR' },
  { name: 'Marcus Chen', role: 'Head of Product', initials: 'MC' },
  { name: 'Priya Nair', role: 'Engineering Lead', initials: 'PN' },
  { name: 'Sam Okafor', role: 'Trust & Safety', initials: 'SO' },
];

export default function AboutUsPage() {
  return (
     <MainLayout>
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="badge badge-accent mb-6 inline-flex">Our mission</span>
        <h1
          className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Hiring shouldn&rsquo;t need a middleman.
        </h1>
        <p
          className="max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Hyrd exists so independent talent and the people who need them can find each other
          on their own terms — verified, direct, and without a recruiter's cut sitting in
          the middle.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="card text-center">
              <div className="font-display text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--accent)' }}>
                {s.value}
              </div>
              <div className="text-xs mt-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles — grounded in Hyrd's actual platform rules, not generic "values" */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-bold mb-2">How we actually operate</h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          These aren&rsquo;t values on a poster — they&rsquo;re rules built into the product.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card flex gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
          <Users size={22} style={{ color: 'var(--accent)' }} />
          The people behind Hyrd
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          A small team, on purpose — placeholder roster, swap in real bios.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {TEAM.map((m) => (
            <div key={m.name} className="card text-center">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center font-display font-bold text-lg mb-3"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {m.initials}
              </div>
              <div className="font-semibold text-sm">{m.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div
          className="card flex flex-col sm:flex-row items-center justify-between gap-6 py-10 px-8"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <div>
            <h3 className="font-display text-xl font-bold mb-1">Want to see how it works?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Two-minute read: how talent gets discovered and how clients get verified.
            </p>
          </div>
          <Link to="/how-it-works" className="btn btn-primary whitespace-nowrap">
            How it works <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}