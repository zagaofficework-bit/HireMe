// src/features/hire/pages/HireRequestsPage.jsx
//
// Freelancer's inbox — suggested route: /hire/requests
// Add to your router:
//   <Route path="/hire/requests" element={<HireRequestsPage />} />
// (wrap in whatever ProtectedRoute you use elsewhere, freelancer-only)
import { useIncomingHireRequests, useAcceptHireRequest, useRejectHireRequest } from '../../../hooks/useHire';
import MainLayout from '../../../layouts/MainLayout';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'status-pill-warning' },
  accepted:  { label: 'Accepted',  cls: 'status-pill-success' },
  rejected:  { label: 'Rejected',  cls: 'status-pill-danger' },
  cancelled: { label: 'Cancelled', cls: 'status-pill-muted' },
};

const RequestCard = ({ request, onAccept, onReject, isResponding }) => {
  const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;
  const client = request.client || {};

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: '50%',
          overflow: 'hidden', flexShrink: 0,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {client.profileImage?.url ? (
          <img src={client.profileImage.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '1.1rem' }}>👤</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {client.fullName || 'A client'}
          </p>
          <span className={`status-pill ${status.cls}`} style={{ fontSize: '0.65rem' }}>
            {status.label}
          </span>
        </div>

        {request.message && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {request.message}
          </p>
        )}

        <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {new Date(request.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>

        {request.status === 'pending' && (
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.9rem' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              disabled={isResponding}
              onClick={() => onAccept(request._id)}
            >
              Accept
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              disabled={isResponding}
              onClick={() => onReject(request._id)}
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HireRequestsPage = () => {
  const { data: requests = [], isLoading, isError } = useIncomingHireRequests();

  const { mutate: accept, isPending: isAccepting } = useAcceptHireRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectHireRequest();

  const isResponding = isAccepting || isRejecting;

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Hire Requests
        </h1>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Clients who want to hire you.
        </p>

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ height: 90, borderRadius: '1rem', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }}
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="page-error">Couldn't load your hire requests. Please try again.</div>
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <div className="empty-state-page">
            <h2>No hire requests yet</h2>
            <p>When a client wants to hire you, it'll show up here.</p>
          </div>
        )}

        {!isLoading && requests.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {requests.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onAccept={accept}
                onReject={reject}
                isResponding={isResponding}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HireRequestsPage;