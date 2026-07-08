const CTASection = () => {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#071f22] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0a3a40] via-[#0d4a52] to-[#071f22] dark:from-[#061c1e] dark:via-[#0a2a2e] dark:to-[#061c1e] p-6 sm:p-14 lg:p-16 text-center shadow-2xl">

          {/* Blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-[#29c8d6]/15 blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#29c8d6]/10 blur-[60px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-24 sm:h-32 rounded-full bg-[#29c8d6]/5 blur-[80px]" />
          </div>

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-[#29c8d6]/30 bg-[#29c8d6]/10 text-[#29c8d6] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#29c8d6] animate-pulse flex-shrink-0" />
            <span className="whitespace-nowrap">Start Today — Free</span>
          </div>

          <h2 className="relative text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] sm:leading-[1.1] font-[Syne,sans-serif] mb-4 sm:mb-5 px-1">
            Ready to bring your vision<br className="hidden sm:block" /> to life?
          </h2>
          <p className="relative text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-7 sm:mb-8 leading-relaxed px-1">
            Join 200,000+ businesses using FreelanceHub to hire, manage, and pay their global remote talent effortlessly.
          </p>

          {/* Buttons */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#29c8d6] hover:bg-[#1fb8c5] text-[#061c1e] font-bold text-sm shadow-xl shadow-[#29c8d6]/30 hover:shadow-[#29c8d6]/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start a Project
            </a>
            <a
              href="#"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Talk to an Advisor
            </a>
          </div>

          {/* Trust line */}
          <p className="relative mt-6 text-[11px] sm:text-xs text-slate-500 px-2 leading-relaxed">
            No commitment required · Free to post · 48hr average match time
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;