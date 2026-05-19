const logos = [
  { name: 'Stripe', letter: 'S' },
  { name: 'Notion', letter: 'N' },
  { name: 'Figma', letter: 'F' },
  { name: 'Linear', letter: 'L' },
  { name: 'Vercel', letter: 'V' },
  { name: 'Loom', letter: 'L' },
];

const TrustBar = () => (
  <section className="py-10 bg-slate-50 dark:bg-[#061c1e] border-y border-slate-200 dark:border-[#29c8d6]/10 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-7">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {logos.map(({ name, letter }) => (
          <div
            key={name}
            className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-[#0a2a2e] flex items-center justify-center text-xs font-black group-hover:bg-[#29c8d6]/15 transition-colors duration-200">
              {letter}
            </div>
            <span className="text-sm font-semibold tracking-tight">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;