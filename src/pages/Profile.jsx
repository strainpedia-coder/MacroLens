import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Target, Activity, Scale, Trash2, RotateCcw, Save, Code } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { useMeals } from '../store/MealContext';
import { clearAllData } from '../utils/storage';
import './Profile.css';

const ACTIVITY_LABELS = {
  sedentary: 'Wenig aktiv',
  light: 'Leicht aktiv', 
  moderate: 'Mäßig aktiv',
  active: 'Sehr aktiv',
  veryActive: 'Extrem aktiv'
};

const GOAL_LABELS = {
  lose: 'Abnehmen',
  maintain: 'Halten',
  gain: 'Zunehmen'
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, dispatch } = useUser();
  const { meals } = useMeals();
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // OpenAI Dev State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [keySaved, setKeySaved] = useState(false);

  const totalMeals = meals.length;
  const uniqueDays = new Set(meals.map(m => m.date)).size;

  function handleSave() {
    dispatch({ type: 'CALCULATE_GOALS' });
    setEditing(false);
  }

  function handleReset() {
    clearAllData();
    window.location.reload();
  }

  function handleSaveKey() {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('openai_api_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  }

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
      </div>

      {/* User Card */}
      <motion.div 
        className="profile-card card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar">
          <User size={32} />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user.gender === 'male' ? '👨' : '👩'} {user.weight}kg · {user.height}cm</h2>
          <p className="profile-meta">{GOAL_LABELS[user.goal]} · {ACTIVITY_LABELS[user.activityLevel]}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="profile-stats"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card card-sm">
          <span className="stat-card__value">{totalMeals}</span>
          <span className="stat-card__label">Mahlzeiten</span>
        </div>
        <div className="stat-card card-sm">
          <span className="stat-card__value">{uniqueDays}</span>
          <span className="stat-card__label">Tage geloggt</span>
        </div>
        <div className="stat-card card-sm">
          <span className="stat-card__value">{meals.filter(m => m.isFavorite).length}</span>
          <span className="stat-card__label">Favoriten</span>
        </div>
      </motion.div>

      {/* Tagesziele */}
      <motion.div 
        className="card mb-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-md">
          <h3 className="section-title" style={{ margin: 0 }}>
            <Target size={16} style={{ marginRight: 6 }} />
            Tagesziele
          </h3>
          {!editing ? (
            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 'var(--font-xs)' }} onClick={() => setEditing(true)}>
              Bearbeiten
            </button>
          ) : (
            <button className="btn btn-accent" style={{ padding: '4px 10px', fontSize: 'var(--font-xs)' }} onClick={handleSave}>
              <Save size={12} /> Speichern
            </button>
          )}
        </div>

        {editing ? (
          <div className="profile-goals-edit">
            <div className="input-group">
              <label className="input-label">Kalorien (kcal)</label>
              <input
                type="number"
                className="input-field"
                value={user.calorieGoal}
                onChange={e => dispatch({ type: 'SET_CALORIE_GOAL', value: Number(e.target.value) })}
              />
            </div>
            <div className="profile-goals-row">
              <div className="input-group">
                <label className="input-label">Protein (g)</label>
                <input
                  type="number"
                  className="input-field"
                  value={user.macroGoals.protein}
                  onChange={e => dispatch({ type: 'SET_MACRO_GOALS', payload: { protein: Number(e.target.value) } })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Carbs (g)</label>
                <input
                  type="number"
                  className="input-field"
                  value={user.macroGoals.carbs}
                  onChange={e => dispatch({ type: 'SET_MACRO_GOALS', payload: { carbs: Number(e.target.value) } })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Fett (g)</label>
                <input
                  type="number"
                  className="input-field"
                  value={user.macroGoals.fat}
                  onChange={e => dispatch({ type: 'SET_MACRO_GOALS', payload: { fat: Number(e.target.value) } })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-goals">
            <div className="profile-goal">
              <span className="profile-goal__label">Kalorien</span>
              <span className="profile-goal__value text-calories">{user.calorieGoal} kcal</span>
            </div>
            <div className="profile-goal">
              <span className="profile-goal__label">Protein</span>
              <span className="profile-goal__value text-protein">{user.macroGoals.protein}g</span>
            </div>
            <div className="profile-goal">
              <span className="profile-goal__label">Kohlenhydrate</span>
              <span className="profile-goal__value text-carbs">{user.macroGoals.carbs}g</span>
            </div>
            <div className="profile-goal">
              <span className="profile-goal__label">Fett</span>
              <span className="profile-goal__value text-fat">{user.macroGoals.fat}g</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Body Data */}
      <motion.div 
        className="card mb-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="section-title">
          <Scale size={16} style={{ marginRight: 6 }} />
          Körperdaten
        </h3>
        <div className="profile-data">
          <div className="profile-data-row">
            <span>Geschlecht</span>
            <span>{user.gender === 'male' ? 'Männlich' : 'Weiblich'}</span>
          </div>
          <div className="profile-data-row">
            <span>Alter</span>
            <span>{user.age} Jahre</span>
          </div>
          <div className="profile-data-row">
            <span>Gewicht</span>
            <span>{user.weight} kg</span>
          </div>
          <div className="profile-data-row">
            <span>Größe</span>
            <span>{user.height} cm</span>
          </div>
          <div className="profile-data-row">
            <span>Aktivität</span>
            <span>{ACTIVITY_LABELS[user.activityLevel]}</span>
          </div>
        </div>
        <button 
          className="btn btn-ghost btn-block mt-lg"
          onClick={() => {
            localStorage.removeItem('macrolens_onboarding_done');
            navigate('/onboarding');
          }}
        >
          <RotateCcw size={14} />
          Onboarding wiederholen
        </button>
      </motion.div>

      {/* Developer API Setup */}
      <motion.div 
        className="card mb-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="section-title">
          <Code size={16} style={{ marginRight: 6 }} />
          Entwickler & API
        </h3>
        <p className="profile-step-desc" style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Hinterlege hier deinen echten OpenAI API Key, um die intelligente Bilderkennung zu aktivieren. Dieser wird nur lokal gespeichert.
        </p>
        
        <div className="input-group">
          <input
            type="password"
            className="input-field"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-proj-..."
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        
        <div className="flex justify-end mt-md">
          <button className="btn btn-accent" onClick={handleSaveKey} style={{ padding: '8px 16px', fontSize: 'var(--font-xs)' }}>
            <Save size={14} />
            {keySaved ? 'Gespeichert!' : 'Key speichern'}
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        className="card mb-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="section-title" style={{ color: 'var(--fat)' }}>
          Gefahrenzone
        </h3>
        {!showConfirm ? (
          <button className="btn btn-danger btn-block" onClick={() => setShowConfirm(true)}>
            <Trash2 size={16} />
            Alle Daten löschen
          </button>
        ) : (
          <div className="profile-confirm">
            <p className="profile-confirm__text">Bist du sicher? Alle Daten werden gelöscht.</p>
            <div className="profile-confirm__actions">
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Abbrechen</button>
              <button className="btn btn-danger" onClick={handleReset}>Ja, löschen</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Version */}
      <div className="profile-footer">
        <p>MacroLens v1.0 – Scanne dein Essen. Kenne deine Makros.</p>
      </div>
    </div>
  );
}
