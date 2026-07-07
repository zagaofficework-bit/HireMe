// profile/components/ProfileImageUploader.jsx
import { useRef, useState } from 'react';
import { useUpdateProfileImage } from '../../../hooks/useEditProfile';

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProfileImageUploader = ({ currentImage }) => {
  const fileInputRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState('');

  const { mutate: uploadImage, isPending, error } = useUpdateProfileImage({
    onSuccess: () => {
      setPendingFile(null);
      setPreview(null);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError('');

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Only JPEG, PNG and WebP images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  const handleSave = () => {
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append('profileImage', pendingFile); // field name matches multer .single('profileImage')
    uploadImage(formData);
  };

  const handleCancel = () => {
    setPendingFile(null);
    setPreview(null);
    setLocalError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayedImage = preview || currentImage || '/default-avatar.png';
  const serverError = error?.response?.data?.message;
  const hasPendingChange = !!pendingFile;

  return (
    <div className="profile-photo-uploader">
      <div className="profile-photo-uploader__avatar-wrap">
        <img src={displayedImage} alt="Profile" className="profile-photo-uploader__avatar" />
        {isPending && <div className="profile-photo-uploader__spinner-overlay">Uploading...</div>}
        <button
          type="button"
          className="profile-photo-uploader__camera-btn"
          onClick={triggerFilePicker}
          disabled={isPending}
          aria-label="Change profile photo"
        >
          📷
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {!hasPendingChange && (
        <button type="button" className="btn btn-outline" onClick={triggerFilePicker} disabled={isPending}>
          Change Photo
        </button>
      )}

      {hasPendingChange && (
        <div className="profile-photo-uploader__actions">
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Photo'}
          </button>
          <button type="button" className="btn btn-text" onClick={handleCancel} disabled={isPending}>
            Cancel
          </button>
        </div>
      )}

      <p className="profile-photo-uploader__hint">JPEG, PNG or WebP. Max {MAX_SIZE_MB}MB.</p>

      {localError && <p className="form-error">{localError}</p>}
      {serverError && <p className="form-error">{serverError}</p>}
    </div>
  );
};

export default ProfileImageUploader;