// src/features/search/components/NearbyResults.jsx
import { useState, useEffect } from 'react';
import { useNearbyProfiles } from '../../../hooks/useSearch';

/**
 * NearbyResults
 * Asks for the browser's geolocation, then lists profiles within
 * `radiusKm` of that point (GET /search/nearby).
 *
 * Self-contained — drop it anywhere (e.g. a "Talent near you" section
 * on the homepage) without wiring up coordinates yourself.
 */
const NearbyResults = ({ radiusKm = 30, limit = 12 }) => {
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | locating | done

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Location is not supported on this browser.');
      setGeoStatus('done');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('done');
      },
      () => {
        setGeoError('Enable location access to see talent near you.');
        setGeoStatus('done');
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  const { data, isLoading, isError } = useNearbyProfiles(
    coords ? { ...coords, radiusKm, limit } : null,
  );

  if (geoStatus === 'locating') {
    return <p className="text-sm text-[var(--text-muted)]">Finding talent near you…</p>;
  }

  if (geoError) {
    return <p className="text-sm text-[var(--text-muted)]">{geoError}</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--text-muted)]">Loading nearby profiles…</p>;
  }

  if (isError || !data?.profiles?.length) {
    return <p className="text-sm text-[var(--text-muted)]">No talent found within {radiusKm}km.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.profiles.map((p) => (
        <div key={p._id} className="theme-card p-4 flex gap-3">
          <img
            src={p.profileImage?.url || '/default-avatar.png'}
            alt={p.fullName}
            className="w-12 h-12 rounded-full object-cover border border-[var(--border)] flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{p.fullName}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {p.location?.city}{p.location?.city && p.location?.state ? ', ' : ''}{p.location?.state}
            </p>
            {p.isVerified && <span className="badge badge-accent mt-1 inline-block">Verified</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyResults;