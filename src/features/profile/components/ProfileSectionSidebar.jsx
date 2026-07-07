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
// Mobile (< md): horizontal swipeable pill bar, icon over label, dot
// moves to a corner badge. Desktop (>= md): vertical list, as before.
// Pure Tailwind — no separate CSS file needed.

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
  return (
    <nav
      className="
        flex flex-row md:flex-col
        gap-2 md:gap-1
        overflow-x-auto md:overflow-visible
        scrollbar-thin
        px-1 pb-3 md:p-0
        -mx-1 md:mx-0
        border-b md:border-b-0
        snap-x snap-proximity md:snap-none
        md:w-56 md:flex-shrink-0
      "
      style={{ borderColor: 'var(--border)' }}
    >
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
              relative flex-shrink-0 snap-start
              flex flex-col md:flex-row items-center
              gap-1 md:gap-2.5
              w-[4.75rem] md:w-auto
              px-2.5 py-2.5 md:px-3 md:py-2.5
              rounded-2xl md:rounded-xl
              border text-xs md:text-sm font-semibold
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

            {/* Full label — always shown on desktop, shown on mobile only
               when the pill is active (keeps the strip compact + scannable) */}
            <span
              className={`
                text-center md:text-left leading-tight whitespace-normal md:flex-1
                ${isActive ? 'block' : 'hidden md:block'}
              `}
            >
              {s.label}
            </span>

            {/* Completion dot — corner badge on mobile, inline on desktop */}
            {!s.danger && !isLocked && (
              <span
                className={`absolute top-1.5 right-1.5 md:static w-[7px] h-[7px] rounded-full flex-shrink-0 ${dotColor(done, isRequired)}`}
                title={done ? 'Complete' : isRequired ? 'Required' : 'Optional'}
              />
            )}

            {/* Lock glyph instead of a dot when the section isn't reachable yet */}
            {isLocked && (
              <span className="absolute top-1.5 right-1.5 md:static text-[0.65rem] md:text-xs flex-shrink-0" aria-hidden="true">
                🔒
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default ProfileSectionSidebar;