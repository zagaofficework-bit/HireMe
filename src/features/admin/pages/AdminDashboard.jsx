import { useAdminOverview } from "../../../hooks/useAdmin";
import { useAdminAnalytics } from "../../../hooks/useAnalytics";
import AdminSidebar from "../components/AdminSidebar";
import StatsCard from "../components/StatsCard";
import StatsWidget from "../../analytics/components/StatsWidget";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminOverview();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
      <AdminSidebar />

      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Platform Overview
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Live snapshot of users, profiles, and engagement.
          </p>
        </div>

        {isLoading && <p className="text-[var(--text-muted)] text-sm">Loading stats…</p>}
        {isError && <p className="text-[var(--danger)] text-sm">Failed to load overview.</p>}

        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard label="Total Freelancers" value={data.users.total} tone="accent" />
            <StatsCard label="Active" value={data.users.active} tone="success" />
            <StatsCard label="Banned" value={data.users.banned} tone="danger" />
            <StatsCard label="Suspended" value={data.users.suspended} tone="warning" />
            <StatsCard label="Total Clients" value={data.clients.total} tone="info" />
            <StatsCard label="Total Admins" value={data.admins.total} tone="accent" />
            <StatsCard label="Verified Profiles" value={data.profiles.verified} tone="success" />
            <StatsCard label="Featured Profiles" value={data.profiles.featured} tone="info" />
            <StatsCard label="Total Companies" value={data.companies.total} tone="accent" />
            <StatsCard label="Verified Companies" value={data.companies.verified} tone="success" />
            <StatsCard label="Pending Companies" value={data.companies.pending} tone="warning" />
            <StatsCard label="Total Profiles" value={data.profiles.total} tone="accent" />
          </div>
        )}

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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatsCard label="Profile Views (30d)" value={analytics.engagement.profileViews30Days} tone="info" />
            <StatsCard label="New (7d)" value={analytics.growth.newLast7Days} tone="success" />
            <StatsCard label="New (30d)" value={analytics.growth.newLast30Days} tone="accent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;