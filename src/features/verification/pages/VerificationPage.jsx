// src/features/verification/pages/VerificationPage.jsx
import MainLayout from '../../../layouts/MainLayout';
import VerificationStatus from '../components/VerificationStatus';
import EmailVerifyForm from '../components/EmailVerifyForm';
import PhoneVerifyForm from '../components/PhoneVerifyForm';

const VerificationPage = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Verification
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Verify your email and phone to unlock full access to your account.
          </p>
        </div>

        <VerificationStatus />
        <EmailVerifyForm />
        <PhoneVerifyForm />
      </div>
    </MainLayout>
  );
};

export default VerificationPage;