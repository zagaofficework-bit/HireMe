// src/features/auth/pages/OtpPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import ThemeToggle from '../../../components/shared/ThemeToggle';

const OTP_LENGTH     = 6;
const RESEND_SECONDS = 30;

const OtpPage = () => {
  const navigate = useNavigate();
  const {
    handleVerifyLoginOtp,
    handleVerifyRegisterOtp,
    sendOtp,
    loading,
    error,
    clearError,
    isNewUser,
  } = useAuth();

  // Read context stored by LoginPage / SignupPage
  const pendingPhone = sessionStorage.getItem('pendingPhone') || '';
  const authFlow     = sessionStorage.getItem('authFlow') || 'login';

  const [digits, setDigits]         = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]           = useState(RESEND_SECONDS);
  const [localError, setLocalError] = useState(null);
  const [resending, setResending]   = useState(false);
  const inputRefs = useRef([]);

  // Guard: if no pending phone, redirect back
  useEffect(() => {
    if (!pendingPhone) {
      navigate(authFlow === 'signup' ? '/signup' : '/login', { replace: true });
    }
  }, []); // eslint-disable-line

  // Countdown
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Input handlers ──────────────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) return;

    // Route to correct verifier based on flow
    const verify = authFlow === 'signup' ? handleVerifyRegisterOtp : handleVerifyLoginOtp;
    const result = await verify({ otp });

    if (result?.success) {
      // Clean up session
      sessionStorage.removeItem('pendingPhone');
      sessionStorage.removeItem('pendingName');
      sessionStorage.removeItem('pendingEmail');
      sessionStorage.removeItem('pendingRole');
      sessionStorage.removeItem('authFlow');

      // isNewUser comes from Redux state (populated by loginWithPhone thunk)
      navigate(isNewUser ? '/complete-profile' : '/', { replace: true });
    } else {
      setLocalError(result?.error || 'Verification failed. Please try again.');
      // Clear filled digits on error so user can re-enter cleanly
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  // ── Resend ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setLocalError(null);
    clearError();
    setDigits(Array(OTP_LENGTH).fill(''));
    setTimer(RESEND_SECONDS);
    setResending(true);

    const result = await sendOtp(pendingPhone);

    setResending(false);
    if (!result?.success) {
      setLocalError(result?.error || 'Failed to resend OTP. Please try again.');
    }
  };

  const maskedPhone = pendingPhone
    ? pendingPhone.slice(0, -4).replace(/\d/g, '•') + pendingPhone.slice(-4)
    : '';

  const filledCount  = digits.filter(Boolean).length;
  const progress     = (filledCount / OTP_LENGTH) * 100;
  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0b1918] flex theme-root">
      <div id="recaptcha-container" />

      {/* ── Left decorative panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#061c1e] via-[#105056] to-[#0b1918] items-center justify-center">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid3" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#29c8d6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid3)" />
          </svg>
          <div className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-[#29c8d6]/10 blur-[80px]" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-[#4db3a8]/15 blur-[60px]" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-[#29c8d6]/30 bg-[#29c8d6]/10 backdrop-blur-sm mb-8">
            <svg width="36" height="36" fill="none" stroke="#29c8d6" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeWidth="3" />
            </svg>
          </div>
          <h2 className="text-[#a9e9ef] text-3xl font-black tracking-tight leading-tight mb-4">
            Almost there.<br />One step left.
          </h2>
          <p className="text-[#54d3de]/70 text-sm leading-relaxed">
            Check your phone for the 6-digit verification code. It expires in 10 minutes.
          </p>
          <div className="mt-10 border border-[#29c8d6]/20 rounded-2xl p-5 bg-[#29c8d6]/5 backdrop-blur-sm text-left">
            <div className="text-[#29c8d6] text-xs font-bold tracking-widest uppercase mb-2">
              Security Note
            </div>
            <p className="text-[#54d3de]/60 text-xs leading-relaxed">
              Never share your OTP with anyone. NEON will never ask for your code via call or email.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d1f1e]">
        {/* Top nav */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <button
            onClick={() => navigate(authFlow === 'signup' ? '/signup' : '/login')}
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
                Verification
              </p>
              <h1 className="text-[#0b2e32] dark:text-[#eaf9fb] text-4xl font-black tracking-tight leading-none mb-3">
                Enter your<br />OTP code
              </h1>
              <p className="text-[#2c7a82] dark:text-[#7edee7]/70 text-sm">
                We sent a 6-digit code to{' '}
                <span className="text-[#0d8c97] dark:text-[#29c8d6] font-bold tracking-wider">
                  {maskedPhone}
                </span>
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

            <form onSubmit={handleSubmit}>
              {/* Progress bar */}
              <div className="h-1 w-full bg-[#29c8d6]/15 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-[#29c8d6] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* OTP digit boxes */}
              <div className="flex gap-3 justify-between mb-7" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`
                      flex-1 aspect-square max-w-[60px] rounded-xl text-center
                      text-[#0b2e32] dark:text-[#eaf9fb]
                      text-2xl font-black
                      border-2 transition-all duration-200 focus:outline-none
                      ${digit
                        ? 'border-[#29c8d6] bg-[#e6f9fb] dark:bg-[#29c8d6]/10 shadow-lg shadow-[#29c8d6]/20'
                        : 'bg-[#f0fafb] dark:bg-[#061c1e] border-[#a8dde3] dark:border-[#29c8d6]/15 hover:border-[#0d8c97] dark:hover:border-[#29c8d6]/30'
                      }
                      focus:border-[#29c8d6] focus:shadow-lg focus:shadow-[#29c8d6]/20
                    `}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || digits.join('').length < OTP_LENGTH}
                className="w-full py-3.5 rounded-xl bg-[#29c8d6] hover:bg-[#21a0ab] disabled:opacity-40 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[#29c8d6]/25 hover:shadow-[#29c8d6]/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    VERIFYING…
                  </span>
                ) : 'VERIFY OTP →'}
              </button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              {timer > 0 ? (
                <p className="text-[#2c7a82] dark:text-[#54d3de]/50 text-sm">
                  Resend code in{' '}
                  <span className="text-[#0d8c97] dark:text-[#29c8d6] font-bold tabular-nums">
                    {timer}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#0d8c97] dark:text-[#29c8d6] hover:text-[#21a0ab] text-sm font-bold underline underline-offset-4 transition-colors disabled:opacity-50"
                >
                  {resending ? 'Sending…' : 'Resend OTP'}
                </button>
              )}
            </div>

            <div className="mt-10 flex gap-5 justify-center text-xs">
              {['Privacy Policy', 'Terms of Service'].map((label) => (
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

export default OtpPage;