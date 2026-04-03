import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Edit3, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import './Result.css';

export default function Result() {
  const navigate = useNavigate();
  const { dispatch } = useMeals();
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('scanResult');
    if (data) {
      setResult(JSON.parse(data));
    } else {
      navigate('/scan', { replace: true });
    }
  }, [navigate]);

  if (!result) return null;

  const confidencePercent = Math.round(result.confidence * 100);
  const confidenceLevel = confidencePercent >= 90 ? 'high' : confidencePercent >= 75 ? 'medium' : 'low';

  function handleSave() {
    dispatch({ type: 'ADD_MEAL', payload: result });
    sessionStorage.removeItem('scanResult');
    setSaved(true);
    setTimeout(() => navigate('/', { replace: true }), 1200);
  }

  function handleEdit() {
    // Ergebnis im Storage behalten und zum Edit navigieren
    navigate(`/edit/new`);
  }

  return (
    <div className="page result-page">
      {/* Saved Toast */}
      {saved && (
        <motion.div 
          className="toast" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✅ Mahlzeit gespeichert!
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        className="result-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="result-header__badge">
          <Sparkles size={16} />
          KI-Ergebnis
        </div>
      </motion.div>

      {/* Erkannte Mahlzeit */}
      <motion.div 
        className="result-meal card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {result.imageUrl && (
          <div className="result-meal__image">
            <img src={result.imageUrl} alt={result.name} />
          </div>
        )}
        <h2 className="result-meal__name">{result.name}</h2>
        
        {/* Konfidenz */}
        <div className={`confidence-badge confidence-badge--${confidenceLevel}`}>
          <AlertCircle size={14} />
          <span>~{confidencePercent}% sicher</span>
        </div>

        <p className="result-meal__hint">
          Dies ist eine KI-Schätzung – du kannst alles anpassen.
        </p>
      </motion.div>

      {/* Makros Overview */}
      <motion.div 
        className="result-macros"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="result-macro-card result-macro-card--cal">
          <span className="result-macro__value">{result.calories}</span>
          <span className="result-macro__unit">kcal</span>
          <span className="result-macro__label">Kalorien</span>
        </div>
        <div className="result-macro-card result-macro-card--protein">
          <span className="result-macro__value">{result.protein}</span>
          <span className="result-macro__unit">g</span>
          <span className="result-macro__label">Protein</span>
        </div>
        <div className="result-macro-card result-macro-card--carbs">
          <span className="result-macro__value">{result.carbs}</span>
          <span className="result-macro__unit">g</span>
          <span className="result-macro__label">Carbs</span>
        </div>
        <div className="result-macro-card result-macro-card--fat">
          <span className="result-macro__value">{result.fat}</span>
          <span className="result-macro__unit">g</span>
          <span className="result-macro__label">Fett</span>
        </div>
      </motion.div>

      {/* Zutaten */}
      <motion.div 
        className="result-ingredients card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="section-title">Erkannte Zutaten</h3>
        <div className="result-ingredients__list">
          {result.ingredients.map((ing, i) => (
            <div key={ing.id || i} className="ingredient-row">
              <div className="ingredient-row__info">
                <span className="ingredient-row__name">{ing.name}</span>
                <span className="ingredient-row__amount">{ing.amount}</span>
              </div>
              <span className="ingredient-row__cal">{ing.calories} kcal</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="result-actions"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button className="btn btn-accent btn-lg btn-block" onClick={handleSave} disabled={saved}>
          <Check size={20} />
          Mahlzeit hinzufügen
        </button>
        <button className="btn btn-ghost btn-lg btn-block" onClick={handleEdit}>
          <Edit3 size={18} />
          Bearbeiten
          <ChevronRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
