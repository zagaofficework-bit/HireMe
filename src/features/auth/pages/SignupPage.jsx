// src/features/auth/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import PhoneInput from '../components/PhoneInput';
import AuthLayout from '../../../layouts/AuthLayout';

// ── Left-panel decoration ────────────────────────────────────────────────────

const SignupIcon = () => (
  <svg width="28" height="28" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FeatureList = () => (
  <div className="mt-8 space-y-3">
    {[
      { icon: '⚡', text: 'Instant OTP-based onboarding' },
      { icon: '🔒', text: 'Secure & verified profiles' },
      { icon: '💼', text: 'Projects matched to your skills' },
    ].map(({ icon, text }) => (
      <div key={text} className="flex items-center gap-3 text-[var(--accent)]/70 text-sm">
        <span className="text-base">{icon}</span>
        {text}
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

const inputBase =
  'w-full bg-[var(--bg-page)] border border-[var(--accent)]/20 rounded-xl pl-11 pr-4 py-3 ' +
  'text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm ' +
  'focus:outline-none focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/30 ' +
  'transition-all duration-200';

// ── Page ─────────────────────────────────────────────────────────────────────

const SignupPage = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error, clearError, signInWithGoogle } = useAuth();

  const [role, setRole]             = useState('freelancer');
  const [form, setForm]             = useState({ name: '', email: '', phone: '' });
  const [localError, setLocalError] = useState(null);
  const [sending, setSending]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const phone = form.phone.startsWith('+') ? form.phone : `+${form.phone}`;

    setSending(true);
    const result = await handleRegister({ phone });
    setSending(false);

    if (result?.success) {
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

  const handleGoogleClick = async () => {
    setLocalError(null);
    clearError();
    sessionStorage.setItem('pendingRole', role);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (result?.success) {
      if (result.requiresMobile) {
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
      leftWidthClass="lg:w-5/12"
      rightWidthClass="lg:w-7/12"
      icon={<SignupIcon />}
      leftHeading={<>Join the Hyrd.<br />Build Your Future.</>}
      leftText="Whether you're a top freelancer or a client looking for exceptional talent — Hyrd is your platform."
      leftExtra={<FeatureList />}
      eyebrow="Get Started"
      title="Create your account"
      subtitle="Start your freelance journey today."
      error={localError || error}
      showBack={true}
      backTo="/login"
      footerLinks={[
        { label: 'Privacy Policy' },
        { label: 'Terms of Service' },
        { label: 'Help' },
      ]}
    >
      {/* Role toggle */}
      <div className="flex rounded-xl overflow-hidden border border-[var(--accent)]/20 bg-[var(--bg-page)] p-1 mb-6 gap-1">
        {['freelancer', 'client'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-1 text-[11px] xs:text-xs sm:text-sm font-bold rounded-lg
              leading-tight text-center whitespace-normal transition-all duration-200 ${
              role === r
                ? 'bg-[var(--accent)] text-[#061c1e] shadow-lg shadow-[var(--accent)]/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1">
              <span>{r === 'freelancer' ? '⚡' : '💼'}</span>
              <span className="truncate">{r === 'freelancer' ? 'I am a Freelancer' : 'I am a Client'}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Phone form — primary */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[var(--text-secondary)] text-xs font-bold mb-2 tracking-widest uppercase">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent)]/60">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your legal full name" className={inputBase} />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] text-xs font-bold mb-2 tracking-widest uppercase">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent)]/60">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 7L2 7" />
              </svg>
            </span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="name@example.com" className={inputBase} />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] text-xs font-bold mb-2 tracking-widest uppercase">
            Phone Number
          </label>
          <PhoneInput value={form.phone} onChange={(val) => setForm({ ...form, phone: val })} />
          <p className="mt-1.5 text-[var(--text-muted)] text-xs">OTP will be sent to this number.</p>
        </div>

        <button
          type="submit"
          disabled={sending || loading}
          className="w-full mt-2 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover,#21a0ab)] disabled:opacity-50 disabled:cursor-not-allowed text-[#061c1e] font-black tracking-widest text-sm transition-all duration-200 shadow-lg shadow-[var(--accent)]/25 hover:shadow-[var(--accent)]/35 hover:-translate-y-0.5 active:translate-y-0"
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

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--accent)]/20" />
        <span className="text-[var(--text-muted)] text-xs font-medium">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-[var(--accent)]/20" />
      </div>

      {/* Google Sign-Up — after form */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={googleLoading || sending || loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-3 rounded-xl
          bg-[var(--bg-page)] border border-[var(--accent)]/20
          hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5
          disabled:opacity-50 disabled:cursor-not-allowed
          text-[var(--text-primary)] font-semibold text-xs sm:text-sm
          transition-all duration-200"
      >
        {googleLoading ? (
          <svg className="animate-spin w-4 h-4 text-[var(--accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : <span className="flex-shrink-0"><GoogleIcon /></span>}
        <span className="truncate">
          {googleLoading ? 'Signing up…' : `Continue with Google as ${role === 'client' ? 'Client' : 'Freelancer'}`}
        </span>
      </button>

      {/* Switch to login */}
      <p className="text-center text-[var(--text-secondary)] text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--accent)] hover:opacity-80 font-bold underline underline-offset-4 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;