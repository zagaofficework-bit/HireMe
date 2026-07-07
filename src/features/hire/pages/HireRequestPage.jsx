// src/features/hire/pages/HireRequestPage.jsx
//
// Route: /profile/:id/hire — this is where PublicProfilePage.jsx's
// goToHire() already navigates to (navigate(`/profile/${id}/hire`)).
// If you already have a different file at that route, tell me and I'll
// merge this logic into it instead of adding a second page.
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { usePublicProfile } from '../../../hooks/useProfile';
import { useSendHireRequest } from '../../../hooks/useHire';

const HireRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: profile, isLoading } = usePublicProfile(id);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const { mutate: sendRequest, isPending } = useSendHireRequest({
    onSuccess: () => navigate(`/profile/${id}`, { state: { hireSent: true } }),
    onError: (err) => setErrorMsg(err?.response?.data?.message || 'Failed to send hire request.'),
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="page-loading">Loading profile...</div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="page-error">Profile not found.</div>
      </MainLayout>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    sendRequest({ profileId: id, message: message.trim() });
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 560, margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: '0.75rem',
                overflow: 'hidden', flexShrink: 0,
                background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {profile.profileImage?.url ? (
                <img
                  src={profile.profileImage.url}
                  alt={profile.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '1.3rem' }}>👤</span>
              )}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Hire {profile.fullName}
              </h2>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {profile.category?.name || 'Freelancer'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="hire-message"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
            >
              Message (optional)
            </label>
            <textarea
              id="hire-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Tell ${profile.fullName?.split(' ')[0] || 'them'} about your project...`}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            {errorMsg && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--danger)' }}>
                {errorMsg}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
                style={{ flex: 1 }}
              >
                {isPending ? 'Sending...' : 'Send Hire Request'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={isPending}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default HireRequestPage;