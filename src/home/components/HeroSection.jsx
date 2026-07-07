import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const popularTags = ['UI Design', 'Motion Graphics', 'React Dev', 'Copywriting', 'Python', 'Branding'];

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Pushes to the search results page with the typed query as ?q=
  // SearchPage reads this straight out of useSearchParams.
  const goToSearch = (value) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToSearch(query);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    goToSearch(tag);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#061c1e] dark:via-[#071f22] dark:to-[#0a2a2e] pt-16 pb-20 sm:pt-20 sm:pb-28 transition-colors duration-300">

      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-[500px] h-[500px] rounded-full bg-[#29c8d6]/10 dark:bg-[#29c8d6]/8 blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-[#105056]/15 dark:bg-[#105056]/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-[#29c8d6]/8 blur-[60px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#29c8d6 1px, transparent 1px), linear-gradient(90deg, #29c8d6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#29c8d6]/30 bg-[#29c8d6]/5 dark:bg-[#29c8d6]/10 text-[#29c8d6] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#29c8d6] animate-pulse" />
          200,000+ Businesses Trust Us
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-5 font-[Syne,sans-serif]">
          Collaborate with the{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29c8d6] to-[#1fb8c5]">
              world's most
            </span>
          </span>{' '}
          <br className="hidden sm:block" />
          talented creators.
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with top-tier freelancers globally. Our marketplace is home to thousands of verified professionals ready to scale your vision with precision and creativity.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-5">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0a2a2e] border border-slate-200 dark:border-[#29c8d6]/20 rounded-2xl px-4 py-2 shadow-xl shadow-slate-200/60 dark:shadow-[#29c8d6]/5 focus-within:border-[#29c8d6]/60 focus-within:shadow-[#29c8d6]/10 transition-all duration-300">
            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'UX Designer' or 'Python'"
              className="flex-1 bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none text-sm sm:text-base py-1"
            />
            <button
              type="submit"
              className="flex-shrink-0 px-5 py-2.5 bg-[#29c8d6] hover:bg-[#1fb8c5] text-[#061c1e] font-semibold text-sm rounded-xl shadow-lg shadow-[#29c8d6]/30 hover:shadow-[#29c8d6]/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Find Talent
            </button>
          </div>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mr-1">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-[#29c8d6]/15 text-slate-600 dark:text-slate-400 hover:border-[#29c8d6]/50 hover:text-[#29c8d6] hover:bg-[#29c8d6]/5 transition-all duration-200 bg-white/60 dark:bg-[#0a2a2e]/60 backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {[
            { value: '50K+', label: 'Vetted Experts' },
            { value: '200K+', label: 'Businesses Served' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-[Syne,sans-serif]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29c8d6] to-[#1fb8c5]">{value}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;