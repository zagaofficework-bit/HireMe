import React, { useState } from 'react';
import {
  UserPlus,
  FileText,
  Search,
  MessageCircle,
  ShieldCheck,
  Building2,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from "../../layouts/MainLayout";

/**
 * HowItWorksPage
 * Steps mirror the real registration + search flow described in the
 * backend developer guide (Firebase auth -> profile creation -> discovery
 * -> contact gating -> reviews), so this page stays true to what actually
 * happens rather than a generic "3 easy steps" template.
 */

const TALENT_STEPS = [
  {
    icon: UserPlus,
    title: 'Sign up and build your profile',
    body: 'Create your account, then fill in skills, experience, rate, and availability. Your completion percentage shows how discoverable you are.',
  },
  {
    icon: FileText,
    title: 'Get verified',
    body: 'Our team reviews your credentials. Verified profiles carry a badge and rank higher in search — clients filter for this.',
  },
  {
    icon: Search,
    title: 'Show up in search',
    body: 'Clients filter by skill, location, rate, and availability. Your profile surfaces automatically — no applying to individual jobs required.',
  },
  {
    icon: MessageCircle,
    title: 'Get contacted directly',
    body: 'A verified client can view your email and phone and reach out. No recruiter fee comes out of your rate.',
  },
  {
    icon: Star,
    title: 'Build your rating',
    body: 'After an engagement, clients can leave one review. Your average rating and total reviews update automatically on your public profile.',
  },
];

const CLIENT_STEPS = [
  {
    icon: UserPlus,
    title: 'Sign up and create a company profile',
    body: 'Register as a client, then set up your company profile with your logo, description, and details.',
  },
  {
    icon: Building2,
    title: 'Get your company verified',
    body: 'We review every company before unlocking contact details — this is what keeps talent from getting cold-contacted by unverified accounts.',
  },
  {
    icon: Search,
    title: 'Search and filter talent',
    body: 'Filter by skill, city, work type, rate, rating, and availability. Bookmark profiles with tags and private notes as you shortlist.',
  },
  {
    icon: MessageCircle,
    title: 'Reach out directly',
    body: 'Once verified, view full contact details on any profile and message talent yourself — no middleman, no commission.',
  },
  {
    icon: Star,
    title: 'Leave a review',
    body: 'After working together, leave one honest review per hire. It becomes part of that talent\u2019s public track record.',
  },
];

export default function HowItWorksPage() {
  const [track, setTrack] = useState('talent');
  const steps = track === 'talent' ? TALENT_STEPS : CLIENT_STEPS;

  return (
    <MainLayout>
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">How Hyrd works</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Two sides, one platform. Pick the one that\u2019s you.
        </p>

        <div
          className="inline-flex p-1 rounded-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          {[
            { key: 'talent', label: "I'm looking for work" },
            { key: 'client', label: "I'm hiring" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTrack(t.key)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition"
              style={
                track === t.key
                  ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Numbered steps — a real sequence in the actual signup/discovery flow */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="relative pl-10">
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px"
            style={{ backgroundColor: 'var(--border-strong)' }}
          />
          <div className="space-y-8">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="relative">
                <div
                  className="absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                >
                  {i + 1}
                </div>
                <div className="card flex gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="card flex gap-4">
          <ShieldCheck size={22} style={{ color: 'var(--accent)' }} className="shrink-0" />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Contact details are never public. Talent and clients can only reach each other
            once a client\u2019s company has been verified by our team — that\u2019s what keeps this
            marketplace spam-free on both sides.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <Link to="/register" className="btn btn-primary">
          {track === 'talent' ? 'Create your profile' : 'Start hiring'} <ArrowRight size={16} />
        </Link>
      </section>
    </div>
    </MainLayout>
  );
}