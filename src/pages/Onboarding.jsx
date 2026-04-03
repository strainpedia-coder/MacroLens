import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Activity, Scale, ChevronRight, ChevronLeft, Sparkles, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { setOnboardingDone } from '../utils/storage';
import './Onboarding.css';

const STEPS = ['welcome', 'goal', 'body', 'activity', 'ready'];

const GOALS = [
  { id: 'lose', label: 'Abnehmen', desc: 'Fett verlieren, definierter werden', icon: TrendingDown, color: 'var(--accent-400)' },
  { id: 'maintain', label: 'Gewicht halten', desc: 'Aktuelle Form beibehalten', icon: Minus, color: 'var(--calories)' },
  { id: 'gain', label: 'Zunehmen', desc: 'Muskeln aufbauen, Masse gewinnen', icon: TrendingUp, color: 'var(--protein)' }
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Wenig aktiv', desc: 'Büroarbeit, wenig Bewegung' },
  { id: 'light', label: 'Leicht aktiv', desc: '1-2x Sport pro Woche' },
  { id: 'moderate', label: 'Mäßig aktiv', desc: '3-5x Sport pro Woche' },
  { id: 'active', label: 'Sehr aktiv', desc: '6-7x Sport pro Woche' },
  { id: 'veryActive', label: 'Extrem aktiv', desc: 'Profisport / körperliche Arbeit' }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const { user, dispatch } = useUser();
  const navigate = useNavigate();

  const currentStep = STEPS[step];
  const canProceed = () => {
    if (currentStep === 'body') return user.weight > 0 && user.height > 0 && user.age > 0;
    return true;
  };

  function next() {
    if (step < STEPS.length - 1) {
      if (currentStep === 'activity' || currentStep === 'body') {
        dispatch({ type: 'CALCULATE_GOALS' });
      }
      setStep(s => s + 1);
    }
  }

  function prev() {
    if (step > 0) setStep(s => s - 1);
  }

  function finish() {
    dispatch({ type: 'CALCULATE_GOALS' });
    setOnboardingDone();
    navigate('/', { replace: true });
  }

  const pageVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 }
  };

  return (
    <div className="onboarding">
      {/* Progress Bar */}
      <div className="onboarding__progress">
        {STEPS.map((_, i) => (
          <div key={i} className={`progress-dot ${i <= step ? 'progress-dot--active' : ''}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="onboarding__content"
        >
          {/* WELCOME */}
          {currentStep === 'welcome' && (
            <div className="onboarding__step">
              <div className="onboarding__icon-wrap">
                <div className="onboarding__logo">
                  <Sparkles size={48} />
                </div>
              </div>
              <h1 className="onboarding__title">MacroLens</h1>
              <p className="onboarding__tagline">Scanne dein Essen.<br/>Kenne deine Makros.</p>
              <p className="onboarding__desc">
                Fotografiere deine Mahlzeiten und erhalte sofort Kalorien & Makros. 
                Schnell, einfach und mit voller Kontrolle.
              </p>
            </div>
          )}

          {/* GOAL */}
          {currentStep === 'goal' && (
            <div className="onboarding__step">
              <Target size={32} className="onboarding__step-icon" />
              <h2 className="onboarding__step-title">Was ist dein Ziel?</h2>
              <p className="onboarding__step-desc">Wir passen deine Kalorien- und Makroziele an.</p>
              <div className="onboarding__options">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    className={`option-card ${user.goal === g.id ? 'option-card--selected' : ''}`}
                    onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'goal', value: g.id })}
                    style={user.goal === g.id ? { borderColor: g.color } : {}}
                  >
                    <g.icon size={24} style={{ color: g.color }} />
                    <div>
                      <span className="option-card__label">{g.label}</span>
                      <span className="option-card__desc">{g.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BODY */}
          {currentStep === 'body' && (
            <div className="onboarding__step">
              <Scale size={32} className="onboarding__step-icon" />
              <h2 className="onboarding__step-title">Deine Körperdaten</h2>
              <p className="onboarding__step-desc">Für eine genaue Berechnung deiner Ziele.</p>
              
              <div className="onboarding__form">
                <div className="onboarding__gender-toggle">
                  <button 
                    className={`gender-btn ${user.gender === 'male' ? 'gender-btn--active' : ''}`}
                    onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'gender', value: 'male' })}
                  >
                    Männlich
                  </button>
                  <button 
                    className={`gender-btn ${user.gender === 'female' ? 'gender-btn--active' : ''}`}
                    onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'gender', value: 'female' })}
                  >
                    Weiblich
                  </button>
                </div>

                <div className="input-group">
                  <label className="input-label">Alter</label>
                  <input
                    type="number"
                    className="input-field"
                    value={user.age || ''}
                    onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'age', value: Number(e.target.value) })}
                    placeholder="25"
                    min="10"
                    max="120"
                  />
                </div>

                <div className="onboarding__form-row">
                  <div className="input-group">
                    <label className="input-label">Gewicht (kg)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={user.weight || ''}
                      onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'weight', value: Number(e.target.value) })}
                      placeholder="75.0"
                      step="0.1"
                      min="30"
                      max="300"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Größe (cm)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={user.height || ''}
                      onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'height', value: Number(e.target.value) })}
                      placeholder="175"
                      min="100"
                      max="250"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY */}
          {currentStep === 'activity' && (
            <div className="onboarding__step">
              <Activity size={32} className="onboarding__step-icon" />
              <h2 className="onboarding__step-title">Wie aktiv bist du?</h2>
              <p className="onboarding__step-desc">Das beeinflusst deinen Kalorienbedarf.</p>
              <div className="onboarding__options">
                {ACTIVITY_LEVELS.map(a => (
                  <button
                    key={a.id}
                    className={`option-card option-card--compact ${user.activityLevel === a.id ? 'option-card--selected' : ''}`}
                    onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'activityLevel', value: a.id })}
                  >
                    <div>
                      <span className="option-card__label">{a.label}</span>
                      <span className="option-card__desc">{a.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* READY */}
          {currentStep === 'ready' && (
            <div className="onboarding__step">
              <div className="onboarding__icon-wrap">
                <div className="onboarding__logo onboarding__logo--success">
                  <Sparkles size={48} />
                </div>
              </div>
              <h2 className="onboarding__step-title">Alles bereit! 🎉</h2>
              <p className="onboarding__step-desc">Deine personalisierten Tagesziele:</p>
              
              <div className="onboarding__goals-preview">
                <div className="goal-preview-card goal-preview-card--cal">
                  <span className="goal-preview__value">{user.calorieGoal}</span>
                  <span className="goal-preview__label">Kalorien</span>
                </div>
                <div className="goal-preview-row">
                  <div className="goal-preview-card goal-preview-card--protein">
                    <span className="goal-preview__value">{user.macroGoals.protein}g</span>
                    <span className="goal-preview__label">Protein</span>
                  </div>
                  <div className="goal-preview-card goal-preview-card--carbs">
                    <span className="goal-preview__value">{user.macroGoals.carbs}g</span>
                    <span className="goal-preview__label">Carbs</span>
                  </div>
                  <div className="goal-preview-card goal-preview-card--fat">
                    <span className="goal-preview__value">{user.macroGoals.fat}g</span>
                    <span className="goal-preview__label">Fett</span>
                  </div>
                </div>
              </div>
              <p className="onboarding__hint">Du kannst diese Ziele jederzeit im Profil ändern.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="onboarding__nav">
        {step > 0 && (
          <button className="btn btn-ghost" onClick={prev}>
            <ChevronLeft size={18} />
            Zurück
          </button>
        )}
        <div style={{ flex: 1 }} />
        {currentStep === 'ready' ? (
          <button className="btn btn-accent btn-lg" onClick={finish}>
            Los geht's! 🚀
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={next}
            disabled={!canProceed()}
          >
            Weiter
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
