// LocalStorage Persistenz-Helpers

const STORAGE_KEYS = {
  USER: 'macrolens_user',
  MEALS: 'macrolens_meals',
  ONBOARDING: 'macrolens_onboarding_done'
};

export function saveUser(userData) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (e) {
    console.error('Fehler beim Speichern der Benutzerdaten:', e);
  }
}

export function loadUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Fehler beim Laden der Benutzerdaten:', e);
    return null;
  }
}

export function saveMeals(meals) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (e) {
    console.error('Fehler beim Speichern der Mahlzeiten:', e);
  }
}

export function loadMeals() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Fehler beim Laden der Mahlzeiten:', e);
    return [];
  }
}

export function isOnboardingDone() {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
}

export function setOnboardingDone() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
}

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('macrolens_water');
}

/**
 * Generische Hilfsfunktionen für beliebige Storage-Keys
 */
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Fehler beim Speichern (${key}):`, e);
  }
}

export function loadData(key, fallback = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Fehler beim Laden (${key}):`, e);
    return fallback;
  }
}
