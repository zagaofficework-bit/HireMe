const logos = [
  { name: 'Stripe', letter: 'S' },
  { name: 'Notion', letter: 'N' },
  { name: 'Figma', letter: 'F' },
  { name: 'Linear', letter: 'L' },
  { name: 'Vercel', letter: 'V' },
  { name: 'Loom', letter: 'L' },
];

const LogoItem = ({ name, letter }) => (
  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 group flex-shrink-0 px-4 sm:px-6">
    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-[#0a2a2e] flex items-center justify-center text-xs font-black group-hover:bg-[#29c8d6]/15 transition-colors duration-200">
      {letter}
    </div>
    <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{name}</span>
  </div>
);

const TrustBar = () => {
  // Duplicate the list so the track can loop seamlessly (translate -50% = one full set).
  const track = [...logos, ...logos];

  return (
    <section className="py-8 sm:py-10 bg-slate-50 dark:bg-[#061c1e] border-y border-slate-200 dark:border-[#29c8d6]/10 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 sm:mb-7">
          Trusted by teams at
        </p>
      </div>

      {/* Marquee viewport — fades at the edges, hides overflow */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="trustbar-track flex items-center w-max">
          {track.map(({ name, letter }, i) => (
            <LogoItem key={`${name}-${i}`} name={name} letter={letter} />
          ))}
        </div>
      </div>

      <style>{`
        .trustbar-track {
          animation: trustbar-scroll 22s linear infinite;
        }
        .trustbar-track:hover {
          animation-play-state: paused;
        }
        @keyframes trustbar-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .trustbar-track {
            animation-duration: 14s;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustBar;