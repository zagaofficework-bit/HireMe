// profile/components/ProfileDetailsSections.jsx
//
// Extra sections for the full profile details page, styled after the
// reference design (Professional Philosophy / Technical Arsenal /
// Recent Work / Proof of Excellence / CTA) — minus the floating hero
// photo, since the square photo + status row already lives in
// ProfileCard.jsx up top.
//
// LAYOUT CHANGE: quick-glance facts (rate, availability, rating, location)
// and the hire/message actions moved out of ProfileHero and into the new
// ProfileSidebar below. Reasoning: on the public profile page, that block
// was duplicated info sitting in a full-width hero, which is also why the
// page read as "too wide" — a single full-bleed column has nothing to
// anchor the eye. ProfileSidebar is meant to sit next to a narrower main
// content column (see PublicProfilePage.jsx) and stay sticky while the
// visitor scrolls through Experience / Education / etc. ProfileHero is now
// just the photo + headline + intro + availability pill.
//
// Each section returns null when it has nothing to show, so pages can
// render all of them unconditionally without extra guards.
//
// ASSUMPTIONS (confirm / adjust once real data shape is known):
//   - portfolio item: { _id, title, description, image, category, link, techStack: [] }
//   - stats (optional, not seen in current schema): { jobSuccessScore, trackedHours, totalClients, onTimeDelivery }
//   - testimonial (optional): { quote, authorName, authorRole }

import BookmarkButton from '../../bookmark/components/BookmarkButton';

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
    {children}
  </p>
);

// Same defensive helpers as ProfileCard.jsx — hourlyRate and skill entries
// can come back as objects ({ amount, currency } / { name }) depending on
// the backend response; never render those objects directly as JSX children.
const formatRate = (rate) => {
  if (rate === null || rate === undefined) return null;
  if (typeof rate === 'number' || typeof rate === 'string') return `$${rate} / hour`;
  if (typeof rate === 'object') {
    const amount = rate.amount ?? rate.min ?? rate.value;
    if (amount === undefined || amount === null) return null;
    const currency = rate.currency;
    const symbol = !currency || currency === 'USD' ? '$' : `${currency} `;
    return `${symbol}${amount} / hour`;
  }
  return null;
};

const skillLabel = (skill) => {
  if (typeof skill === 'string') return skill;
  if (skill && typeof skill === 'object') return skill.name || skill.skill || '';
  return '';
};

const AVAILABILITY_STATUS = {
  available: { label: 'Available for hire', color: 'var(--success)' },
  active: { label: 'Active now', color: 'var(--info)' },
  online: { label: 'Active now', color: 'var(--info)' },
  busy: { label: 'Busy', color: 'var(--warning)' },
  offline: { label: 'Offline', color: 'var(--text-muted)' },
};

const getAvailabilityStatus = (availability) => AVAILABILITY_STATUS[availability] || AVAILABILITY_STATUS.offline;

