import { Heart, Trash2 } from 'lucide-react';
import { formatTime } from '../utils/calculations';
import './MealCard.css';

/**
 * Karte für eine gespeicherte Mahlzeit
 */
export default function MealCard({ meal, onToggleFavorite, onDelete, onClick }) {
  return (
    <div className="meal-card card-sm" onClick={onClick} id={`meal-${meal.id}`}>
      <div className="meal-card__main">
        {meal.imageUrl && (
          <div className="meal-card__image">
            <img src={meal.imageUrl} alt={meal.name} />
          </div>
        )}
        <div className="meal-card__info">
          <div className="meal-card__header">
            <h3 className="meal-card__name">{meal.name}</h3>
            <span className="meal-card__time">{formatTime(meal.timestamp)}</span>
          </div>
          <div className="meal-card__type">{meal.mealType}</div>
          <div className="meal-card__macros">
            <span className="meal-card__cal">
              <span className="meal-card__cal-value">{meal.calories}</span> kcal
            </span>
            <div className="meal-card__macro-pills">
              <span className="macro-pill macro-pill--protein">P {meal.protein}g</span>
              <span className="macro-pill macro-pill--carbs">K {meal.carbs}g</span>
              <span className="macro-pill macro-pill--fat">F {meal.fat}g</span>
            </div>
          </div>
        </div>
      </div>
      <div className="meal-card__actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className={`meal-card__action ${meal.isFavorite ? 'meal-card__action--fav' : ''}`}
          onClick={() => onToggleFavorite?.(meal.id)}
          aria-label="Favorit"
        >
          <Heart size={16} fill={meal.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button 
          className="meal-card__action meal-card__action--delete"
          onClick={() => onDelete?.(meal.id)}
          aria-label="Löschen"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
