import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveUser, loadUser } from '../utils/storage';
import { calculateBMR, calculateTDEE, calculateCalorieGoal, calculateMacroGoals } from '../utils/calculations';

const UserContext = createContext(null);

const DEFAULT_USER = {
  name: '',
  gender: 'male',
  age: 25,
  weight: 75,
  height: 175,
  activityLevel: 'moderate',
  goal: 'maintain',
  calorieGoal: 2200,
  macroGoals: { protein: 165, carbs: 220, fat: 73 }
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.payload };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'CALCULATE_GOALS': {
      const bmr = calculateBMR(state.weight, state.height, state.age, state.gender);
      const tdee = calculateTDEE(bmr, state.activityLevel);
      const calorieGoal = calculateCalorieGoal(tdee, state.goal);
      const macroGoals = calculateMacroGoals(calorieGoal, state.goal);
      return { ...state, calorieGoal, macroGoals, bmr, tdee };
    }
    case 'SET_CALORIE_GOAL':
      return { 
        ...state, 
        calorieGoal: action.value,
        macroGoals: calculateMacroGoals(action.value, state.goal)
      };
    case 'SET_MACRO_GOALS':
      return { ...state, macroGoals: { ...state.macroGoals, ...action.payload } };
    case 'RESET':
      return DEFAULT_USER;
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, DEFAULT_USER, (initial) => {
    const saved = loadUser();
    return saved ? { ...initial, ...saved } : initial;
  });

  useEffect(() => {
    saveUser(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser muss innerhalb von UserProvider verwendet werden');
  return context;
}

export default UserContext;
