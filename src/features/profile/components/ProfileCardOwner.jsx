// ─────────────────────────────────────────────────────────────────────────
// ProfileCardOwner — same visual language as ProfileCardCompact, but for
// the freelancer viewing their OWN profile (MyProfilePage). No Hire Now,
// no View Profile, no Bookmark — just a single Edit Profile action.
//
// Kept as a separate component from ProfileCardCompact (rather than adding
// an isOwner flag to it) so SearchPage / anywhere else that renders
// ProfileCardCompact for client-browsing stays untouched.
// ─────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

const STATUS_MAP = {
  available: { label: 'Available', dot: 'var(--success)', text: 'var(--success)' },
  active: { label: 'Active Now', dot: 'var(--info)', text: 'var(--info)' },
  online: { label: 'Online', dot: 'var(--success)', text: 'var(--success)' },
  busy: { label: 'Busy', dot: 'var(--warning)', text: 'var(--warning)' },
  offline: { label: 'Offline', dot: 'var(--text-muted)', text: 'var(--text-muted)' },
};

const getStatus = (availability) => STATUS_MAP[availability] || STATUS_MAP.offline;

const WORK_TYPE_LABELS = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
  'on-site': 'On-site',
};

const formatWorkType = (workType) => WORK_TYPE_LABELS[workType?.toLowerCase()] || null;

// Handles both a plain number (700) and the backend's { amount, currency } shape.
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
const formatRate = (hourlyRate) => {
  if (!hourlyRate) return 'Not set';
  if (typeof hourlyRate === 'number') return `$${hourlyRate}/hr`;
  const { amount, currency } = hourlyRate;
  if (!amount) return 'Not set';
  const symbol = CURRENCY_SYMBOLS[currency] || currency || '$';
  return `${symbol}${amount}/hr`;
};

const Stars = ({ rating = 0, size = 'w-3 h-3' }) => (
  <span className="inline-flex items-center gap-0.5 text-amber-400">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        className={size}
        fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </span>
);

const tiltFor = (seed = '') => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  return (hash % 7) - 3;
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'U';

const AvatarFallback = ({ name }) => (
  <div
    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
  >
    {getInitials(name)}
  </div>
);

const EditIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export const ProfileCardOwner = ({ profile, onEditClick }) => {
  const [imgError, setImgError] = useState(false);

  if (!profile) return null;

  const {
    _id,
    fullName,
    profileImage,
    category,
    averageRating = 0,
    totalReviews = 0,
    availability,
    skills = [],
    hourlyRate,
    workType,
  } = profile;

  const status = getStatus(availability);
  const workTypeLabel = formatWorkType(workType);
  const rateLabel = formatRate(hourlyRate);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Avatar + name/role + rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative flex-shrink-0 transition-transform duration-200 hover:rotate-0"
            style={{ transform: `rotate(${tiltFor(_id || fullName)}deg)` }}
          >
            {profileImage?.url && !imgError ? (
              <img
                src={profileImage.url}
                alt={fullName}
                onError={() => setImgError(true)}
                className="w-12 h-12 rounded-xl object-cover border-2"
                style={{ borderColor: 'var(--bg-card)', boxShadow: '0 0 0 1px var(--border)' }}
              />
            ) : (
              <AvatarFallback name={fullName} />
            )}
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: status.dot, borderColor: 'var(--bg-card)' }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {fullName}
            </h3>
            <p className="text-[10.5px] font-bold uppercase tracking-wide truncate" style={{ color: 'var(--accent)' }}>
              {category?.name || 'Freelancer'}
              {workTypeLabel && (
                <span style={{ color: 'var(--text-muted)' }}> · {workTypeLabel}</span>
              )}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          {totalReviews > 0 ? (
            <>
              <div className="flex items-center gap-1 justify-end">
                <Stars rating={averageRating} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-[9.5px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {totalReviews} jobs
              </p>
            </>
          ) : (
            <span
              className="px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wide"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Skill tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md text-[9.5px] font-bold"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {(skill.name || skill).toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Rate / status row */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Hourly Rate
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{rateLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Status
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: status.text }}>{status.label}</p>
        </div>
      </div>

      {/* Owner action — Edit Profile only. No Hire/View/Bookmark: this is
         the freelancer's own read-only preview of their card, not a
         listing another user is browsing. */}
      <div className="mt-3.5">
        <button
          onClick={() => (onEditClick ? onEditClick(_id) : undefined)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-[var(--accent)]/5"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          <EditIcon className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>
    </div>
  );
};