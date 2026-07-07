// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import PhoneInput from '../components/PhoneInput';
import AuthLayout from '../../../layouts/AuthLayout';

// ── Left-panel decoration ────────────────────────────────────────────────────

const LoginIcon = () => (
  <svg width="36" height="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.11 5.18 2 2 0 0 1 6.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L10.09 10a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 24 16.92z" />
  </svg>
);

const StatsGrid = () => (
  <div className="mt-10 grid grid-cols-3 gap-4">
    {[['12K+', 'Freelancers'], ['800+', 'Clients'], ['98%', 'Satisfaction']].map(([num, label]) => (
      <div
        key={label}
        className="border border-[var(--accent)]/20 rounded-xl p-3 bg-[var(--accent)]/5 backdrop-blur-sm"
      >
        <div className="text-[var(--accent)] text-xl font-black">{num}</div>
        <div className="text-[var(--accent)]/60 text-xs mt-0.5">{label}</div>
      </div>
    ))}
  </div>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
  </svg>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error, clearError, signInWithGoogle } = useAuth();

  const [phone, setPhone]             = useState('');
  const [localError, setLocalError]   = useState(null);
  const [sending, setSending]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const formatted = phone.startsWith('+') ? phone : `+${phone}`;

    setSending(true);
    const result = await handleLogin({ phone: formatted });
    setSending(false);

    if (result?.success) {
      sessionStorage.setItem('pendingPhone', formatted);
      sessionStorage.setItem('authFlow', 'login');
      navigate('/otp');
    } else {
      setLocalError(result?.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleGoogleClick = async () => {
    setLocalError(null);
    clearError();
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (result?.success) {
      if (result.requiresMobile) {
        // Google account has no verified phone on file — route into the
        // existing OTP flow to collect/link one, same as a fresh signup.
        sessionStorage.setItem('authFlow', 'google-link-mobile');
        navigate('/otp');
        return;
      }
      navigate('/');
    } else {
      setLocalError(result?.error || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <AuthLayout
      icon={<LoginIcon />}
      leftHeading={<>NEON<br />ELITE</>}
      leftText="The freelance platform built for top talent. Connect, collaborate, and earn — on your terms."
      leftExtra={<StatsGrid />}
      eyebrow="Welcome Back"
      title={<>Sign in to<br />your account</>}
      subtitle="We'll send a one-time code to verify your identity."
      error={localError || error}
      showBack
      backTo={-1}
      footerLinks={[
        { label: 'Privacy Policy' },
        { label: 'Terms of Service' },
        { label: 'Help' },
      ]}
    >
      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={googleLoading || sending || loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl
          bg-[var(--bg-page)] border border-[var(--accent)]/20
          hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5
          disabled:opacity-50 disabled:cursor-not-allowed
          text-[var(--text-primary)] font-semibold text-sm
          transition-all duration-200"
      >
        {googleLoading ? (
          <svg className="animate-spin w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? 'Signing in…' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--accent)]/20" />
        <span className="text-[var(--text-muted)] text-xs font-medium">OR USE PHONE</span>
        <div className="flex-1 h-px bg-[var(--accent)]/20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[var(--text-secondary)] text-xs font-bold mb-2 tracking-widest uppercase">
            Phone Number
          </label>
          <PhoneInput value={phone} onChange={setPhone} />
          <p className="mt-1.5 text-[var(--text-muted)] text-xs">
            A 6-digit OTP will be sent to this number.
          </p>
        </div>

        <button
          type="submit"
          disabled={sending || loading || !phone}
          className="w-full py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover,#21a0ab)] disabled:opacity-50 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[var(--accent)]/25 hover:shadow-[var(--accent)]/35 hover:-translate-y-0.5 active:translate-y-0"
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

      {/* Switch to signup */}
      <p className="text-center text-[var(--text-secondary)] text-sm mt-6">
        New here?{' '}
        <Link
          to="/signup"
          className="text-[var(--accent)] hover:opacity-80 font-bold underline underline-offset-4 transition-colors"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;