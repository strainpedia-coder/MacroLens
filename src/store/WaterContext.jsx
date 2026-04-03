import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { getTodayString } from '../utils/calculations';

const WaterContext = createContext();

const STORAGE_KEY = 'macrolens_water';

const initialState = {
  dailyGoal: 2500, // ml
  entries: {} // { '2026-04-03': 1500, ... }
};

function waterReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_WATER': {
      const today = getTodayString();
      const current = state.entries[today] || 0;
      newState = {
        ...state,
        entries: { ...state.entries, [today]: current + action.amount }
      };
      break;
    }
    case 'REMOVE_WATER': {
      const today = getTodayString();
      const current = state.entries[today] || 0;
      newState = {
        ...state,
        entries: { ...state.entries, [today]: Math.max(0, current - action.amount) }
      };
      break;
    }
    case 'SET_GOAL':
      newState = { ...state, dailyGoal: action.value };
      break;
    case 'RESET_TODAY': {
      const today = getTodayString();
      newState = {
        ...state,
        entries: { ...state.entries, [today]: 0 }
      };
      break;
    }
    default:
      return state;
  }
  saveData(STORAGE_KEY, newState);
  return newState;
}

export function WaterProvider({ children }) {
  const saved = loadData(STORAGE_KEY, initialState);
  const [state, dispatch] = useReducer(waterReducer, saved);

  const today = getTodayString();
  const todayIntake = state.entries[today] || 0;
  const percentage = Math.min(100, Math.round((todayIntake / state.dailyGoal) * 100));

  return (
    <WaterContext.Provider value={{
      dailyGoal: state.dailyGoal,
      todayIntake,
      percentage,
      entries: state.entries,
      dispatch
    }}>
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const ctx = useContext(WaterContext);
  if (!ctx) throw new Error('useWater must be used within WaterProvider');
  return ctx;
}
