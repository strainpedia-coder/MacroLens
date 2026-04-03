import { useEffect, useRef } from 'react';
import './MacroBar.css';

/**
 * Horizontaler Makro-Fortschrittsbalken
 */
export default function MacroBar({ 
  label, 
  current, 
  goal, 
  color, 
  unit = 'g',
  animate = true 
}) {
  const barRef = useRef(null);
  const percentage = Math.min(100, Math.max(0, (current / goal) * 100));

  useEffect(() => {
    if (animate && barRef.current) {
      barRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          barRef.current.style.width = `${percentage}%`;
        });
      });
    }
  }, [current, goal, animate, percentage]);

  return (
    <div className="macro-bar">
      <div className="macro-bar__header">
        <span className="macro-bar__label" style={{ color }}>{label}</span>
        <span className="macro-bar__values">
          <span className="macro-bar__current">{Math.round(current)}</span>
          <span className="macro-bar__separator">/</span>
          <span className="macro-bar__goal">{goal}{unit}</span>
        </span>
      </div>
      <div className="macro-bar__track">
        <div 
          ref={barRef}
          className="macro-bar__fill"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            width: animate ? '0%' : `${percentage}%`,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
    </div>
  );
}
