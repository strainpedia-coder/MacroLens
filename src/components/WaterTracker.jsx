import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useWater } from '../store/WaterContext';
import './WaterTracker.css';

const QUICK_AMOUNTS = [
  { label: '🥤 Glas', amount: 250 },
  { label: '🍶 Fl. klein', amount: 500 },
  { label: '💧 Fl. groß', amount: 750 },
  { label: '🫗 Liter', amount: 1000 }
];

export default function WaterTracker({ compact = false }) {
  const { todayIntake, dailyGoal, percentage, dispatch } = useWater();

  const fillHeight = Math.min(100, percentage);
  const remaining = Math.max(0, dailyGoal - todayIntake);

  if (compact) {
    return (
      <div className="water-compact card-sm">
        <div className="water-compact__left">
          <Droplets size={18} className="text-water" />
          <div>
            <span className="water-compact__value">{todayIntake}ml</span>
            <span className="water-compact__goal"> / {dailyGoal}ml</span>
          </div>
        </div>
        <div className="water-compact__bar">
          <motion.div 
            className="water-compact__fill"
            initial={{ width: 0 }}
            animate={{ width: `${fillHeight}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="water-compact__actions">
          <button className="water-quick-btn" onClick={() => dispatch({ type: 'ADD_WATER', amount: 250 })}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="water-tracker card">
      <div className="water-header">
        <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
          <Droplets size={20} className="text-water" />
          <h3 className="section-title" style={{ margin: 0 }}>Wasser</h3>
        </div>
        <span className="water-percentage">{percentage}%</span>
      </div>

      {/* Wasser-Visualisierung */}
      <div className="water-visual">
        <div className="water-glass">
          <motion.div 
            className="water-glass__fill"
            initial={{ height: 0 }}
            animate={{ height: `${fillHeight}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div className="water-glass__info">
            <span className="water-glass__current">{todayIntake}</span>
            <span className="water-glass__unit">ml</span>
          </div>
        </div>
        <div className="water-stats">
          <div className="water-stat">
            <span className="water-stat__label">Ziel</span>
            <span className="water-stat__value">{dailyGoal}ml</span>
          </div>
          <div className="water-stat">
            <span className="water-stat__label">Übrig</span>
            <span className="water-stat__value">{remaining}ml</span>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="water-quick-buttons">
        {QUICK_AMOUNTS.map(qa => (
          <button
            key={qa.amount}
            className="water-add-btn"
            onClick={() => dispatch({ type: 'ADD_WATER', amount: qa.amount })}
          >
            <span className="water-add-btn__emoji">{qa.label.split(' ')[0]}</span>
            <span className="water-add-btn__label">{qa.label.split(' ').slice(1).join(' ')}</span>
            <span className="water-add-btn__amount">+{qa.amount}ml</span>
          </button>
        ))}
      </div>

      {/* Undo/Reset */}
      {todayIntake > 0 && (
        <div className="water-actions">
          <button 
            className="btn btn-ghost" 
            style={{ fontSize: 'var(--font-xs)', padding: '4px 10px' }}
            onClick={() => dispatch({ type: 'REMOVE_WATER', amount: 250 })}
          >
            <Minus size={12} /> 250ml entfernen
          </button>
        </div>
      )}
    </div>
  );
}
