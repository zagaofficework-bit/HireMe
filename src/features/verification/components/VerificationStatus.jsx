// src/features/verification/components/VerificationStatus.jsx
import { useVerificationStatus } from '../../../hooks/useVerification';

const StatusRow = ({ label, value, isVerified }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {value || 'Not provided'}
      </p>
    </div>

    {isVerified ? (
      <span className="status-pill status-pill-success">Verified</span>
    ) : (
      <span className="status-pill status-pill-warning">Unverified</span>
    )}
  </div>
);

const VerificationStatus = () => {
  const { data, isLoading, isError } = useVerificationStatus();

  if (isLoading) {
    return (
      <div className="theme-card p-6 animate-pulse">
        <div className="h-4 w-32 rounded bg-[var(--bg-elevated)] mb-4" />
        <div className="h-10 rounded bg-[var(--bg-elevated)] mb-2" />
        <div className="h-10 rounded bg-[var(--bg-elevated)]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="theme-card p-6">
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          Could not load verification status.
        </p>
      </div>
    );
  }

  return (
    <div className="theme-card p-6">
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        Account verification
      </h3>
      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
        Verified accounts build trust with clients.
      </p>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        <StatusRow label="Email" value={data.email?.value} isVerified={data.email?.isVerified} />
        <StatusRow label="Phone" value={data.phone?.value} isVerified={data.phone?.isVerified} />
      </div>
    </div>
  );
};

export default VerificationStatus;