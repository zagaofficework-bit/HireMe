// src/features/company/pages/ClientDashboardPage.jsx
// Hub page for the `client` role: company status, quick stats, recent
// bookmarks preview, quick search, and shortcuts to the dedicated pages
// (full Bookmarks page, Search page, Company edit/public pages).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useMyCompany } from '../../../hooks/useCompany';
import { useRecentBookmarks, useBookmarkTagsCount } from '../../../hooks/useDashboardBookmarks';

// ── Status config (mirrors MyCompanyPage) ──────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', cls: 'status-pill-warning', msg: 'Your company profile is under review by our admin team.' },
  verified: { label: 'Verified',       cls: 'status-pill-success', msg: 'Verified. You can view applicant contact details.' },
  rejected: { label: 'Rejected',       cls: 'status-pill-danger',  msg: 'Your company was rejected. Update details and try again.' },
};

// ── Stat tile ───────────────────────────────────────────────────────────────────
const StatTile = ({ icon, label, value, loading }) => (
  <div className="card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
    <div style={{
      width: 42, height: 42, borderRadius: '0.75rem',
      background: 'var(--accent-soft)', color: 'var(--accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.15rem', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {loading ? '—' : value}
      </p>
      <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </p>
    </div>
  </div>
);

// ── Shortcut card ───────────────────────────────────────────────────────────────
const ShortcutCard = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '1.1rem 1.25rem',
      borderRadius: '1rem',
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%',
      transition: 'border-color 0.2s, transform 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
  >
    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
    <div>
      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</p>
      <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  </button>
);

// ── Bookmark row (compact, not the full card from your Bookmarks page) ──────────
// FIX: was reading `profile.name`, which doesn't exist on your Profile
// schema — every other component in this app (ProfileCardCompact,
// ProfileDetailsSections) uses `fullName`. That mismatch is why every
// row showed the "Unnamed profile" fallback.
const BookmarkRow = ({ bookmark, onClick }) => {
  const profile = bookmark.profile ?? bookmark.profileId ?? {};
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.7rem 0', borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0, fontSize: '0.9rem',
      }}>
        {profile.profileImage?.url
          ? <img src={profile.profileImage.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '👤'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {profile.fullName || 'Unnamed profile'}
        </p>
        {bookmark.tag && (
          <span className="badge badge-accent" style={{ fontSize: '0.6rem', marginTop: '0.15rem' }}>
            {bookmark.tag}
          </span>
        )}
      </div>
    </div>
  );
};

const CompanyDashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: company, isLoading: companyLoading, isError: companyError, error } = useMyCompany();
  const { data: bookmarksData, isLoading: bookmarksLoading } = useRecentBookmarks(4);
  const { data: tags, isLoading: tagsLoading } = useBookmarkTagsCount();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : '/search');
  };

  const isNotFound = companyError && error?.response?.status === 404;
  const status = company ? (STATUS_CONFIG[company.verificationStatus] ?? STATUS_CONFIG.pending) : null;

  return (
    <MainLayout>
      <div style={{ maxWidth: 1000, margin: '2.5rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage your company and find talent
          </p>
        </div>

        {/* ── Company status card ───────────────────────────────────────── */}
        {companyLoading ? (
          <div style={{ height: 90, borderRadius: '1rem', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ) : isNotFound ? (
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                🏢 Set up your company profile
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Create your company profile to start hiring on Hyrd.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/company/me')}>
              Create Company
            </button>
          </div>
        ) : company ? (
          <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '0.875rem',
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {company.logo?.url
                ? <img src={company.logo.url} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '1.5rem' }}>🏢</span>}
            </div>

            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {company.name}
                </h3>
                <span className={`status-pill ${status.cls}`} style={{ fontSize: '0.65rem' }}>{status.label}</span>
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {status.msg}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => navigate('/company/edit')}>
                Edit
              </button>
              {company.slug && (
                <button className="btn btn-ghost" style={{ fontSize: '0.78rem' }} onClick={() => navigate(`/company/${company.slug}`)}>
                  View
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Couldn't load company info. Please refresh.
          </div>
        )}

        {/* ── Quick search bar ──────────────────────────────────────────── */}
        <form onSubmit={handleSearchSubmit} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.6rem' }}>
          <input
            style={{
              flex: 1, padding: '0.6rem 0.9rem', borderRadius: '0.75rem',
              border: '1px solid var(--border)', background: 'var(--bg-input)',
              color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
            }}
            placeholder="Search talent — e.g. React developer, Mumbai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            🔍 Search
          </button>
        </form>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <StatTile
            icon="🔖"
            label="Total Bookmarks"
            value={bookmarksData?.pagination?.total ?? 0}
            loading={bookmarksLoading}
          />
          <StatTile
            icon="🏷"
            label="Bookmark Tags"
            value={Array.isArray(tags) ? tags.length : 0}
            loading={tagsLoading}
          />
          <StatTile
            icon="✓"
            label="Company Status"
            value={company ? status.label : '—'}
            loading={companyLoading}
          />
        </div>

        {/* ── Recent bookmarks + shortcuts ──────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Recent bookmarks preview */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Bookmarks
              </h3>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                onClick={() => navigate('/company/bookmarks')}
              >
                View all →
              </button>
            </div>

            {bookmarksLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 44, borderRadius: '0.5rem', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : bookmarksData?.bookmarks?.length ? (
              <div>
                {bookmarksData.bookmarks.map((b) => (
                  <BookmarkRow
                    key={b._id}
                    bookmark={b}
                    onClick={() => {
                      const pid = b.profile?._id ?? b.profileId?._id ?? b.profileId;
                      if (pid) navigate(`/profile/${pid}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No bookmarks yet. <br />Start searching for talent to bookmark profiles.
              </div>
            )}
          </div>

          {/* Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ShortcutCard
              icon="🔍"
              title="Search Talent"
              desc="Find candidates by skill, location, rate"
              onClick={() => navigate('/search')}
            />
            <ShortcutCard
              icon="🔖"
              title="View Bookmarks"
              desc="All your saved candidates"
              onClick={() => navigate('/company/bookmarks')}
            />
            <ShortcutCard
              icon="🏢"
              title="Edit Company"
              desc="Update profile, logo, contact info"
              onClick={() => navigate(company ? '/company/edit' : '/company/me')}
            />
            {company?.slug && (
              <ShortcutCard
                icon="🌐"
                title="View Public Page"
                desc="See how candidates view your company"
                onClick={() => navigate(`/company/${company.slug}`)}
              />
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default CompanyDashboardPage;