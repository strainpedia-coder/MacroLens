import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import { useUser } from '../store/UserContext';
import { sumMealMacros } from '../utils/calculations';
import './WeeklyStats.css';

export default function WeeklyStats() {
  const { meals } = useMeals();
  const { user } = useUser();

  const weekData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = meals.filter(m => m.date === dateStr);
      const totals = sumMealMacros(dayMeals);
      days.push({
        date: dateStr,
        label: d.toLocaleDateString('de-DE', { weekday: 'short' }),
        dayNum: d.getDate(),
        ...totals,
        mealCount: dayMeals.length,
      });
    }
    return days;
  }, [meals]);

  // Durchschnitte
  const daysWithData = weekData.filter(d => d.mealCount > 0);
  const avg = daysWithData.length > 0 ? {
    calories: Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length),
    protein: Math.round(daysWithData.reduce((s, d) => s + d.protein, 0) / daysWithData.length),
    carbs: Math.round(daysWithData.reduce((s, d) => s + d.carbs, 0) / daysWithData.length),
    fat: Math.round(daysWithData.reduce((s, d) => s + d.fat, 0) / daysWithData.length),
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Trend: Letzte 3 Tage vs. Vorherige 4 Tage (wenn genug Daten)
  const calDiff = avg.calories - user.calorieGoal;
  const TrendIcon = calDiff > 50 ? TrendingUp : calDiff < -50 ? TrendingDown : Minus;
  const trendColor = calDiff > 50 ? 'var(--fat)' : calDiff < -50 ? 'var(--calories)' : 'var(--text-secondary)';
  const trendLabel = calDiff > 50 ? 'Über Ziel' : calDiff < -50 ? 'Unter Ziel' : 'Im Ziel';

  const maxCal = Math.max(...weekData.map(d => d.calories), user.calorieGoal) || 1;

  return (
    <div className="weekly-stats card">
      <div className="weekly-stats__header">
        <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
          <BarChart3 size={18} className="text-accent" />
          <h3 className="section-title" style={{ margin: 0 }}>Wochenübersicht</h3>
        </div>
        <div className="weekly-trend" style={{ color: trendColor }}>
          <TrendIcon size={14} />
          <span>{trendLabel}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="weekly-chart">
        {/* Goal Line */}
        <div 
          className="weekly-chart__goal-line" 
          style={{ bottom: `${(user.calorieGoal / maxCal) * 100}%` }}
        >
          <span className="weekly-chart__goal-label">{user.calorieGoal}</span>
        </div>

        {weekData.map((day, i) => {
          const height = day.calories > 0 ? (day.calories / maxCal) * 100 : 2;
          const isToday = i === 6;
          const overGoal = day.calories > user.calorieGoal;
          return (
            <div key={day.date} className="weekly-bar-col">
              <div className="weekly-bar-wrap">
                <motion.div
                  className={`weekly-bar ${isToday ? 'weekly-bar--today' : ''} ${overGoal ? 'weekly-bar--over' : ''}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
              <span className={`weekly-bar__label ${isToday ? 'weekly-bar__label--today' : ''}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Averages */}
      {daysWithData.length > 0 && (
        <div className="weekly-averages">
          <span className="weekly-averages__title">⌀ Durchschnitt ({daysWithData.length} Tage):</span>
          <div className="weekly-averages__grid">
            <div className="weekly-avg">
              <span className="weekly-avg__value text-calories">{avg.calories}</span>
              <span className="weekly-avg__label">kcal</span>
            </div>
            <div className="weekly-avg">
              <span className="weekly-avg__value text-protein">{avg.protein}g</span>
              <span className="weekly-avg__label">Protein</span>
            </div>
            <div className="weekly-avg">
              <span className="weekly-avg__value text-carbs">{avg.carbs}g</span>
              <span className="weekly-avg__label">Carbs</span>
            </div>
            <div className="weekly-avg">
              <span className="weekly-avg__value text-fat">{avg.fat}g</span>
              <span className="weekly-avg__label">Fett</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
