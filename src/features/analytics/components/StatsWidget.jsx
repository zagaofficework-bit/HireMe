const GrowthChart = ({ data = [] }) => {
  if (!data.length)
    return <p className="text-sm text-[var(--text-muted)]">No signup activity yet.</p>;

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-40">
      {data.map((d) => (
        <div key={d._id} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="relative w-full flex justify-center">
            <span className="absolute -top-6 text-xs font-semibold text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
              {d.count}
            </span>
            <div
              className="w-full max-w-[28px] rounded-t-md bg-[var(--accent)] transition-all"
              style={{ height: `${Math.max((d.count / max) * 100, 4)}%`, minHeight: 4 }}
            />
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">
            {new Date(d._id).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        </div>
      ))}
    </div>
  );
};

const TopSkillsList = ({ skills = [] }) => {
  if (!skills.length)
    return <p className="text-sm text-[var(--text-muted)]">No searches logged yet.</p>;

  const max = Math.max(...skills.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {skills.map((s) => (
        <div key={s.skill}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[var(--text-primary)]">{s.skill}</span>
            <span className="text-[var(--text-muted)]">{s.count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const StatsWidget = ({ title, subtitle, children, className = "" }) => (
  <div className={`card ${className}`}>
    <div className="mb-4">
      <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
      {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
    </div>
    {children}
  </div>
);

StatsWidget.GrowthChart = GrowthChart;
StatsWidget.TopSkillsList = TopSkillsList;

export default StatsWidget;