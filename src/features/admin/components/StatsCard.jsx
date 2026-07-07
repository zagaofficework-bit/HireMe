const StatsCard = ({ label, value, icon, tone = "accent" }) => {
  const toneClasses = {
    accent: "text-[var(--accent)] bg-[var(--accent-soft)]",
    info: "text-[var(--info)] bg-[var(--info-soft)]",
    success: "text-[var(--success)] bg-[rgba(47,212,126,0.12)]",
    warning: "text-[var(--warning)] bg-[rgba(240,169,58,0.12)]",
    danger: "text-[var(--danger)] bg-[rgba(240,96,90,0.12)]",
  };

  return (
    <div className="card flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-[var(--text-primary)] font-display">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;