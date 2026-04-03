import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar, BarChart2 } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import { useWater } from '../store/WaterContext';
import { useUser } from '../store/UserContext';
import MealCard from '../components/MealCard';
import HistoryStats from '../components/HistoryStats';
import { formatDate, sumMealMacros } from '../utils/calculations';
import './History.css';

export default function History() {
  const navigate = useNavigate();
  const { meals, dispatch } = useMeals();
  const { entries: waterEntries } = useWater();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'stats', 'favorites'

  // Letzte 30 Tage
  const days = useMemo(() => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  }, []);

  const filteredMeals = useMemo(() => {
    if (activeTab === 'favorites') return meals.filter(m => m.isFavorite);
    return meals.filter(m => m.date === selectedDate);
  }, [meals, selectedDate, activeTab]);

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
          className={`history-tab ${activeTab === 'calendar' ? 'history-tab--active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={16} />
          Verlauf
        </button>
        <button
          className={`history-tab ${activeTab === 'stats' ? 'history-tab--active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 size={16} />
          Statistiken
        </button>
        <button
          className={`history-tab ${activeTab === 'favorites' ? 'history-tab--active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Star size={16} />
          Favoriten
        </button>
      </div>

      {/* Date Selector */}
      {activeTab === 'calendar' && (
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
      {activeTab === 'calendar' && filteredMeals.length > 0 && (
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

      {/* Meal List for Calendar / Favorites */}
      {activeTab !== 'stats' && (
        <div className="history-meals">
          {filteredMeals.length === 0 ? (
            <div className="history-empty card">
              <p>{activeTab === 'favorites' ? '⭐ Noch keine Favoriten gespeichert.' : '📋 Keine Mahlzeiten an diesem Tag.'}</p>
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
      )}

      {/* Stats View */}
      {activeTab === 'stats' && (
        <HistoryStats meals={meals} waterEntries={waterEntries} user={user} days={days} />
      )}
    </div>
  );
}
