import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, User, Briefcase, ShieldCheck, CreditCard, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layouts/MainLayout';

/**
 * HelpCenterPage
 * FAQ content is derived from the actual business rules in the Hyrd
 * developer guide (role permanence, contact gating, one-profile rule,
 * review policy, visibility toggle, verification) so answers stay accurate
 * as the product evolves — update this array if those rules change.
 */

const CATEGORIES = [
  { key: 'talent', label: 'For Talent', icon: User },
  { key: 'client', label: 'For Clients', icon: Briefcase },
  { key: 'trust', label: 'Trust & Verification', icon: ShieldCheck },
  { key: 'account', label: 'Account & Billing', icon: CreditCard },
];

const FAQS = [
  {
    category: 'talent',
    q: 'Can I switch from a talent account to a client account?',
    a: 'No — roles are permanent once you register. If you need both, create a separate client account with a different email.',
  },
  {
    category: 'talent',
    q: 'How do I stop showing up in search?',
    a: 'Toggle "Hide profile" in your profile settings. It takes effect immediately — your profile stops appearing in search and returns a 403 to anyone viewing it directly, until you turn it back on.',
  },
  {
    category: 'talent',
    q: 'Why can\u2019t I create a second profile?',
    a: 'Hyrd allows one profile per user. If you already have one, head to your dashboard to edit it instead of creating a new one.',
  },
  {
    category: 'talent',
    q: 'Who can see my phone number and email?',
    a: 'Nobody, by default. A client can only see your contact details after they\u2019re verified as a client (their company has been reviewed and approved by our team) and are viewing your profile directly.',
  },
  {
    category: 'client',
    q: 'Why can\u2019t I see a talent\u2019s phone number?',
    a: 'Contact details unlock once your company profile is verified by our team. This keeps talent from getting cold-contacted before a client is confirmed legitimate.',
  },
  {
    category: 'client',
    q: 'How long does company verification take?',
    a: 'Usually 1-2 business days. You\u2019ll get a notification the moment your company is verified or if we need more information.',
  },
  {
    category: 'client',
    q: 'Can I leave more than one review for the same person?',
    a: 'No — one review per client per talent. If you\u2019ve already reviewed someone, you\u2019ll see an edit option instead of a new submit button.',
  },
  {
    category: 'client',
    q: 'How do I save profiles to revisit later?',
    a: 'Use the bookmark icon on any profile. You can tag bookmarks (e.g. "React Developers") and add private notes for your own reference.',
  },
  {
    category: 'trust',
    q: 'What does the "verified" badge mean?',
    a: 'For talent, it means our team has confirmed their identity and credentials. For companies, it means the business itself has been reviewed and approved before contact details are shared.',
  },
  {
    category: 'trust',
    q: 'How do I report a fake profile or abusive content?',
    a: 'Use the "Report" action on the profile in question and pick a reason. Our trust & safety team reviews every report and will notify you once it\u2019s resolved.',
  },
  {
    category: 'trust',
    q: 'What happens if my account is banned or suspended?',
    a: 'You\u2019ll be signed out and see a clear reason on your next login attempt. Banned accounts are permanent; suspensions are temporary and lift automatically.',
  },
  {
    category: 'account',
    q: 'How is my profile completion percentage calculated?',
    a: 'It reflects how many sections you\u2019ve filled in — bio, skills, experience, education, preferences, location, and more. Filling every section maximizes how often you surface in search.',
  },
  {
    category: 'account',
    q: 'What file types can I upload?',
    a: 'Profile photos: JPG, PNG, or WebP up to 2MB. Resumes: PDF up to 5MB. Portfolio images: JPG, PNG, or WebP up to 3MB each, 10 items max.',
  },
  {
    category: 'account',
    q: 'I deleted my profile by mistake — is it recoverable?',
    a: 'Deleting hides your profile rather than erasing it. Contact support and we can restore it for you.',
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('talent');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    const byCategory = FAQS.filter((f) => f.category === activeCategory);
    if (!query.trim()) return byCategory;
    const q = query.toLowerCase();
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query, activeCategory]);

  return (
    <MainLayout>
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">How can we help?</h1>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="theme-input w-full rounded-xl pl-11 pr-4 py-3.5"
            placeholder="Search for answers — e.g. contact details, verification, reviews"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Category chips — hidden while actively searching across all */}
      {!query.trim() && (
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveCategory(key); setOpenIndex(null); }}
                className="btn text-sm"
                style={
                  activeCategory === key
                    ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                    : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                }
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FAQ list */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <p className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
            No results for "{query}" — try a different term, or reach out below.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={f.q} className="card !p-0 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  >
                    <span className="font-medium text-sm sm:text-base">{f.q}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform"
                      style={{
                        color: 'var(--text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Fallback CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="card flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-8">
          <div className="flex items-center gap-3">
            <Mail size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <div className="font-semibold text-sm">Still stuck?</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Our support team replies within a business day.
              </p>
            </div>
          </div>
          <Link to="/contact" className="btn btn-primary shrink-0">Contact us</Link>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}