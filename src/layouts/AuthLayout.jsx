// src/layouts/AuthLayout.jsx
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/shared/ThemeToggle';

const AuthLayout = ({
 
  leftWidthClass = 'lg:w-1/2',
  rightWidthClass = 'lg:w-1/2',
  icon,
  leftHeading,
  leftText,
  leftExtra,
  showBack = true,
  backTo = -1,
  eyebrow,
  title,
  subtitle,
  error,
  footerLinks = [],
  children,
}) => {
  const navigate = useNavigate();
  const gridId = `auth-grid-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="theme-root min-h-screen flex">
      {/* reCAPTCHA container — invisible, required by Firebase on phone-auth flows */}
      <div id="recaptcha-container" />

      {/* ── Left decorative panel ───────────────────────────────────────── */}
      <div
        className={`hidden lg:flex ${leftWidthClass} relative overflow-hidden bg-gradient-to-br from-[var(--color-dark-teal-950)] via-[var(--color-dark-teal-800)] to-[var(--bg-page)] items-center justify-center flex-col`}
      >
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={gridId} width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${gridId})`} />
          </svg>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[var(--color-pine-blue-500)]/15 blur-[60px]" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-md">
          {icon && (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 backdrop-blur-sm mb-8 mx-auto">
              {icon}
            </div>
          )}
          {leftHeading && (
            <h2 className="font-display text-[var(--color-dark-teal-200)] text-4xl font-black tracking-tight leading-tight mb-4">
              {leftHeading}
            </h2>
          )}
          {leftText && (
            <p className="text-[var(--color-dark-teal-300)]/70 text-sm leading-relaxed">
              {leftText}
            </p>
          )}
          {leftExtra}
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className={`w-full ${rightWidthClass} flex flex-col bg-[var(--bg-panel)]`}>

        {/* Top nav — only back button here now */}
        {showBack && (
          <div className="px-8 pt-7 pb-2">
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-semibold"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">

            {/* Heading row — eyebrow, then title + ThemeToggle on same line */}
            {(eyebrow || title || subtitle) && (
              <div className="mb-8">
                {eyebrow && (
                  <p className="text-[var(--accent)] text-xs font-bold tracking-[0.2em] uppercase mb-2">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <div className="flex items-center justify-between gap-3 mb-0">
                    <h1 className="font-display text-[var(--text-primary)] text-3xl font-black tracking-tight leading-none whitespace-nowrap">
                      {title}
                    </h1>
                    <div className="shrink-0">
                      <ThemeToggle />
                    </div>
                  </div>
                )}
                {subtitle && (
                  <p className="text-[var(--text-secondary)] text-sm mt-3">{subtitle}</p>
                )}
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl status-pill-danger text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Page-specific form */}
            {children}

            {footerLinks.length > 0 && (
              <div className="mt-10 flex gap-5 justify-center text-xs">
                {footerLinks.map(({ label, href = '#' }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;