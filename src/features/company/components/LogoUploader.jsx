// src/features/company/components/LogoUploader.jsx
import { useRef, useState } from 'react';
import { useUploadCompanyLogo } from '../../../hooks/useEditCompany';

const LogoUploader = ({ currentLogo, onSuccess, onError }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const { mutate: uploadLogo, isPending } = useUploadCompanyLogo({
    onSuccess: (res) => {
      onSuccess?.(res);
    },
    onError: (e) => {
      setPreview(null);
      onError?.(e?.response?.data?.message || 'Logo upload failed.');
    },
  });

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      onError?.('Only JPEG, PNG and WebP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onError?.('Image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    uploadLogo(file);
  };

  const onInputChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const displaySrc = preview || currentLogo;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* Logo preview */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '1rem',
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-strong)'}`,
          background: displaySrc ? 'transparent' : 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.2s, background 0.2s',
          position: 'relative',
        }}
        onClick={() => !isPending && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Company logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '2rem' }}>🏢</span>
        )}

        {/* Loading overlay */}
        {isPending && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '0.85rem',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>Uploading…</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? 'Uploading…' : currentLogo ? 'Change Logo' : 'Upload Logo'}
        </button>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          JPEG, PNG or WebP · max 2MB
        </p>
      </div>
    </div>
  );
};

export default LogoUploader;