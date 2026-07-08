// src/layouts/AuthLayout.jsx
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/shared/ThemeToggle';

const AuthLayout = ({
  icon,
  leftHeading,
  leftText,
  leftExtra,
  eyebrow,
  title,
  subtitle,
  error,
  showBack = false,
  backTo,
  footerLinks = [],
  leftWidthClass = 'lg:w-1/2',
  rightWidthClass = 'lg:w-1/2',
  children,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo === undefined || backTo === null) {
      navigate(-1);
    } else {
      navigate(backTo);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-page)]">

      {/* ── Left branding panel — desktop/tablet-landscape only ───────── */}
      <div
        className={`hidden lg:flex ${leftWidthClass} relative flex-col justify-center
          px-10 xl:px-16 py-12 bg-gradient-to-br from-[var(--color-dark-teal-950)] via-[var(--color-dark-teal-800)] to-[var(--bg-page)] border-r border-[var(--accent)]/10
          overflow-hidden`}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          {icon && (
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-8">
              {icon}
            </div>
          )}
          <h1 className="text-3xl xl:text-4xl font-black text-[var(--text-primary)] leading-tight mb-4">
            {leftHeading}
          </h1>
          {leftText && (
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{leftText}</p>
          )}
          {leftExtra}
        </div>
      </div>

      {/* ── Right form panel — always visible, full width on mobile ───── */}
      <div className={`flex-1 ${rightWidthClass} flex flex-col min-h-screen`}>

        {/* Top bar: back button + theme toggle */}
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 pt-5 sm:pt-6 flex-shrink-0">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]
                hover:text-[var(--accent)] transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}

          <ThemeToggle />
        </div>

        {/* Scrollable form area — centered, capped width */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="w-full max-w-md">

            {/* Mobile-only compact icon */}
            {icon && (
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}

            {eyebrow && (
              <p className="text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-2 text-center lg:text-left">
                {eyebrow}
              </p>
            )}

            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight mb-2 text-center lg:text-left">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[var(--text-secondary)] text-sm mb-6 text-center lg:text-left">
                {subtitle}
              </p>
            )}

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm break-words">
                {error}
              </div>
            )}

            {children}
          </div>
        </div>

        {/* Footer links */}
        {footerLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 pb-6 pt-2 flex-shrink-0">
            {footerLinks.map(({ label, href = '#' }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;