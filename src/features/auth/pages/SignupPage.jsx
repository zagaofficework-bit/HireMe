// src/features/auth/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import PhoneInput from '../components/PhoneInput';
import ThemeToggle from '../../../components/shared/ThemeToggle';

const SignupPage = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error, clearError } = useAuth();

  const [role, setRole]             = useState('freelancer');
  const [form, setForm]             = useState({ name: '', email: '', phone: '' });
  const [localError, setLocalError] = useState(null);
  const [sending, setSending]       = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const phone = form.phone.startsWith('+') ? form.phone : `+${form.phone}`;

    setSending(true);
    // handleRegister from useAuth wraps sendOtp internally
    const result = await handleRegister({ phone });
    setSending(false);

    if (result?.success) {
      // Persist signup context so OtpPage knows what to do after verification
      sessionStorage.setItem('pendingPhone', phone);
      sessionStorage.setItem('pendingName',  form.name);
      sessionStorage.setItem('pendingEmail', form.email);
      sessionStorage.setItem('pendingRole',  role);
      sessionStorage.setItem('authFlow',     'signup');
      navigate('/otp');
    } else {
      setLocalError(result?.error || 'Failed to send OTP. Please try again.');
    }
  };

  const displayError = localError || error;

  const inputBase =
    'w-full bg-[#f0fafb] dark:bg-[#061c1e] border border-[#a8dde3] dark:border-[#29c8d6]/20 rounded-xl pl-11 pr-4 py-3 text-[#0b2e32] dark:text-[#eaf9fb] placeholder-[#5ba8b0] dark:placeholder-[#29c8d6]/30 text-sm focus:outline-none focus:border-[#0d8c97] dark:focus:border-[#29c8d6]/60 focus:ring-1 focus:ring-[#0d8c97]/30 dark:focus:ring-[#29c8d6]/30 transition-all duration-200';

  return (
    <div className="min-h-screen bg-[#0b1918] flex theme-root">
      <div id="recaptcha-container" />

      {/* ── Left decorative panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#061c1e] via-[#105056] to-[#0b1918] items-center justify-center flex-col gap-8 px-12">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#29c8d6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
          <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-[#29c8d6]/8 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-52 h-52 rounded-full bg-[#4db3a8]/12 blur-[70px]" />
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#29c8d6]/30 bg-[#29c8d6]/10 backdrop-blur-sm mb-6">
            <svg width="28" height="28" fill="none" stroke="#29c8d6" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-[#a9e9ef] text-3xl font-black tracking-tight leading-tight mb-3">
            Join the Elite.<br />Build Your Future.
          </h2>
          <p className="text-[#54d3de]/70 text-sm leading-relaxed">
            Whether you're a top freelancer or a client looking for exceptional talent — NEON is your platform.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: '⚡', text: 'Instant OTP-based onboarding' },
              { icon: '🔒', text: 'Secure & verified profiles' },
              { icon: '💼', text: 'Projects matched to your skills' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[#54d3de]/70 text-sm">
                <span className="text-base">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white dark:bg-[#0d1f1e]">
        {/* Top nav */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <span className="text-[#0b4f57] dark:text-[#a9e9ef] font-black tracking-[0.3em] text-sm">NEON</span>
          <ThemeToggle />
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-lg">
            {/* Heading */}
            <div className="mb-7">
              <p className="text-[#0d8c97] dark:text-[#29c8d6] text-xs font-bold tracking-[0.2em] uppercase mb-2">
                Get Started
              </p>
              <h1 className="text-[#0b2e32] dark:text-[#eaf9fb] text-4xl font-black tracking-tight leading-none">
                Create your<br />account
              </h1>
              <p className="text-[#2c7a82] dark:text-[#7edee7]/70 text-sm mt-3">
                Start your freelance journey today.
              </p>
            </div>

            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-[#a8dde3] dark:border-[#29c8d6]/20 bg-[#f0fafb] dark:bg-[#061c1e] p-1 mb-6">
              {['freelancer', 'client'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    role === r
                      ? 'bg-[#29c8d6] text-[#061c1e] shadow-lg shadow-[#29c8d6]/20'
                      : 'text-[#2c7a82] dark:text-[#54d3de]/60 hover:text-[#0d8c97] dark:hover:text-[#29c8d6]'
                  }`}
                >
                  {r === 'freelancer' ? '⚡ I am a Freelancer' : '💼 I am a Client'}
                </button>
              ))}
            </div>

            {/* Error banner */}
            {displayError && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[#0b4f57] dark:text-[#7edee7] text-xs font-bold mb-2 tracking-widest uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0d8c97] dark:text-[#29c8d6]/60">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your legal full name"
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#0b4f57] dark:text-[#7edee7] text-xs font-bold mb-2 tracking-widest uppercase">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0d8c97] dark:text-[#29c8d6]/60">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 7L2 7" />
                    </svg>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[#0b4f57] dark:text-[#7edee7] text-xs font-bold mb-2 tracking-widest uppercase">
                  Phone Number
                </label>
                <PhoneInput
                  value={form.phone}
                  onChange={(val) => setForm({ ...form, phone: val })}
                />
                <p className="mt-1.5 text-[#2c7a82] dark:text-[#54d3de]/60 text-xs">
                  OTP will be sent to this number.
                </p>
              </div>

              <button
                type="submit"
                disabled={sending || loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#29c8d6] hover:bg-[#21a0ab] disabled:opacity-50 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[#29c8d6]/25 hover:shadow-[#29c8d6]/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                {sending || loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    SENDING OTP…
                  </span>
                ) : 'CREATE ACCOUNT →'}
              </button>
            </form>

            <p className="text-center text-[#2c7a82] dark:text-[#54d3de]/60 text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#0d8c97] dark:text-[#29c8d6] hover:text-[#21a0ab] font-bold underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-8 flex gap-5 justify-center text-xs">
              {['Privacy Policy', 'Terms of Service', 'Help'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-[#2c7a82] dark:text-[#2e6b65] hover:text-[#0d8c97] dark:hover:text-[#4db3a8] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;