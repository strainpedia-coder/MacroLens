import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { saveMeals, loadMeals } from '../utils/storage';
import { getTodayString, sumMealMacros, generateId, getMealType } from '../utils/calculations';

const MealContext = createContext(null);

function mealReducer(state, action) {
  switch (action.type) {
    case 'ADD_MEAL': {
      const meal = {
        ...action.payload,
        id: action.payload.id || generateId(),
        date: action.payload.date || getTodayString(),
        timestamp: action.payload.timestamp || new Date().toISOString(),
        mealType: action.payload.mealType || getMealType(new Date()),
        isFavorite: false
      };
      return [...state, meal];
    }
    case 'UPDATE_MEAL':
      return state.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m);
    case 'DELETE_MEAL':
      return state.filter(m => m.id !== action.id);
    case 'TOGGLE_FAVORITE':
      return state.map(m => m.id === action.id ? { ...m, isFavorite: !m.isFavorite } : m);
    case 'SET_MEALS':
      return action.payload;
    default:
      return state;
  }
}

export function MealProvider({ children }) {
  const [meals, dispatch] = useReducer(mealReducer, [], () => loadMeals());

  useEffect(() => {
    saveMeals(meals);
  }, [meals]);

  const todayMeals = useMemo(() => {
    const today = getTodayString();
    return meals.filter(m => m.date === today);
  }, [meals]);

  const todayTotals = useMemo(() => sumMealMacros(todayMeals), [todayMeals]);

  const favorites = useMemo(() => meals.filter(m => m.isFavorite), [meals]);

  const getMealsByDate = (date) => meals.filter(m => m.date === date);

  const value = {
    meals,
    todayMeals,
    todayTotals,
    favorites,
    getMealsByDate,
    dispatch
  };

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealContext);
  if (!context) throw new Error('useMeals muss innerhalb von MealProvider verwendet werden');
  return context;
}

export default MealContext;