// ── Hero — the "impress the client" header for the PUBLIC profile page. ────
// Floating framed photo on the right with an accent square peeking out
// behind it, "Available for Hire" pill, a two-tone headline, short intro.
// Rate / rating / location live in ProfileSidebar now (see note above) so
// this stays focused on making a strong first visual impression rather
// than repeating facts the sidebar already shows.
//
// ASSUMPTION: there's no `headline`/`tagline` field in the current schema,
// so one is generated from `category` when not present. Add a `headline`
// field on Profile if you want freelancers to write their own — the
// component will use it automatically once it exists.
export const ProfileHero = ({ profile }) => {
  if (!profile) return null;

  const { fullName, bio, profileImage, category, availability } = profile;

  const rawHeadline = profile.headline || `Delivering ${category?.name || 'Expert'} Work That Scales`;
  const words = rawHeadline.split(' ');
  const splitAt = Math.max(1, words.length - 2);
  const headlineStart = words.slice(0, splitAt).join(' ');
  const headlineEnd = words.slice(splitAt).join(' ');

  const intro = profile.tagline || (bio && bio.length > 160 ? `${bio.slice(0, 160)}…` : bio);

  return (
    <div className="rounded-3xl p-6 sm:p-10" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {availability === 'available' && (
            <span className="status-pill status-pill-success mb-4 inline-flex">● Available for Hire</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
            {headlineStart} <span style={{ color: 'var(--accent)' }}>{headlineEnd}</span>
          </h1>
          {intro && (
            <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              {intro}
            </p>
          )}
        </div>

        <div className="relative mx-auto md:ml-auto">
          <div
            className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl"
            style={{ background: 'var(--accent)' }}
            aria-hidden
          />
          <img
            src={profileImage?.url || '/default-avatar.png'}
            alt={fullName}
            className="relative w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-2xl border-4 shadow-xl"
            style={{ borderColor: 'var(--bg-card)' }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Sidebar — quick-glance facts + hire/message actions. ───────────────────
// Meant to sit alongside a narrower main content column and stay sticky
// while the visitor scrolls (see PublicProfilePage.jsx). This is what the
// rate/rating/location row used to be inside ProfileHero.
export const ProfileSidebar = ({ profile, onHire, onMessage }) => {
  if (!profile) return null;

  const { fullName, averageRating = 0, totalReviews = 0, location, hourlyRate, availability } = profile;
  const rate = formatRate(hourlyRate);
  const status = getAvailabilityStatus(availability);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: status.color }} />
        <span className="text-sm font-semibold" style={{ color: status.color }}>{status.label}</span>
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Rate</p>
        <p className="text-2xl font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>{rate || 'Not set'}</p>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Rating</p>
          <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
            ★ {averageRating.toFixed(1)} <span style={{ color: 'var(--text-muted)' }}>({totalReviews})</span>
          </p>
        </div>
        {location?.city && (
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Location</p>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
              {location.city}{location.state ? `, ${location.state}` : ''}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <button className="btn btn-primary w-full" onClick={onHire}>
          Hire {fullName?.split(' ')[0]}
        </button>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex-1" onClick={onMessage}>
            Send Message
          </button>
          <BookmarkButton profileId={profile._id} variant="icon" />
        </div>
      </div>
    </div>
  );
};

// ── Professional Philosophy + Technical Arsenal (two-column) ──────────────
export const AboutSection = ({ bio, skills = [] }) => {
  if (!bio && skills.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {bio && (
        <div className="card md:col-span-2 relative overflow-hidden">
          <span
            className="absolute top-2 right-4 text-7xl font-serif select-none leading-none opacity-10"
            style={{ color: 'var(--accent)' }}
          >
            &rdquo;
          </span>
          <SectionLabel>Professional Philosophy</SectionLabel>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {bio}
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--accent)' }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--accent-text)', opacity: 0.85 }}
          >
            Technical Arsenal
          </p>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-center px-2 py-2 rounded-lg text-xs font-bold truncate"
                style={{ background: 'rgba(255,255,255,0.16)', color: 'var(--accent-text)' }}
                title={skillLabel(skill)}
              >
                {skillLabel(skill)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Recent Work / Portfolio grid ───────────────────────────────────────────
export const RecentWork = ({ portfolio = [], editable = false, onAddClick }) => {
  if (portfolio.length === 0) {
    if (!editable) return null;
    return (
      <div>
        <SectionLabel>Selected Case Studies</SectionLabel>
        <div
          className="card border-dashed text-center py-10 cursor-pointer"
          style={{ borderStyle: 'dashed' }}
          onClick={onAddClick}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No projects added yet — showcase your best work here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <SectionLabel>Selected Case Studies</SectionLabel>
          <h3 className="text-2xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
            Recent Work
          </h3>
        </div>
        {editable ? (
          <button className="btn btn-secondary" onClick={onAddClick}>
            + Add Project
          </button>
        ) : portfolio.length > 2 && (
          <button className="btn btn-secondary">
            View All Projects
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {portfolio.map((item) => (
          <div key={item._id || item.title} className="card p-0 overflow-hidden flex flex-col">
            {item.image?.url || item.image ? (
              <img
                src={item.image?.url || item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40" style={{ background: 'var(--bg-elevated)' }} />
            )}
            <div className="p-5 flex-1 flex flex-col">
              {item.category && (
                <span className="badge badge-accent w-fit mb-2">
                  {typeof item.category === 'string' ? item.category : item.category.name}
                </span>
              )}
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
              {item.description && (
                <p className="text-sm leading-relaxed line-clamp-3 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              )}
              {item.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
                  {item.techStack.map((t, i) => (
                    <span key={i} className="badge badge-info">{skillLabel(t)}</span>
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold mt-auto"
                  style={{ color: 'var(--accent)' }}
                >
                  View Project →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Proof of Excellence: stats + testimonial ───────────────────────────────
export const ProofOfExcellence = ({ stats, testimonial }) => {
  if (!stats && !testimonial) return null;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {stats && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-elevated)' }}>
          <SectionLabel>Proof of Excellence</SectionLabel>
          {typeof stats.jobSuccessScore === 'number' && (
            <p className="text-5xl font-extrabold mb-1" style={{ color: 'var(--accent)' }}>
              {stats.jobSuccessScore}%
            </p>
          )}
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {typeof stats.trackedHours === 'number' ? `Job Success Score across ${stats.trackedHours.toLocaleString()}+ tracked hours` : 'Job Success Score'}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {typeof stats.totalClients === 'number' && (
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalClients}+</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Global Clients</p>
              </div>
            )}
            {typeof stats.onTimeDelivery === 'number' && (
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.onTimeDelivery}%</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>On-Time Delivery</p>
              </div>
            )}
          </div>
        </div>
      )}

      {testimonial && (
        <div className="card flex flex-col justify-between">
          <div>
            <span className="text-amber-400 text-sm tracking-widest">★★★★★</span>
            <p className="text-sm italic leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
              "{testimonial.quote}"
            </p>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div
              className="w-9 h-9 rounded-full flex-shrink-0"
              style={{ background: 'var(--accent-soft)' }}
            />
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{testimonial.authorName}</p>
              {testimonial.authorRole && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{testimonial.authorRole}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Closing CTA ─────────────────────────────────────────────────────────────
export const ProfileCTA = ({ fullName, onHire, onMessage }) => (
  <div
    className="rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
    style={{ background: 'var(--bg-elevated)' }}
  >
    <div>
      <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
        Ready to start your next project?
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Get in touch with {fullName}.
      </p>
    </div>
    <div className="flex gap-3">
      <button className="btn btn-primary" onClick={onHire}>
        Hire {fullName?.split(' ')[0]}
      </button>
      <button className="btn btn-secondary" onClick={onMessage}>
        Send Message
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// DISPLAY COMPONENTS — read-only, polished versions of the profile data
// sections, styled to match Hero/Sidebar/RecentWork above. Used on
// MyProfilePage (own profile) and PublicProfilePage (client-facing view).
//
// These are intentionally SEPARATE from ExperienceSection.jsx,
// EducationSection.jsx, LanguagesSection.jsx, CertificationsSection.jsx,
// SocialSection.jsx and PreferencesSection.jsx — those own the edit
// forms and stay wired into EditProfilePage only. Mixing an editable
// form's "read mode" (plain list, generic .profile-section classes)
// into a page meant to impress a client was the actual bug — two very
// different jobs were sharing one component. Each display component
// below returns null when there's no data, so pages can render all of
// them unconditionally.
// ═══════════════════════════════════════════════════════════════════════

// ── Experience — vertical timeline ──────────────────────────────────────
const formatMonthYear = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ExperienceDisplay = ({ experience = [] }) => {
  if (!experience || experience.length === 0) return null;

  return (
    <div>
      <SectionLabel>Career Journey</SectionLabel>
      <h3 className="text-2xl font-extrabold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
        Experience
      </h3>

      <div className="card">
        <div className="relative pl-7">
          <div
            className="absolute left-[7px] top-1 bottom-1 w-px"
            style={{ background: 'var(--border)' }}
            aria-hidden
          />
          {experience.map((entry, i) => (
            <div key={entry._id || i} className={i > 0 ? 'mt-6' : ''}>
              <span
                className="absolute -ml-7 mt-1 w-3.5 h-3.5 rounded-full border-2"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--accent)' }}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>{entry.company}</p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                >
                  {formatMonthYear(entry.startDate)} – {entry.isCurrent ? 'Present' : formatMonthYear(entry.endDate) || '—'}
                </span>
              </div>
              {entry.description && (
                <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {entry.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Education — compact list with degree/institution/year ───────────────
export const EducationDisplay = ({ education = [] }) => {
  if (!education || education.length === 0) return null;

  return (
    <div>
      <SectionLabel>Academic Background</SectionLabel>
      <h3 className="text-2xl font-extrabold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
        Education
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {education.map((entry, i) => (
          <div key={entry._id || i} className="card flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'var(--accent-soft)' }}
            >
              🎓
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{entry.degree}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{entry.institution}</p>
              {entry.year && (
                <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{entry.year}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Certifications — badge-card grid with credential links ──────────────
export const CertificationsDisplay = ({ certifications = [] }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div>
      <SectionLabel>Verified Credentials</SectionLabel>
      <h3 className="text-2xl font-extrabold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
        Certifications
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {certifications.map((c, i) => (
          <div key={i} className="card flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              📜
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {c.issuer}{c.year ? ` · ${c.year}` : ''}
              </p>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold mt-1.5 inline-block"
                  style={{ color: 'var(--accent)' }}
                >
                  View credential →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Languages — proficiency chips ────────────────────────────────────────
const PROFICIENCY_WEIGHT = { native: 4, fluent: 3, conversational: 2, basic: 1 };

export const LanguagesDisplay = ({ languages = [] }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <div>
      <SectionLabel>Languages</SectionLabel>
      <div className="card flex flex-wrap gap-2.5">
        {languages.map((lang, i) => {
          const weight = PROFICIENCY_WEIGHT[lang.proficiency] || 1;
          return (
            <div
              key={`${lang.name}-${i}`}
              className="flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="flex items-center gap-0.5" aria-hidden>
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: n <= weight ? 'var(--accent)' : 'var(--border)' }}
                  />
                ))}
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lang.name}</span>
              <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{lang.proficiency}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Social — icon link row ───────────────────────────────────────────────
const SOCIAL_META = {
  linkedin: { label: 'LinkedIn', icon: '💼' },
  github: { label: 'GitHub', icon: '💻' },
  website: { label: 'Website', icon: '🌐' },
};

export const SocialDisplay = ({ social = {} }) => {
  const links = Object.entries(SOCIAL_META).filter(([key]) => social?.[key]);
  if (links.length === 0) return null;

  return (
    <div>
      <SectionLabel>Find Me Online</SectionLabel>
      <div className="flex flex-wrap gap-2.5">
        {links.map(([key, meta]) => (
          <a
            key={key}
            href={social[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <span aria-hidden>{meta.icon}</span>
            {meta.label}
          </a>
        ))}
      </div>
    </div>
  );
};

// ── Preferences — quick-fact grid (view-only, not a form) ───────────────
const formatLabel = (value) => (value ? value.replace(/_/g, ' ') : '—');

const formatMoney = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || amount === '') return null;
  const symbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString()}`;
};

export const PreferencesDisplay = ({ profile = {} }) => {
  const { workType, jobType, availability, expectedSalary, hourlyRate } = profile;
  const salaryMin = formatMoney(expectedSalary?.min, expectedSalary?.currency);
  const salaryMax = formatMoney(expectedSalary?.max, expectedSalary?.currency);
  const rate = formatMoney(hourlyRate?.amount, hourlyRate?.currency);

  const facts = [
    { label: 'Work Type', value: formatLabel(workType) },
    { label: 'Job Type', value: formatLabel(jobType) },
    { label: 'Availability', value: formatLabel(availability) },
    { label: 'Hourly Rate', value: rate ? `${rate}/hr` : '—' },
    { label: 'Expected Salary', value: salaryMin || salaryMax ? `${salaryMin || '0'} – ${salaryMax || '0'}` : '—' },
  ];

  if (facts.every((f) => f.value === '—')) return null;

  return (
    <div>
      <SectionLabel>Working Style</SectionLabel>
      <h3 className="text-2xl font-extrabold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
        Work Preferences
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {facts.map((f) => (
          <div key={f.label} className="card">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              {f.label}
            </p>
            <p className="text-sm font-bold mt-1.5 capitalize" style={{ color: 'var(--text-primary)' }}>
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};