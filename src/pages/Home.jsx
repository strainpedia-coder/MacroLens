import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Plus, Flame, Sparkles, ArrowDown } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { useMeals } from '../store/MealContext';
import MacroRing from '../components/MacroRing';
import MacroBar from '../components/MacroBar';
import MealCard from '../components/MealCard';
import WaterTracker from '../components/WaterTracker';
import WeeklyStats from '../components/WeeklyStats';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { todayMeals, todayTotals, dispatch } = useMeals();

  const remaining = Math.max(0, user.calorieGoal - todayTotals.calories);
  const percentage = Math.min(100, Math.round((todayTotals.calories / user.calorieGoal) * 100));

  const getMessage = () => {
    if (todayMeals.length === 0) return '📸 Starte deinen Tag mit einem Scan!';
    if (percentage < 50) return '💪 Guter Start! Weiter so.';
    if (percentage < 80) return '🔥 Du bist auf dem richtigen Weg!';
    if (percentage < 100) return '🎯 Fast am Ziel! Noch etwas Platz.';
    return '✅ Tagesziel erreicht!';
  };

  const mealGroups = todayMeals.reduce((g, meal) => {
    const type = meal.mealType || 'Sonstiges';
    if (!g[type]) g[type] = [];
    g[type].push(meal);
    return g;
  }, {});

  return (
    <div className="page home">
      {/* Header */}
      <motion.div 
        className="home__header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="home__greeting">Heute</h1>
          <p className="home__date">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="home__streak">
          <Flame size={18} className="text-calories" />
        </div>
      </motion.div>

      {/* Kalorien Ring */}
      <motion.div 
        className="home__ring-section card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="home__ring-wrapper">
          <MacroRing 
            current={todayTotals.calories}
            goal={user.calorieGoal}
            size={180}
            strokeWidth={10}
          />
        </div>
        <p className="home__message">{getMessage()}</p>
        <div className="home__cal-summary">
          <div className="cal-stat">
            <span className="cal-stat__value">{todayTotals.calories}</span>
            <span className="cal-stat__label">gegessen</span>
          </div>
          <div className="cal-stat__divider" />
          <div className="cal-stat">
            <span className="cal-stat__value">{user.calorieGoal}</span>
            <span className="cal-stat__label">Ziel</span>
          </div>
          <div className="cal-stat__divider" />
          <div className="cal-stat">
            <span className="cal-stat__value text-calories">{remaining}</span>
            <span className="cal-stat__label">übrig</span>
          </div>
        </div>
      </motion.div>

      {/* Makro Bars */}
      <motion.div 
        className="home__macros card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="section-title">Makronährstoffe</h2>
        <div className="home__macro-bars">
          <MacroBar label="Protein" current={todayTotals.protein} goal={user.macroGoals.protein} color="var(--protein)" />
          <MacroBar label="Kohlenhydrate" current={todayTotals.carbs} goal={user.macroGoals.carbs} color="var(--carbs)" />
          <MacroBar label="Fett" current={todayTotals.fat} goal={user.macroGoals.fat} color="var(--fat)" />
        </div>
      </motion.div>

      {/* Wasser-Tracking (Kompakt) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <WaterTracker compact />
      </motion.div>

      {/* Mahlzeiten des Tages */}
      <motion.div 
        className="home__meals"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-md">
          <h2 className="section-title" style={{ margin: 0 }}>Heutige Mahlzeiten</h2>
          <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 'var(--font-xs)' }} onClick={() => navigate('/scan')}>
            <Plus size={14} />
            Hinzufügen
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div className="home__empty card">
            <Sparkles size={32} className="text-secondary" />
            <p>Noch keine Mahlzeiten heute</p>
            <p className="home__empty-hint">
              <ArrowDown size={14} /> Drücke <strong>+</strong> unten um loszulegen
            </p>
          </div>
        ) : (
          <div className="home__meal-list">
            {Object.entries(mealGroups).map(([type, meals]) => (
              <div key={type} className="meal-group">
                <h3 className="meal-group__title">{type}</h3>
                {meals.map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onToggleFavorite={(id) => dispatch({ type: 'TOGGLE_FAVORITE', id })}
                    onDelete={(id) => dispatch({ type: 'DELETE_MEAL', id })}
                    onClick={() => navigate(`/edit/${meal.id}`)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Wöchentliche Statistiken */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-xl"
      >
        <WeeklyStats />
      </motion.div>

      {/* Wasser-Tracker (Voll) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-3xl"
      >
        <WaterTracker />
      </motion.div>
    </div>
  );
}
