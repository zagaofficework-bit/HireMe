import { useState } from 'react';

const professionals = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Full Stack Developer',
    rate: '$85/hr',
    rating: 4.9,
    reviews: 142,
    bio: 'Expert in building scalable React and Node.js applications with 8+ years of experience in enterprise software.',
    tags: ['REACT', 'AWS', 'TYPESCRIPT'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
    available: true,
    roleColor: '#29c8d6',
  },
  {
    id: 2,
    name: 'Elena Chen',
    role: 'UI/UX Designer',
    rate: '$110/hr',
    rating: 5.0,
    reviews: 98,
    bio: 'Crafting premium digital experiences for Fortune 500 companies. Specializing in high-conversion product design.',
    tags: ['FIGMA', 'BRANDING', 'MOBILE'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format',
    available: true,
    roleColor: '#a855f7',
  },
  {
    id: 3,
    name: 'Marcus Thorne',
    role: 'Marketing Manager',
    rate: '$95/hr',
    rating: 4.8,
    reviews: 76,
    bio: 'Data-driven growth expert. Helping startups scale from seed to Series B with aggressive go-to-market strategies.',
    tags: ['GROWTH', 'ADS', 'SQL'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format',
    available: false,
    roleColor: '#f97316',
  },
  {
    id: 4,
    name: 'Sarah Kim',
    role: 'Data Scientist',
    rate: '$120/hr',
    rating: 4.9,
    reviews: 54,
    bio: 'ML engineer specializing in NLP and LLMs. Previously at Google DeepMind, now helping companies build AI-powered products.',
    tags: ['PYTHON', 'ML', 'LLMS'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format',
    available: true,
    roleColor: '#0ea5e9',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const FeaturedProfessionals = () => {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const maxStart = professionals.length - visible;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxStart, c + 1));

  const visibleProfs = professionals.slice(current, current + visible);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#061c1e] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#29c8d6] mb-2">Hand-Picked</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-[Syne,sans-serif]">
              Featured Professionals
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Hand-picked experts with stellar track records.
            </p>
          </div>

          {/* Nav Arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-[#29c8d6]/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-[#29c8d6]/50 hover:text-[#29c8d6] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={current >= maxStart}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-[#29c8d6]/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-[#29c8d6]/50 hover:text-[#29c8d6] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards — desktop sliding, mobile stacked */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProfs.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>

        {/* Mobile: all cards stacked */}
        <div className="sm:hidden grid grid-cols-1 gap-4">
          {professionals.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>

        {/* Browse All */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#29c8d6]/30 text-[#29c8d6] font-semibold text-sm hover:bg-[#29c8d6]/5 hover:border-[#29c8d6]/60 transition-all duration-200"
          >
            Browse All Experts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

const ProfessionalCard = ({ pro }) => (
  <div className="group bg-white dark:bg-[#0a2a2e] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#29c8d6]/10 hover:border-[#29c8d6]/40 hover:shadow-xl hover:shadow-[#29c8d6]/5 dark:hover:shadow-[#29c8d6]/10 transition-all duration-300 hover:-translate-y-1">
    {/* Image */}
    <div className="relative h-44 sm:h-48 overflow-hidden">
      <img
        src={pro.avatar}
        alt={pro.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=105056&color=29c8d6&size=300`;
        }}
      />
      {/* Rating badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#061c1e]/90 backdrop-blur-sm text-xs font-bold text-slate-700 dark:text-white shadow-lg">
        <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {pro.rating}
      </div>
      {/* Available dot */}
      {pro.available && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 dark:bg-[#061c1e]/90 backdrop-blur-sm text-[10px] font-semibold text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Available
        </div>
      )}
    </div>

    <div className="p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white font-[Syne,sans-serif]">{pro.name}</h3>
          <p className="text-xs font-semibold mt-0.5" style={{ color: pro.roleColor }}>{pro.role}</p>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#061c1e] px-2 py-1 rounded-lg">
          From {pro.rate}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <StarRating rating={pro.rating} />
        <span className="text-xs text-slate-400">({pro.reviews})</span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{pro.bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {pro.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#29c8d6]/10 text-[#29c8d6] dark:bg-[#29c8d6]/15">
            {tag}
          </span>
        ))}
      </div>

      <button className="w-full py-2.5 rounded-xl border-2 border-[#29c8d6]/30 text-[#29c8d6] text-sm font-semibold hover:bg-[#29c8d6] hover:text-[#061c1e] transition-all duration-200">
        View Profile
      </button>
    </div>
  </div>
);

export default FeaturedProfessionals;