// src/components/shared/Footer.jsx
const LINKS = {
  Platform: ['Browse Talent', 'Post a Project', 'How It Works', 'Pricing'],
  Company:  ['About Us', 'Careers', 'Blog', 'Press'],
  Support:  ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
};

const SOCIALS = ['twitter', 'linkedin', 'github'];

const Footer = () => (
  <footer
    className="bg-[var(--bg-page)] border-t border-[var(--accent)]/10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 mb-3">
            {/* <span
              className="w-7 h-7 rounded-lg
                bg-gradient-to-br from-[var(--accent)] to-[var(--color-dark-teal-800,#105056)]
                flex items-center justify-center"
            > */}
                <a href="/" className="flex items-center">
              <img
                src="/Hyrd logo.png"   // ✅ correct path
                alt="Hyrd Logo"
                className="h-16 sm:h-[68px] w-auto object-contain"  // ✅ bigger, still responsive
              />
            </a>
            {/* </span> */}
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 max-w-[180px]">
            The world's marketplace for creative and technical talent.
          </p>

          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10
                  flex items-center justify-center
                  text-[var(--text-muted)] hover:text-[var(--accent)]
                  hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30
                  transition-all duration-200"
              >
                <span className="text-xs font-bold uppercase">{s[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ───────────────────────────────────────────── */}
        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              {group}
            </h4>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--accent)]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-muted)]">
          © 2025 FreelanceHub. All rights reserved.
        </p>
        <p className="text-xs text-[var(--text-muted)]/60">
          Built with ❤️ for creators worldwide
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;