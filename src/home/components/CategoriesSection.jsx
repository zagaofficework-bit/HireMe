import { useState } from 'react';

const categories = [
  {
    id: 1,
    title: 'Development',
    subtitle: 'Over 12,000 active experts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    tags: ['React', 'Node.js', 'Python', 'AWS'],
    color: 'from-[#29c8d6]/20 to-[#105056]/20',
    accent: '#29c8d6',
  },
  {
    id: 2,
    title: 'Design & Arts',
    subtitle: '8,500 creative minds',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    tags: ['Figma', 'Branding', 'UI/UX', 'Illustration'],
    color: 'from-purple-500/15 to-pink-500/10',
    accent: '#a855f7',
  },
  {
    id: 3,
    title: 'Marketing',
    subtitle: '6,000 growth specialists',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    tags: ['SEO', 'Ads', 'Growth', 'Email'],
    color: 'from-orange-500/15 to-amber-500/10',
    accent: '#f97316',
  },
  {
    id: 4,
    title: 'Writing',
    subtitle: '4,500 expert writers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    tags: ['Copywriting', 'Blog', 'Technical', 'UX Copy'],
    color: 'from-green-500/15 to-emerald-500/10',
    accent: '#22c55e',
  },
  {
    id: 5,
    title: 'Video & Animation',
    subtitle: '3,200 motion artists',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    tags: ['After Effects', 'Motion', 'Editing', '3D'],
    color: 'from-rose-500/15 to-red-500/10',
    accent: '#f43f5e',
  },
  {
    id: 6,
    title: 'Data & AI',
    subtitle: '5,100 data scientists',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    tags: ['ML', 'Python', 'Analytics', 'LLMs'],
    color: 'from-sky-500/15 to-blue-500/10',
    accent: '#0ea5e9',
  },
];

const CategoriesSection = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#071f22] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#29c8d6] mb-2">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-[Syne,sans-serif] leading-tight">
              Explore Expertise
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Top-rated categories curated for your business needs.
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#29c8d6] hover:text-[#1fb8c5] transition-colors group"
          >
            View all
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`group text-left p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                activeId === cat.id
                  ? 'border-[#29c8d6]/50 bg-gradient-to-br from-[#29c8d6]/10 to-[#105056]/10 shadow-lg shadow-[#29c8d6]/10 dark:shadow-[#29c8d6]/5'
                  : 'border-slate-200 dark:border-[#29c8d6]/10 bg-slate-50/60 dark:bg-[#0a2a2e]/50 hover:border-[#29c8d6]/30'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${cat.color} transition-transform duration-300 group-hover:scale-110`}
                style={{ color: cat.accent }}
              >
                {cat.icon}
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-0.5 font-[Syne,sans-serif]">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{cat.subtitle}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#061c1e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#29c8d6]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: cat.accent }}>
                Browse experts
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 sm:hidden text-center">
          <a href="#" className="text-sm font-semibold text-[#29c8d6] hover:text-[#1fb8c5]">
            View all categories →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;