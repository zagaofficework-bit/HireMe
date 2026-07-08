// src/features/auth/pages/OtpPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AuthLayout from '../../../layouts/AuthLayout';

const OTP_LENGTH     = 6;
const RESEND_SECONDS = 30;

// ── Left-panel decoration ────────────────────────────────────────────────────

const OtpIcon = () => (
  <svg width="36" height="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeWidth="3" />
  </svg>
);

const SecurityNote = () => (
  <div className="mt-10 border border-[var(--accent)]/20 rounded-2xl p-5 bg-[var(--accent)]/5 backdrop-blur-sm text-left">
    <div className="text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-2">
      Security Note
    </div>
    <p className="text-[var(--accent)]/60 text-xs leading-relaxed">
      Never share your OTP with anyone. Hyrd will never ask for your code via call or email.
    </p>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

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

  const pendingPhone = sessionStorage.getItem('pendingPhone') || '';
  const authFlow     = sessionStorage.getItem('authFlow') || 'login';

  const [digits, setDigits]         = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]           = useState(RESEND_SECONDS);
  const [localError, setLocalError] = useState(null);
  const [resending, setResending]   = useState(false);
  const inputRefs = useRef([]);

  // Guard: no pending phone → redirect back
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

    const verify = authFlow === 'signup' ? handleVerifyRegisterOtp : handleVerifyLoginOtp;
    const result = await verify({ otp });

    if (result?.success) {
      ['pendingPhone', 'pendingName', 'pendingEmail', 'pendingRole', 'authFlow'].forEach((k) =>
        sessionStorage.removeItem(k)
      );
      navigate(isNewUser ? '/complete-profile' : '/', { replace: true });
    } else {
      setLocalError(result?.error || 'Verification failed. Please try again.');
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

  // Derived
  const maskedPhone = pendingPhone
    ? pendingPhone.slice(0, -4).replace(/\d/g, '•') + pendingPhone.slice(-4)
    : '';

  const progress = (digits.filter(Boolean).length / OTP_LENGTH) * 100;

  return (
    <AuthLayout
      icon={<OtpIcon />}
      leftHeading={<>Almost there.<br />One step left.</>}
      leftText="Check your phone for the 6-digit verification code. It expires in 10 minutes."
      leftExtra={<SecurityNote />}
      eyebrow="Verification"
      title={<>Enter your<br />OTP code</>}
      subtitle={
        <>
          We sent a 6-digit code to{' '}
          <span className="text-[var(--accent)] font-bold tracking-wider">{maskedPhone}</span>
        </>
      }
      error={localError || error}
      showBack
      backTo={authFlow === 'signup' ? '/signup' : '/login'}
      footerLinks={[
        { label: 'Privacy Policy' },
        { label: 'Terms of Service' },
      ]}
    >
      <form onSubmit={handleSubmit}>
        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--accent)]/15 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* OTP digit boxes */}
        <div className="flex gap-2 sm:gap-3 justify-between mb-7" onPaste={handlePaste}>
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
              className={[
                'flex-1 min-w-0 aspect-square max-w-[52px] sm:max-w-[60px] rounded-xl text-center',
                'text-[var(--text-primary)] text-xl sm:text-2xl font-black',
                'border-2 transition-all duration-200 focus:outline-none',
                digit
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/20'
                  : 'bg-[var(--bg-page)] border-[var(--accent)]/15 hover:border-[var(--accent)]/30',
                'focus:border-[var(--accent)] focus:shadow-lg focus:shadow-[var(--accent)]/20',
              ].join(' ')}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || digits.join('').length < OTP_LENGTH}
          className="w-full py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover,#21a0ab)] disabled:opacity-40 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[var(--accent)]/25 hover:shadow-[var(--accent)]/35 hover:-translate-y-0.5 active:translate-y-0"
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
          <p className="text-[var(--text-secondary)] text-sm">
            Resend code in{' '}
            <span className="text-[var(--accent)] font-bold tabular-nums">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[var(--accent)] hover:opacity-80 text-sm font-bold underline underline-offset-4 transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default OtpPage;