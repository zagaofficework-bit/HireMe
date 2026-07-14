import { Link } from "react-router-dom";
import { useAdminOverview } from "../../../hooks/useAdmin";
import { useAdminAnalytics } from "../../../hooks/useAnalytics";
import MainLayout from "../../../layouts/MainLayout";
import AdminSidebar from "../components/AdminSidebar";
import StatsCard from "../components/StatsCard";
import StatsWidget from "../../analytics/components/StatsWidget";

const AlertIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2.5 px-0.5">
    {children}
  </p>
);

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminOverview();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  const pendingCompanies = data?.companies?.pending ?? 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        <AdminSidebar />

        <div className="flex-1 min-w-0 space-y-7">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                Platform Overview
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Live snapshot of users, profiles, and engagement across Hyrd.
              </p>
            </div>
          </div>

          {isLoading && <p className="text-[var(--text-muted)] text-sm">Loading stats…</p>}
          {isError && <p className="text-[var(--danger)] text-sm">Failed to load overview.</p>}

          {/* ── Needs-review banner — only appears when there's something
             actionable, so it doesn't compete for attention when the
             queue is empty. ── */}
          {pendingCompanies > 0 && (
            <Link
              to="/admin/companies"
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors hover:opacity-90"
              style={{ background: 'rgba(240,169,58,0.08)', borderColor: 'rgba(240,169,58,0.3)' }}
            >
              <AlertIcon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
              <p className="text-sm font-semibold flex-1 min-w-0" style={{ color: 'var(--warning)' }}>
                {pendingCompanies} {pendingCompanies === 1 ? "company is" : "companies are"} waiting on verification
              </p>
              <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--warning)' }}>
                Review →
              </span>
            </Link>
          )}

          {data && (
            <>
              <div>
                <SectionLabel>People</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  <StatsCard label="Total Freelancers" value={data.users.total} tone="accent" />
                  <StatsCard label="Active" value={data.users.active} tone="success" />
                  <StatsCard label="Suspended" value={data.users.suspended} tone="warning" />
                  <StatsCard label="Banned" value={data.users.banned} tone="danger" />
                  <StatsCard label="Total Clients" value={data.clients.total} tone="info" />
                </div>
              </div>

              <div>
                <SectionLabel>Profiles</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <StatsCard label="Total Profiles" value={data.profiles.total} tone="accent" />
                  <StatsCard label="Verified Profiles" value={data.profiles.verified} tone="success" />
                  <StatsCard label="Featured Profiles" value={data.profiles.featured} tone="info" />
                </div>
              </div>

              <div>
                <SectionLabel>Companies &amp; Admins</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard label="Total Companies" value={data.companies.total} tone="accent" />
                  <StatsCard label="Verified Companies" value={data.companies.verified} tone="success" />
                  <StatsCard label="Pending Companies" value={data.companies.pending} tone="warning" />
                  <StatsCard label="Total Admins" value={data.admins.total} tone="accent" />
                </div>
              </div>
            </>
          )}

          {/* ── Analytics ── */}
          <div>
            <SectionLabel>Analytics</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <StatsWidget
                title="Signups — last 7 days"
                subtitle={analytics ? `${analytics.growth.newLast30Days} new in last 30 days` : undefined}
                className="lg:col-span-2"
              >
                {analyticsLoading ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading…</p>
                ) : (
                  <StatsWidget.GrowthChart data={analytics?.growth?.dailyBreakdown} />
                )}
              </StatsWidget>

              <StatsWidget title="Top searched skills" subtitle="All time">
                {analyticsLoading ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading…</p>
                ) : (
                  <StatsWidget.TopSkillsList skills={analytics?.engagement?.topSearchedSkills} />
                )}
              </StatsWidget>
            </div>

            {analytics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                <StatsCard label="Profile Views (30d)" value={analytics.engagement.profileViews30Days} tone="info" />
                <StatsCard label="New (7d)" value={analytics.growth.newLast7Days} tone="success" />
                <StatsCard label="New (30d)" value={analytics.growth.newLast30Days} tone="accent" />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;