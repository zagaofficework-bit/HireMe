// profile/components/Toast.jsx
//
// Lightweight toast — no external deps.
// Usage: import { useToast, ToastContainer } from './Toast'
// const { showToast } = useToast();
// showToast('Saved!', 'success');
// Render <ToastContainer /> once inside EditProfilePage.

import { useState, useCallback, useRef } from 'react';

let _showGlobal = null;

export const showToast = (message, type = 'success') => {
  if (_showGlobal) _showGlobal(message, type);
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const show = useCallback((message, type = 'success') => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // register globally so showToast() helper works
  _showGlobal = show;

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, show, dismiss };
};

const ICONS = {
  success: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  ),
};

const STYLES = {
  success: {
    bg:     'bg-[#0f2729] dark:bg-[#0f2729] border-[#29c8d6]/30',
    icon:   'text-[#29c8d6] bg-[#29c8d6]/10',
    text:   'text-white',
    bar:    'bg-[#29c8d6]',
  },
  error: {
    bg:     'bg-[#1a0f0f] dark:bg-[#1a0f0f] border-red-500/30',
    icon:   'text-red-400 bg-red-400/10',
    text:   'text-white',
    bar:    'bg-red-400',
  },
  info: {
    bg:     'bg-[#0c1f35] dark:bg-[#0c1f35] border-blue-400/30',
    icon:   'text-blue-400 bg-blue-400/10',
    text:   'text-white',
    bar:    'bg-blue-400',
  },
};

const Toast = ({ toast, onDismiss }) => {
  const s = STYLES[toast.type] || STYLES.success;
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl min-w-[260px] max-w-[340px] relative overflow-hidden animate-fade-up ${s.bg}`}
      style={{ animation: 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
    >
      {/* Icon */}
      <span className={`p-1.5 rounded-lg ${s.icon}`}>
        {ICONS[toast.type] || ICONS.success}
      </span>

      {/* Message */}
      <p className={`text-sm font-medium flex-1 leading-snug pt-0.5 ${s.text}`}>
        {toast.message}
      </p>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/40 hover:text-white/80 transition-colors ml-1 mt-0.5 text-xs flex-shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${s.bar} opacity-60`}
        style={{ animation: 'toastBar 3.5s linear forwards' }}
      />

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }) => (
  <div
    className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2.5 pointer-events-none"
    aria-live="polite"
    aria-atomic="false"
  >
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto">
        <Toast toast={t} onDismiss={onDismiss} />
      </div>
    ))}
  </div>
);