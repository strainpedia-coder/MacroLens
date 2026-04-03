import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Filter } from 'lucide-react';
import { searchFoods, CATEGORIES, calculateServingNutrition } from '../data/foodDatabase';
import { useMeals } from '../store/MealContext';
import { generateId, getTodayString, getMealType } from '../utils/calculations';
import './FoodSearch.css';

export default function FoodSearch({ onClose }) {
  const navigate = useNavigate();
  const { dispatch } = useMeals();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchFoods(query, category), [query, category]);

  function selectFood(food) {
    setSelectedFood(food);
    setServingMultiplier(food.servingMultiplier);
  }

  function handleAdd() {
    if (!selectedFood) return;
    const nutrition = calculateServingNutrition(selectedFood, servingMultiplier);
    const meal = {
      id: generateId(),
      name: selectedFood.name,
      ...nutrition,
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      mealType: getMealType(new Date()),
      isAiGenerated: false,
      ingredients: [{
        id: generateId(),
        name: selectedFood.name,
        amount: selectedFood.serving,
        ...nutrition
      }]
    };
    dispatch({ type: 'ADD_MEAL', payload: meal });
    navigate('/', { replace: true });
  }

  const nutrition = selectedFood ? calculateServingNutrition(selectedFood, servingMultiplier) : null;

  return (
    <div className="food-search">
      {/* Header */}
      <div className="food-search__header">
        <div className="food-search__input-wrap">
          <Search size={18} className="food-search__icon" />
          <input
            ref={inputRef}
            type="text"
            className="food-search__input"
            placeholder="Lebensmittel suchen..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedFood(null); }}
          />
          {query && (
            <button className="food-search__clear" onClick={() => { setQuery(''); setSelectedFood(null); }}>
              <X size={16} />
            </button>
          )}
        </div>
        <button className="food-search__close" onClick={onClose}>
          Abbrechen
        </button>
      </div>

      {/* Kategorie-Filter */}
      <div className="food-search__categories">
        <button
          className={`category-chip ${!category ? 'category-chip--active' : ''}`}
          onClick={() => setCategory(null)}
        >
          Alle
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-chip ${category === cat ? 'category-chip--active' : ''}`}
            onClick={() => setCategory(category === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected Food Detail */}
      {selectedFood ? (
        <div className="food-detail">
          <div className="food-detail__header">
            <h3>{selectedFood.name}</h3>
            <span className="food-detail__category">{selectedFood.category}</span>
          </div>

          {/* Portion */}
          <div className="food-detail__portion">
            <label className="input-label">Portion</label>
            <div className="food-detail__portion-row">
              <button className="portion-adj" onClick={() => setServingMultiplier(m => Math.max(0.1, +(m - 0.25).toFixed(2)))}>−</button>
              <div className="food-detail__portion-display">
                <span className="food-detail__portion-value">{Math.round(servingMultiplier * 100)}g</span>
                <span className="food-detail__portion-original">Standard: {selectedFood.serving}</span>
              </div>
              <button className="portion-adj" onClick={() => setServingMultiplier(m => +(m + 0.25).toFixed(2))}>+</button>
            </div>
            <div className="portion-presets">
              {[0.5, 1, 1.5, 2].map(m => (
                <button
                  key={m}
                  className={`portion-preset ${Math.abs(servingMultiplier - m * selectedFood.servingMultiplier) < 0.01 ? 'portion-preset--active' : ''}`}
                  onClick={() => setServingMultiplier(m * selectedFood.servingMultiplier)}
                >
                  {m === 1 ? '1 Portion' : `${m}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Nährwerte */}
          <div className="food-detail__macros">
            <div className="food-detail__macro food-detail__macro--cal">
              <span className="food-detail__macro-value">{nutrition.calories}</span>
              <span className="food-detail__macro-label">kcal</span>
            </div>
            <div className="food-detail__macro food-detail__macro--p">
              <span className="food-detail__macro-value">{nutrition.protein}</span>
              <span className="food-detail__macro-label">Protein</span>
            </div>
            <div className="food-detail__macro food-detail__macro--c">
              <span className="food-detail__macro-value">{nutrition.carbs}</span>
              <span className="food-detail__macro-label">Carbs</span>
            </div>
            <div className="food-detail__macro food-detail__macro--f">
              <span className="food-detail__macro-value">{nutrition.fat}</span>
              <span className="food-detail__macro-label">Fett</span>
            </div>
          </div>

          <button className="btn btn-accent btn-lg btn-block" onClick={handleAdd}>
            Hinzufügen
          </button>
          <button className="btn btn-ghost btn-block mt-md" onClick={() => setSelectedFood(null)}>
            Zurück zur Suche
          </button>
        </div>
      ) : (
        /* Ergebnis-Liste */
        <div className="food-search__results">
          {results.length === 0 ? (
            <div className="food-search__empty">
              <p>Kein Lebensmittel gefunden</p>
              <p className="text-secondary" style={{ fontSize: 'var(--font-xs)' }}>Versuche einen anderen Suchbegriff</p>
            </div>
          ) : (
            results.map(food => {
              const n = calculateServingNutrition(food);
              return (
                <button key={food.id} className="food-result" onClick={() => selectFood(food)}>
                  <div className="food-result__info">
                    <span className="food-result__name">{food.name}</span>
                    <span className="food-result__serving">{food.serving} · {food.category}</span>
                  </div>
                  <div className="food-result__macros">
                    <span className="food-result__cal">{n.calories} kcal</span>
                    <div className="food-result__macro-pills">
                      <span className="mpill mpill--p">P{n.protein}</span>
                      <span className="mpill mpill--c">K{n.carbs}</span>
                      <span className="mpill mpill--f">F{n.fat}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="food-result__arrow" />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
