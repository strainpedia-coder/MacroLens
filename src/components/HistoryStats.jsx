import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Droplets, Activity, Flame } from 'lucide-react';
import { sumMealMacros } from '../utils/calculations';
import './HistoryStats.css';
import WeeklyStats from './WeeklyStats';

export default function HistoryStats({ meals, waterEntries, user, days }) {
  // Tägliche Analysen für den angeforderten Zeitraum
  const dayStats = useMemo(() => {
    return days.map(day => {
      const dayMeals = meals.filter(m => m.date === day);
      return {
        date: day,
        ...sumMealMacros(dayMeals),
        water: waterEntries[day] || 0
      };
    });
  }, [meals, waterEntries, days]);

  const activeDays = dayStats.filter(d => d.calories > 0);
  
  const avg = activeDays.length > 0 ? {
    calories: Math.round(activeDays.reduce((sum, d) => sum + d.calories, 0) / activeDays.length),
    protein: Math.round(activeDays.reduce((sum, d) => sum + d.protein, 0) / activeDays.length),
    carbs: Math.round(activeDays.reduce((sum, d) => sum + d.carbs, 0) / activeDays.length),
    fat: Math.round(activeDays.reduce((sum, d) => sum + d.fat, 0) / activeDays.length),
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const waterActiveDays = dayStats.filter(d => d.water > 0);
  const avgWater = waterActiveDays.length > 0 
    ? Math.round(waterActiveDays.reduce((sum, d) => sum + d.water, 0) / waterActiveDays.length)
    : 0;

  // Makroverhältnisse basierend auf dem Durchschnitt der aktiven Tage berechnen
  // 1g Protein = 4kcal, 1g Carbs = 4kcal, 1g Fett = 9kcal
  const pKcal = avg.protein * 4;
  const cKcal = avg.carbs * 4;
  const fKcal = avg.fat * 9;
  const totalKcal = pKcal + cKcal + fKcal || 1;
  
  const pPct = Math.round((pKcal / totalKcal) * 100);
  const cPct = Math.round((cKcal / totalKcal) * 100);
  const fPct = Math.round((fKcal / totalKcal) * 100);

  if (activeDays.length === 0) {
    return (
      <div className="history-empty card">
        <p>Zu wenig Daten für eine Analyse. Tracke zunächst ein paar Mahlzeiten!</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="history-stats-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Makro-Verteilung */}
      <div className="card mb-lg">
        <h3 className="section-title mb-md">
          <PieChart size={16} className="mr-sm" />
          Makro-Verteilung (Ø {activeDays.length} Tage)
        </h3>
        
        <div className="macro-distribution">
          {/* Progress Bar Layer */}
          <div className="macro-bar-visual">
            <motion.div 
              className="macro-bar-segment" 
              style={{ background: 'var(--protein)', width: `${pPct}%` }}
              initial={{ width: 0 }} animate={{ width: `${pPct}%` }} transition={{ duration: 1, delay: 0.1 }}
            />
            <motion.div 
              className="macro-bar-segment" 
              style={{ background: 'var(--carbs)', width: `${cPct}%` }}
              initial={{ width: 0 }} animate={{ width: `${cPct}%` }} transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div 
              className="macro-bar-segment" 
              style={{ background: 'var(--fat)', width: `${fPct}%` }}
              initial={{ width: 0 }} animate={{ width: `${fPct}%` }} transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          {/* Legends */}
          <div className="macro-distribution__legends">
            <div className="macro-legend">
              <div className="macro-legend__dot" style={{ background: 'var(--protein)' }} />
              <div className="macro-legend__info">
                <span className="macro-legend__title">Protein</span>
                <span className="macro-legend__val">{pPct}%</span>
              </div>
            </div>
            <div className="macro-legend">
              <div className="macro-legend__dot" style={{ background: 'var(--carbs)' }} />
              <div className="macro-legend__info">
                <span className="macro-legend__title">Carbs</span>
                <span className="macro-legend__val">{cPct}%</span>
              </div>
            </div>
            <div className="macro-legend">
              <div className="macro-legend__dot" style={{ background: 'var(--fat)' }} />
              <div className="macro-legend__info">
                <span className="macro-legend__title">Fett</span>
                <span className="macro-legend__val">{fPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Durchschnittswerte */}
      <div className="stats-grid mb-lg">
        <div className="stat-box card">
          <Flame size={20} className="text-calories mb-sm" />
          <span className="stat-box__val">{avg.calories}</span>
          <span className="stat-box__label">Ø kcal / Tag</span>
        </div>
        <div className="stat-box card">
          <Droplets size={20} className="text-water mb-sm" />
          <span className="stat-box__val">{avgWater}ml</span>
          <span className="stat-box__label">Ø Wasser / Tag</span>
        </div>
      </div>

      {/* 3. Wochenübersicht (Wiederverwendung vom Home Screen) */}
      <WeeklyStats />

    </motion.div>
  );
}
