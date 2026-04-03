import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import MealCard from '../components/MealCard';
import { formatDate, sumMealMacros } from '../utils/calculations';
import './History.css';

export default function History() {
  const navigate = useNavigate();
  const { meals, dispatch } = useMeals();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Letzte 7 Tage
  const days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  }, []);

  const filteredMeals = useMemo(() => {
    if (showFavorites) return meals.filter(m => m.isFavorite);
    return meals.filter(m => m.date === selectedDate);
  }, [meals, selectedDate, showFavorites]);

  const dayTotals = useMemo(() => sumMealMacros(filteredMeals), [filteredMeals]);

  const favCount = useMemo(() => meals.filter(m => m.isFavorite).length, [meals]);

  return (
    <div className="page history-page">
      <div className="page-header">
        <h1 className="page-title">Verlauf</h1>
      </div>

      {/* Filter Tabs */}
      <div className="history-tabs mb-lg">
        <button
          className={`history-tab ${!showFavorites ? 'history-tab--active' : ''}`}
          onClick={() => setShowFavorites(false)}
        >
          <Calendar size={16} />
          Kalender
        </button>
        <button
          className={`history-tab ${showFavorites ? 'history-tab--active' : ''}`}
          onClick={() => setShowFavorites(true)}
        >
          <Star size={16} />
          Favoriten ({favCount})
        </button>
      </div>

      {/* Date Selector */}
      {!showFavorites && (
        <motion.div 
          className="history-dates mb-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {days.map(day => {
            const d = new Date(day);
            const isToday = day === new Date().toISOString().split('T')[0];
            const isSelected = day === selectedDate;
            const dayMeals = meals.filter(m => m.date === day);
            return (
              <button
                key={day}
                className={`date-chip ${isSelected ? 'date-chip--selected' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <span className="date-chip__day">{isToday ? 'Heute' : d.toLocaleDateString('de-DE', { weekday: 'short' })}</span>
                <span className="date-chip__num">{d.getDate()}</span>
                {dayMeals.length > 0 && <div className="date-chip__dot" />}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Day Summary */}
      {!showFavorites && filteredMeals.length > 0 && (
        <motion.div 
          className="history-summary card-sm mb-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="history-summary__stat">
            <span className="history-summary__value text-calories">{dayTotals.calories}</span>
            <span className="history-summary__label">kcal</span>
          </div>
          <div className="history-summary__stat">
            <span className="history-summary__value text-protein">{dayTotals.protein}g</span>
            <span className="history-summary__label">Protein</span>
          </div>
          <div className="history-summary__stat">
            <span className="history-summary__value text-carbs">{dayTotals.carbs}g</span>
            <span className="history-summary__label">Carbs</span>
          </div>
          <div className="history-summary__stat">
            <span className="history-summary__value text-fat">{dayTotals.fat}g</span>
            <span className="history-summary__label">Fett</span>
          </div>
        </motion.div>
      )}

      {/* Meal List */}
      <div className="history-meals">
        {filteredMeals.length === 0 ? (
          <div className="history-empty card">
            <p>{showFavorites ? '⭐ Noch keine Favoriten gespeichert.' : '📋 Keine Mahlzeiten an diesem Tag.'}</p>
          </div>
        ) : (
          filteredMeals.map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MealCard
                meal={meal}
                onToggleFavorite={(id) => dispatch({ type: 'TOGGLE_FAVORITE', id })}
                onDelete={(id) => dispatch({ type: 'DELETE_MEAL', id })}
                onClick={() => navigate(`/edit/${meal.id}`)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
