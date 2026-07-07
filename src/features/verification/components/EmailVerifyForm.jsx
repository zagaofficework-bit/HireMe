// src/features/verification/components/EmailVerifyForm.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerificationStatus, useSendEmailVerification, useVerifyEmail } from '../../../hooks/useVerification';

const EmailVerifyForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: status } = useVerificationStatus();

  const sendEmail = useSendEmailVerification();
  const verify = useVerifyEmail();

  const [manualToken, setManualToken] = useState('');

  // Auto-verify when the user arrives via the emailed link:
  // /verify-email?token=xxx&userId=yyy
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token && !verify.isSuccess && !verify.isPending) {
      verify.mutate(
        { token, userId },
        {
          onSettled: () => {
            // Strip token/userId from the URL once handled, success or fail
            searchParams.delete('token');
            searchParams.delete('userId');
            setSearchParams(searchParams, { replace: true });
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isVerified = status?.email?.isVerified;

  if (isVerified) {
    return (
      <div className="theme-card p-6">
        <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
          ✓ Your email is verified.
        </p>
      </div>
    );
  }

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    verify.mutate({ token: manualToken.trim() });
  };

  return (
    <div className="theme-card p-6 space-y-4">
      <div>
        <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Verify your email
        </h4>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {status?.email?.value
            ? `We'll send a verification link to ${status.email.value}.`
            : 'Add an email address to your profile to verify it.'}
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        disabled={sendEmail.isPending || !status?.email?.value}
        onClick={() => sendEmail.mutate()}
      >
        {sendEmail.isPending ? 'Sending…' : 'Send verification email'}
      </button>

      {/* Fallback: paste token manually if the link can't be opened in this browser */}
      <form onSubmit={handleManualSubmit} className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <label className="text-xs font-medium block mb-1.5 pt-3" style={{ color: 'var(--text-muted)' }}>
          Already have a token? Paste it here
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="theme-input rounded-lg px-3 py-2 text-sm flex-1"
            placeholder="Verification token"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" disabled={verify.isPending || !manualToken.trim()}>
            {verify.isPending ? 'Verifying…' : 'Verify'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerifyForm;