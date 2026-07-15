// src/components/shared/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // adjust path if your theme hook lives elsewhere

// Each item now carries its own href. Internal routes (start with "/") render
// as a router <Link>; anything still "#" (no page built yet) renders as a
// plain <a> so it's obvious at a glance what's wired up vs. still pending.
const LINKS = {
  Platform: [
    { label: 'Browse Talent', href: '/search' },
    { label: 'Post a Project', href: '#' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '/help-center' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

// ── Social icons — real brand marks, not letter placeholders ────────────────
const SOCIALS = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18v-7.5H5.67V18h2.67zM7 9.5a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.12c0-2.2-1.18-3.23-2.75-3.23-1.27 0-1.84.7-2.15 1.19V10.5h-2.67c.04.75 0 7.5 0 7.5h2.67v-4.19c0-.22.02-.45.08-.61.18-.45.58-.92 1.27-.92.9 0 1.26.68 1.26 1.68V18h2.29z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.9 2.86h3.3l-7.2 8.24 8.47 11.2h-6.63l-5.2-6.8-5.94 6.8H2.4l7.7-8.8L2 2.86h6.8l4.7 6.2 5.4-6.2zm-1.16 17.4h1.83L7.34 4.68H5.38L17.74 20.26z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
];

// Renders a Link for internal routes, a plain <a> for placeholder "#" ones.
const FooterLink = ({ href, label, className }) => {
  if (href && href !== '#') {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a href="#" className={className}>
      {label}
    </a>
  );
};

const Footer = () => {
  const [openGroup, setOpenGroup] = useState(null);
  const { theme } = useTheme();

  const toggleGroup = (group) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  const logoSrc = theme === 'dark' ? '/HyrdLogo1.png' : '/HyrdLogo2.png';

  const linkClass =
    'text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200';

  return (
    <footer className="bg-[var(--bg-page)] border-t border-[var(--accent)]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Brand */}
        <div className="mb-8 sm:mb-10">
          <Link to="/" className="flex items-center">
            <img src={logoSrc} alt="Hyrd Logo" className="h-9 w-auto object-contain" />
          </Link>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
            The world's marketplace for creative and technical talent.
          </p>
        </div>

        {/* Link groups — mobile accordion */}
        <div className="sm:hidden divide-y divide-[var(--accent)]/10 border-y border-[var(--accent)]/10 mb-8">
          {Object.keys(LINKS).map((group) => {
            const items = LINKS[group];
            const isOpen = openGroup === group;
            return (
              <div key={group}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    {group}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <ul className="space-y-2.5 pb-4">
                    {items.map((item) => (
                      <li key={item.label}>
                        <FooterLink href={item.href} label={item.label} className={linkClass} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Link groups — tablet/desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-8 mb-10">
          {Object.keys(LINKS).map((group) => {
            const items = LINKS[group];
            return (
              <div key={group}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
                  {group}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <FooterLink href={item.href} label={item.label} className={linkClass} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Socials — real brand icons */}
        <div className="flex gap-3 mb-8 sm:mb-10">
          {SOCIALS.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              aria-label={name}
              className="w-9 h-9 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10
                flex items-center justify-center
                text-[var(--text-muted)] hover:text-[var(--accent)]
                hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30
                transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--accent)]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-[var(--text-muted)]">© 2025 FreelanceHub. All rights reserved.</p>
          <p className="text-xs text-[var(--text-muted)]/60">Built with love for creators worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;