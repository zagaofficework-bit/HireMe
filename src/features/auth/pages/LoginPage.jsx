// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import PhoneInput from '../components/PhoneInput';
import ThemeToggle from '../../../components/shared/ThemeToggle';

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error, clearError } = useAuth();

  const [phone, setPhone]           = useState('');
  const [localError, setLocalError] = useState(null);
  const [sending, setSending]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const formatted = phone.startsWith('+') ? phone : `+${phone}`;

    setSending(true);
    const result = await handleLogin({ phone: formatted });
    setSending(false);

    if (result?.success) {
      // Store phone so OtpPage can display masked version
      sessionStorage.setItem('pendingPhone', formatted);
      sessionStorage.setItem('authFlow', 'login');
      navigate('/otp');
    } else {
      setLocalError(result?.error || 'Failed to send OTP. Please try again.');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0b1918] flex theme-root">
      {/* reCAPTCHA container — invisible, required by Firebase */}
      <div id="recaptcha-container" />

      {/* ── Left decorative panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#061c1e] via-[#105056] to-[#0b1918] items-center justify-center">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#29c8d6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#29c8d6]/10 blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#4db3a8]/15 blur-[60px]" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-[#29c8d6]/30 bg-[#29c8d6]/10 backdrop-blur-sm mb-8 mx-auto">
            <svg width="36" height="36" fill="none" stroke="#29c8d6" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.11 5.18 2 2 0 0 1 6.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L10.09 10a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 24 16.92z" />
            </svg>
          </div>
          <h2 className="text-[#a9e9ef] text-4xl font-black tracking-tight leading-tight mb-4">
            NEON<br />ELITE
          </h2>
          <p className="text-[#54d3de]/70 text-sm leading-relaxed">
            The freelance platform built for top talent. Connect, collaborate, and earn — on your terms.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['12K+', 'Freelancers'], ['800+', 'Clients'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} className="border border-[#29c8d6]/20 rounded-xl p-3 bg-[#29c8d6]/5 backdrop-blur-sm">
                <div className="text-[#29c8d6] text-xl font-black">{num}</div>
                <div className="text-[#54d3de]/60 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d1f1e]">
        {/* Top nav */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0d6e77] dark:text-[#54d3de] hover:text-[#29c8d6] transition-colors text-sm font-semibold"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <span className="text-[#0b4f57] dark:text-[#a9e9ef] font-black tracking-[0.3em] text-sm">NEON</span>
          <ThemeToggle />
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <p className="text-[#0d8c97] dark:text-[#29c8d6] text-xs font-bold tracking-[0.2em] uppercase mb-2">
                Welcome Back
              </p>
              <h1 className="text-[#0b2e32] dark:text-[#eaf9fb] text-4xl font-black tracking-tight leading-none">
                Sign in to<br />your account
              </h1>
              <p className="text-[#2c7a82] dark:text-[#7edee7]/70 text-sm mt-3">
                We'll send a one-time code to verify your identity.
              </p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#0b4f57] dark:text-[#7edee7] text-xs font-bold mb-2 tracking-widest uppercase">
                  Phone Number
                </label>
                <PhoneInput value={phone} onChange={setPhone} />
                <p className="mt-1.5 text-[#2c7a82] dark:text-[#54d3de]/60 text-xs">
                  A 6-digit OTP will be sent to this number.
                </p>
              </div>

              <button
                type="submit"
                disabled={sending || loading || !phone}
                className="w-full py-3.5 rounded-xl bg-[#29c8d6] hover:bg-[#21a0ab] disabled:opacity-50 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[#29c8d6]/25 hover:shadow-[#29c8d6]/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                {sending || loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    SENDING OTP…
                  </span>
                ) : 'SEND OTP →'}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#29c8d6]/20" />
              <span className="text-[#2c7a82] dark:text-[#54d3de]/40 text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-[#29c8d6]/20" />
            </div>

            <p className="text-center text-[#2c7a82] dark:text-[#54d3de]/60 text-sm mt-6">
              New here?{' '}
              <Link
                to="/signup"
                className="text-[#0d8c97] dark:text-[#29c8d6] hover:text-[#21a0ab] font-bold underline underline-offset-4 transition-colors"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-10 flex gap-5 justify-center text-xs">
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

export default LoginPage;