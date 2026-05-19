// src/features/auth/components/PhoneInput.jsx
import { useState, useRef, useEffect } from 'react';

const COUNTRIES = [
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'TH', dial: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
];

/**
 * PhoneInput component with country dial code selector.
 *
 * Props:
 *   value    – the full phone string (e.g. "+919876543210")
 *   onChange – called with the new full phone string
 */
const PhoneInput = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(COUNTRIES[0]); // default India
  const [localNumber, setLocalNumber] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Sync outward: combine selected dial + localNumber
  useEffect(() => {
    onChange(selected.dial + localNumber.replace(/\D/g, ''));
  }, [selected, localNumber]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex gap-2" ref={dropdownRef}>
      {/* Country selector button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-[#061c1e] border border-[#29c8d6]/20 hover:border-[#29c8d6]/50 text-[#eaf9fb] text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-[#29c8d6]/60 whitespace-nowrap min-w-[80px]"
      >
        <span className="text-base">{selected.flag}</span>
        <span className="text-[#29c8d6] text-xs font-bold">{selected.dial}</span>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#54d3de"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Number input */}
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => setLocalNumber(e.target.value.replace(/[^\d\s\-]/g, ''))}
        required
        placeholder="98765 43210"
        className="flex-1 bg-[#061c1e] border border-[#29c8d6]/20 rounded-xl px-4 py-3 text-[#eaf9fb] placeholder-[#29c8d6]/25 text-sm focus:outline-none focus:border-[#29c8d6]/60 focus:ring-1 focus:ring-[#29c8d6]/30 transition-all duration-200"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-[#29c8d6]/20 bg-[#0b1918] shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-[#29c8d6]/10">
            <div className="relative">
              <svg width="14" height="14" fill="none" stroke="#54d3de" strokeWidth="2" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full bg-[#061c1e] border border-[#29c8d6]/15 rounded-lg pl-8 pr-3 py-2 text-[#eaf9fb] placeholder-[#29c8d6]/30 text-xs focus:outline-none focus:border-[#29c8d6]/40 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-[#54d3de]/40 text-sm text-center">No countries found</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { setSelected(c); setOpen(false); setSearch(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#29c8d6]/10 transition-colors text-left ${
                    selected.code === c.code ? 'bg-[#29c8d6]/15 text-[#29c8d6]' : 'text-[#a9e9ef]'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-xs">{c.name}</span>
                  <span className="text-[#29c8d6]/60 text-xs font-bold">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;