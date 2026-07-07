// src/features/verification/components/PhoneVerifyForm.jsx
import { useState } from 'react';
import { useVerificationStatus, useSendPhoneOtp, useVerifyPhone } from '../../../hooks/useVerification';

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const PhoneVerifyForm = () => {
  const { data: status } = useVerificationStatus();
  const sendOtp = useSendPhoneOtp();
  const verifyOtp = useVerifyPhone();

  const [phone, setPhone] = useState(status?.phone?.value || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const isVerified = status?.phone?.isVerified;

  if (isVerified) {
    return (
      <div className="theme-card p-6">
        <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
          ✓ Your phone is verified.
        </p>
      </div>
    );
  }

  const phoneValid = PHONE_REGEX.test(phone.trim());

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneValid) return;
    sendOtp.mutate(phone.trim(), {
      onSuccess: () => setOtpSent(true),
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) return;
    verifyOtp.mutate(
      { phone: phone.trim(), otp: otp.trim() },
      {
        onSuccess: () => {
          setOtpSent(false);
          setOtp('');
        },
      }
    );
  };

  return (
    <div className="theme-card p-6 space-y-4">
      <div>
        <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Verify your phone
        </h4>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          We'll text a 6-digit code to confirm it's you.
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="flex gap-2">
        <input
          type="tel"
          className="theme-input rounded-lg px-3 py-2 text-sm flex-1"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={otpSent}
        />
        <button
          type="submit"
          className="btn btn-primary whitespace-nowrap"
          disabled={!phoneValid || sendOtp.isPending}
        >
          {sendOtp.isPending ? 'Sending…' : otpSent ? 'Resend OTP' : 'Send OTP'}
        </button>
      </form>
      {!phoneValid && phone.length > 0 && (
        <p className="text-xs -mt-2" style={{ color: 'var(--danger)' }}>
          Enter a valid phone number with country code.
        </p>
      )}

      {otpSent && (
        <form onSubmit={handleVerifyOtp} className="pt-2 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="theme-input rounded-lg px-3 py-2 text-sm flex-1 mt-3 tracking-widest"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          />
          <button
            type="submit"
            className="btn btn-secondary mt-3"
            disabled={otp.length !== 6 || verifyOtp.isPending}
          >
            {verifyOtp.isPending ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneVerifyForm;