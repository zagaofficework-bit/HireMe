// src/components/shared/ThemeToggle.jsx
import { useTheme } from './ThemeContext';

const SunIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} />
    <path
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
    />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  </svg>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        relative w-12 h-6 rounded-full border transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
        ${isDark
          ? 'bg-[var(--bg-input)] border-[var(--border-strong)]'
          : 'bg-[var(--info-soft)] border-[var(--border)]'}
      `}
    >
      <div
        className={`
          absolute top-0.5 w-5 h-5 rounded-full shadow-md
          flex items-center justify-center
          transition-all duration-300
          ${isDark
            ? 'left-0.5 bg-[var(--bg-elevated)] text-[var(--accent)]'
            : 'left-[calc(100%-22px)] bg-[var(--accent)] text-[var(--accent-text)]'}
        `}
      >
        {isDark ? <MoonIcon className="w-3 h-3" /> : <SunIcon className="w-3 h-3" />}
      </div>
    </button>
  );
};

export default ThemeToggle;