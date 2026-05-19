const Footer = () => {
  const links = {
    Platform: ['Browse Talent', 'Post a Project', 'How It Works', 'Pricing'],
    Company: ['About Us', 'Careers', 'Blog', 'Press'],
    Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#040f10] border-t border-slate-800 dark:border-[#29c8d6]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#29c8d6] to-[#105056] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              <span className="text-lg font-bold text-white">
                Freelance<span className="text-[#29c8d6]">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-[180px]">
              The world's marketplace for creative and technical talent.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'github'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-[#29c8d6] hover:bg-[#29c8d6]/10 transition-all duration-200">
                  <span className="text-xs font-bold uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-[#29c8d6] transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2025 FreelanceHub. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built with ❤️ for creators worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;