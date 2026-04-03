import { useEffect, useRef } from 'react';
import './MacroRing.css';

/**
 * Kreisförmige Fortschrittsanzeige für Kalorien
 */
export default function MacroRing({ 
  current, 
  goal, 
  size = 180, 
  strokeWidth = 10,
  color = 'var(--calories)',
  label = 'kcal',
  showRemaining = true,
  animate = true 
}) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (current / goal) * 100));
  const offset = circumference - (percentage / 100) * circumference;
  const remaining = Math.max(0, goal - current);

  useEffect(() => {
    if (animate && circleRef.current) {
      circleRef.current.style.transition = 'none';
      circleRef.current.style.strokeDashoffset = circumference;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          circleRef.current.style.strokeDashoffset = offset;
        });
      });
    }
  }, [current, goal, animate, circumference, offset]);

  return (
    <div className="macro-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="macro-ring__svg">
        {/* Hintergrund-Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-border)"
          strokeWidth={strokeWidth}
        />
        {/* Fortschritts-Ring */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          className="macro-ring__progress"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="macro-ring__content">
        {showRemaining ? (
          <>
            <span className="macro-ring__value">{remaining}</span>
            <span className="macro-ring__label">übrig</span>
            <span className="macro-ring__sublabel">{label}</span>
          </>
        ) : (
          <>
            <span className="macro-ring__value">{current}</span>
            <span className="macro-ring__label">{label}</span>
          </>
        )}
      </div>
    </div>
  );
}
