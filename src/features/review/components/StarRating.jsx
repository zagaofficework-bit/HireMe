// src/features/reviews/components/StarRating.jsx
// Dual-purpose: read-only display (profile cards, review list) and
// interactive input (ReviewForm). Controlled by the `interactive` prop.
import { useState } from 'react';

const SIZES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

const Star = ({ filled, half, className }) => (
  <svg
    viewBox="0 0 20 20"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    className={className}
  >
    {half && (
      <defs>
        <linearGradient id="star-half" x1="0" x2="100%" y1="0" y2="0">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <path
      fill={half ? 'url(#star-half)' : undefined}
      stroke={half ? 'currentColor' : undefined}
      strokeWidth={half ? 1.5 : undefined}
      d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.78L10 14.77l-5.18 2.68.99-5.78L1.62 7.59l5.79-.84L10 1.5z"
    />
  </svg>
);

const StarRating = ({
  value = 0,
  onChange,
  interactive = false,
  size = 'md',
  showValue = false,
  count,
  className = '',
}) => {
  const [hovered, setHovered] = useState(0);
  const sizeClass = SIZES[size] || SIZES.md;
  const display = interactive && hovered ? hovered : value;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHovered(0)}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={interactive ? 'Select rating' : `Rated ${value} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = display >= star;
          const half = !filled && display >= star - 0.5;
          return interactive ? (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onClick={() => onChange?.(star)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              className="leading-none transition-transform hover:scale-110"
              style={{ color: filled || (hovered && hovered >= star) ? 'var(--warning)' : 'var(--text-muted)' }}
            >
              <Star filled={filled || (hovered ? hovered >= star : false)} className={sizeClass} />
            </button>
          ) : (
            <span
              key={star}
              style={{ color: filled || half ? 'var(--warning)' : 'var(--border-strong)' }}
            >
              <Star filled={filled} half={half} className={sizeClass} />
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;