import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import { macrosToCalories, generateId } from '../utils/calculations';
import './Edit.css';

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { meals, dispatch } = useMeals();
  const [meal, setMeal] = useState(null);
  const [portion, setPortion] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id === 'new') {
      // Neues Ergebnis vom Scan
      const data = sessionStorage.getItem('scanResult');
      if (data) {
        setMeal(JSON.parse(data));
      } else {
        navigate('/scan', { replace: true });
      }
    } else {
      // Bestehende Mahlzeit bearbeiten
      const existing = meals.find(m => m.id === id);
      if (existing) {
        setMeal({ ...existing });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [id, meals, navigate]);

  if (!meal) return null;

  function updateIngredient(ingId, field, value) {
    setMeal(prev => {
      const updated = {
        ...prev,
        ingredients: prev.ingredients.map(ing => 
          ing.id === ingId ? { ...ing, [field]: value } : ing
        )
      };
      // Totals neu berechnen
      const totals = updated.ingredients.reduce((acc, ing) => ({
        calories: acc.calories + (Number(ing.calories) || 0),
        protein: acc.protein + (Number(ing.protein) || 0),
        carbs: acc.carbs + (Number(ing.carbs) || 0),
        fat: acc.fat + (Number(ing.fat) || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      return { ...updated, ...totals };
    });
  }

  function removeIngredient(ingId) {
    setMeal(prev => {
      const updated = {
        ...prev,
        ingredients: prev.ingredients.filter(ing => ing.id !== ingId)
      };
      const totals = updated.ingredients.reduce((acc, ing) => ({
        calories: acc.calories + (Number(ing.calories) || 0),
        protein: acc.protein + (Number(ing.protein) || 0),
        carbs: acc.carbs + (Number(ing.carbs) || 0),
        fat: acc.fat + (Number(ing.fat) || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      return { ...updated, ...totals };
    });
  }

  function addIngredient() {
    setMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        id: generateId(),
        name: 'Neue Zutat',
        amount: '100g',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }]
    }));
  }

  function handlePortionChange(newPortion) {
    const ratio = newPortion / portion;
    setPortion(newPortion);
    setMeal(prev => ({
      ...prev,
      calories: Math.round(prev.calories * ratio),
      protein: Math.round(prev.protein * ratio),
      carbs: Math.round(prev.carbs * ratio),
      fat: Math.round(prev.fat * ratio),
      ingredients: prev.ingredients.map(ing => ({
        ...ing,
        calories: Math.round(ing.calories * ratio),
        protein: Math.round(ing.protein * ratio),
        carbs: Math.round(ing.carbs * ratio),
        fat: Math.round(ing.fat * ratio)
      }))
    }));
  }

  function handleMacroChange(field, value) {
    const numValue = Number(value) || 0;
    setMeal(prev => {
      const updated = { ...prev, [field]: numValue };
      if (field !== 'calories') {
        updated.calories = macrosToCalories(
          field === 'protein' ? numValue : prev.protein,
          field === 'carbs' ? numValue : prev.carbs,
          field === 'fat' ? numValue : prev.fat
        );
      }
      return updated;
    });
  }

  function handleSave() {
    if (id === 'new') {
      dispatch({ type: 'ADD_MEAL', payload: meal });
      sessionStorage.removeItem('scanResult');
    } else {
      dispatch({ type: 'UPDATE_MEAL', payload: meal });
    }
    setSaved(true);
    setTimeout(() => navigate('/', { replace: true }), 800);
  }

  return (
    <div className="page edit-page">
      {saved && (
        <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          ✅ Gespeichert!
        </motion.div>
      )}

      {/* Header */}
      <div className="page-header">
        <button className="btn btn-ghost" style={{ padding: '6px 12px' }} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Zurück
        </button>
        <h1 className="page-title">Bearbeiten</h1>
        <div style={{ width: 80 }} />
      </div>

      {/* Mahlzeit-Name */}
      <motion.div className="card mb-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="input-group">
          <label className="input-label">Mahlzeit</label>
          <input
            type="text"
            className="input-field"
            value={meal.name}
            onChange={e => setMeal(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
      </motion.div>

      {/* Portions-Anpassung */}
      <motion.div className="card mb-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="section-title">Portionsgröße</h3>
        <div className="portion-control">
          <div className="portion-buttons">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(p => (
              <button
                key={p}
                className={`portion-btn ${portion === p ? 'portion-btn--active' : ''}`}
                onClick={() => handlePortionChange(p)}
              >
                {p}x
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Makros manuell bearbeiten */}
      <motion.div className="card mb-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="section-title">Makronährstoffe</h3>
        <div className="edit-macros-grid">
          <div className="edit-macro edit-macro--cal">
            <label>Kalorien</label>
            <div className="edit-macro__input-wrap">
              <input
                type="number"
                value={meal.calories}
                onChange={e => handleMacroChange('calories', e.target.value)}
                className="edit-macro__input"
              />
              <span className="edit-macro__unit">kcal</span>
            </div>
          </div>
          <div className="edit-macro edit-macro--protein">
            <label>Protein</label>
            <div className="edit-macro__input-wrap">
              <input
                type="number"
                value={meal.protein}
                onChange={e => handleMacroChange('protein', e.target.value)}
                className="edit-macro__input"
              />
              <span className="edit-macro__unit">g</span>
            </div>
          </div>
          <div className="edit-macro edit-macro--carbs">
            <label>Carbs</label>
            <div className="edit-macro__input-wrap">
              <input
                type="number"
                value={meal.carbs}
                onChange={e => handleMacroChange('carbs', e.target.value)}
                className="edit-macro__input"
              />
              <span className="edit-macro__unit">g</span>
            </div>
          </div>
          <div className="edit-macro edit-macro--fat">
            <label>Fett</label>
            <div className="edit-macro__input-wrap">
              <input
                type="number"
                value={meal.fat}
                onChange={e => handleMacroChange('fat', e.target.value)}
                className="edit-macro__input"
              />
              <span className="edit-macro__unit">g</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Zutaten */}
      <motion.div className="card mb-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-md">
          <h3 className="section-title" style={{ margin: 0 }}>Zutaten</h3>
          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 'var(--font-xs)' }} onClick={addIngredient}>
            <Plus size={14} /> Hinzufügen
          </button>
        </div>
        <div className="edit-ingredients">
          {meal.ingredients.map((ing) => (
            <div key={ing.id} className="edit-ingredient">
              <div className="edit-ingredient__main">
                <input
                  type="text"
                  value={ing.name}
                  onChange={e => updateIngredient(ing.id, 'name', e.target.value)}
                  className="edit-ingredient__name"
                  placeholder="Zutat"
                />
                <input
                  type="text"
                  value={ing.amount}
                  onChange={e => updateIngredient(ing.id, 'amount', e.target.value)}
                  className="edit-ingredient__amount"
                  placeholder="Menge"
                />
              </div>
              <div className="edit-ingredient__macros">
                <div className="edit-ingredient__macro">
                  <input type="number" value={ing.calories} onChange={e => updateIngredient(ing.id, 'calories', Number(e.target.value))} />
                  <span>kcal</span>
                </div>
                <div className="edit-ingredient__macro edit-ingredient__macro--p">
                  <input type="number" value={ing.protein} onChange={e => updateIngredient(ing.id, 'protein', Number(e.target.value))} />
                  <span>P</span>
                </div>
                <div className="edit-ingredient__macro edit-ingredient__macro--c">
                  <input type="number" value={ing.carbs} onChange={e => updateIngredient(ing.id, 'carbs', Number(e.target.value))} />
                  <span>K</span>
                </div>
                <div className="edit-ingredient__macro edit-ingredient__macro--f">
                  <input type="number" value={ing.fat} onChange={e => updateIngredient(ing.id, 'fat', Number(e.target.value))} />
                  <span>F</span>
                </div>
                <button className="edit-ingredient__delete" onClick={() => removeIngredient(ing.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <button className="btn btn-accent btn-lg btn-block" onClick={handleSave} disabled={saved}>
          <Save size={20} />
          {id === 'new' ? 'Mahlzeit speichern' : 'Änderungen speichern'}
        </button>
      </motion.div>
    </div>
  );
}
