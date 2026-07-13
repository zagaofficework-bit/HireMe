// profile/components/ProfileSectionSidebar.jsx
// Shared nav used by both the "create profile" flow and the full edit
// page, so the section list/behavior never drifts between the two.
//
// - `completion`   → { [sectionId]: boolean } powers the status dot
// - `requiredIds`  → sections that must be done before "Submit for Approval"
// - `lockedIds`    → sections that can't be opened yet (e.g. before the
//                    profile exists). Locked items render disabled with
//                    a tooltip instead of being hidden, so the user can
//                    see what's coming next.
//
// Desktop (>= md): vertical icon+label list, sticky — unchanged.
// Mobile (< md): the old horizontal icon-pill strip just overflowed and
// got cut off on narrow screens, so it's replaced with a compact
// step-progress bar ("STEP 3: LOCATION" · "3 of 12" · filled track).
// The mobile "what's coming up" pills now live in the separate
// <UpcomingSections> export below, meant to render *after* the active
// section's form card — matching the reference design where that list
// sits under the card, not squeezed above it. Pure Tailwind, no
// separate CSS needed for either.

const dotColor = (done, isRequired) => {
  if (done) return 'bg-[var(--success)] opacity-100';
  if (isRequired) return 'bg-[var(--warning)] opacity-60';
  return 'bg-[var(--border-strong)] opacity-60';
};

const ProfileSectionSidebar = ({
  sections,
  activeSection,
  onSelect,
  completion = {},
  requiredIds = [],
  lockedIds = [],
}) => {
  const flowSections = sections.filter((s) => !s.danger);
  const activeMeta = sections.find((s) => s.id === activeSection) || sections[0];
  const isDangerActive = Boolean(activeMeta?.danger);
  const flowIndex = flowSections.findIndex((s) => s.id === activeSection);
  const stepNumber = isDangerActive ? flowSections.length : flowIndex + 1;
  const total = flowSections.length;
  const progressPct = total ? Math.round((stepNumber / total) * 100) : 0;

  return (
    <>
      {/* ── Mobile: step-progress bar (replaces the old icon strip) ── */}
      <div className="md:hidden flex flex-col gap-2 w-full mb-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[0.68rem] font-bold tracking-wide uppercase truncate"
            style={{ color: isDangerActive ? 'var(--danger)' : 'var(--accent)' }}
          >
            Step {stepNumber}: {activeMeta?.label}
          </span>
          {!isDangerActive && (
            <span className="text-[0.7rem] font-semibold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {stepNumber} of {total}
            </span>
          )}
        </div>
        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              background: isDangerActive
                ? 'var(--danger)'
                : 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            }}
          />
        </div>
      </div>

      {/* ── Desktop: vertical list, unchanged ── */}
      <nav className="hidden md:flex md:flex-col gap-1 md:w-56 md:flex-shrink-0">
        {sections.map((s) => {
          const done = completion[s.id];
          const isRequired = requiredIds.includes(s.id);
          const isLocked = lockedIds.includes(s.id);
          const isActive = activeSection === s.id;

          return (
            <button
              key={s.id}
              type="button"
              disabled={isLocked}
              title={isLocked ? 'Save Basic Info first to unlock this section' : undefined}
              onClick={() => !isLocked && onSelect(s.id)}
              className={`
                relative flex items-center gap-2.5
                px-3 py-2.5
                rounded-xl
                border text-sm font-semibold
                transition-colors
                ${isLocked ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--accent)]'}
              `}
              style={{
                backgroundColor: isActive ? 'var(--accent-soft)' : 'var(--bg-card)',
                borderColor: isActive ? 'var(--accent)' : s.danger ? 'rgba(240,96,90,0.25)' : 'var(--border)',
                color: isActive ? 'var(--accent)' : s.danger ? 'var(--danger)' : 'var(--text-primary)',
              }}
            >
              <span className="text-base leading-none">{s.icon}</span>
              <span className="flex-1 text-left leading-tight">{s.label}</span>

              {!s.danger && !isLocked && (
                <span
                  className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dotColor(done, isRequired)}`}
                  title={done ? 'Complete' : isRequired ? 'Required' : 'Optional'}
                />
              )}
              {isLocked && (
                <span className="text-xs flex-shrink-0" aria-hidden="true">🔒</span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

// Mobile-only "what's next" pill row — render this right after the
// active section's form card (see EditProfilePage.jsx). Shows the next
// few sections in order, locked ones disabled with a lock glyph,
// completed ones with a small status dot. Hidden entirely on desktop
// since the full vertical list already shows everything there.
export const UpcomingSections = ({
  sections,
  activeSection,
  onSelect,
  completion = {},
  lockedIds = [],
  max = 4,
}) => {
  const flowSections = sections.filter((s) => !s.danger);
  const activeIndex = flowSections.findIndex((s) => s.id === activeSection);
  const upcoming = flowSections.slice(activeIndex + 1, activeIndex + 1 + max);

  if (upcoming.length === 0) return null;

  return (
    <div className="md:hidden flex flex-col gap-2.5 pt-1">
      <span
        className="text-[0.68rem] font-bold tracking-wider uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Upcoming sections
      </span>
      <div className="flex flex-wrap gap-2">
        {upcoming.map((s) => {
          const isLocked = lockedIds.includes(s.id);
          const done = completion[s.id];
          return (
            <button
              key={s.id}
              type="button"
              disabled={isLocked}
              title={isLocked ? 'Save Basic Info first to unlock this section' : undefined}
              onClick={() => !isLocked && onSelect(s.id)}
              className={`
                inline-flex items-center gap-1.5
                px-3 py-2
                rounded-full border text-xs font-semibold
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--accent)]'}
              `}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className="text-sm leading-none">{s.icon}</span>
              {s.label}
              {isLocked && <span className="text-[0.65rem]" aria-hidden="true">🔒</span>}
              {!isLocked && done && (
                <span
                  className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'var(--success)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSectionSidebar;