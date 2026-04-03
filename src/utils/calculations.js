// Kalorien- und Makro-Berechnungen

/**
 * Berechnet den Grundumsatz (BMR) nach Mifflin-St Jeor
 */
export function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Aktivitätsfaktoren
 */
const ACTIVITY_FACTORS = {
  sedentary: 1.2,      // Wenig aktiv
  light: 1.375,        // Leicht aktiv
  moderate: 1.55,      // Mäßig aktiv
  active: 1.725,       // Sehr aktiv
  veryActive: 1.9      // Extrem aktiv
};

/**
 * Berechnet den Gesamtenergiebedarf (TDEE)
 */
export function calculateTDEE(bmr, activityLevel) {
  return Math.round(bmr * (ACTIVITY_FACTORS[activityLevel] || 1.55));
}

/**
 * Berechnet Kalorienziel basierend auf dem Ziel
 */
export function calculateCalorieGoal(tdee, goal) {
  switch (goal) {
    case 'lose': return Math.round(tdee - 500);
    case 'gain': return Math.round(tdee + 300);
    case 'maintain': 
    default: return tdee;
  }
}

/**
 * Berechnet Makro-Ziele (in Gramm) basierend auf Kalorienziel
 */
export function calculateMacroGoals(calories, goal) {
  let proteinPct, carbsPct, fatPct;
  
  switch (goal) {
    case 'lose':
      proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30;
      break;
    case 'gain':
      proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;
      break;
    case 'maintain':
    default:
      proteinPct = 0.30; carbsPct = 0.40; fatPct = 0.30;
  }
  
  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9)
  };
}

/**
 * Berechnet Gesamtkalorien aus Makros
 */
export function macrosToCalories(protein, carbs, fat) {
  return Math.round(protein * 4 + carbs * 4 + fat * 9);
}

/**
 * Summiert Makros über mehrere Mahlzeiten
 */
export function sumMealMacros(meals) {
  return meals.reduce((totals, meal) => ({
    calories: totals.calories + (meal.calories || 0),
    protein: totals.protein + (meal.protein || 0),
    carbs: totals.carbs + (meal.carbs || 0),
    fat: totals.fat + (meal.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

/**
 * Berechnet Prozentsatz (geclampd auf 0-100)
 */
export function calcPercentage(current, goal) {
  if (!goal) return 0;
  return Math.min(100, Math.max(0, Math.round((current / goal) * 100)));
}

/**
 * Formatiert Zahlen mit einer Dezimalstelle
 */
export function formatNumber(num, decimals = 0) {
  return Number(num).toFixed(decimals);
}

/**
 * Gibt das heutige Datum als String zurück
 */
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formatiert ein Datum in deutsches Format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Formatiert Uhrzeit
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Gibt Mahlzeit-Typ basierend auf Uhrzeit zurück
 */
export function getMealType(date) {
  const hour = new Date(date).getHours();
  if (hour < 10) return 'Frühstück';
  if (hour < 14) return 'Mittagessen';
  if (hour < 17) return 'Snack';
  return 'Abendessen';
}

/**
 * Generiert eine eindeutige ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
