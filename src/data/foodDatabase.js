// Deutsche Lebensmittel-Datenbank
// Werte pro 100g wenn nicht anders angegeben

const FOOD_DATABASE = [
  // === PROTEIN-QUELLEN ===
  { id: 'p01', name: 'Hähnchenbrust (roh)', category: 'Fleisch', calories: 110, protein: 23, carbs: 0, fat: 1.2, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p02', name: 'Hähnchenbrust (gebraten)', category: 'Fleisch', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p03', name: 'Rinderhackfleisch (mager)', category: 'Fleisch', calories: 152, protein: 20, carbs: 0, fat: 8, serving: '125g', servingMultiplier: 1.25 },
  { id: 'p04', name: 'Rinderfiletsteak', category: 'Fleisch', calories: 188, protein: 28, carbs: 0, fat: 8, serving: '200g', servingMultiplier: 2 },
  { id: 'p05', name: 'Schweinefilet', category: 'Fleisch', calories: 143, protein: 23, carbs: 0, fat: 5.4, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p06', name: 'Putenbrust', category: 'Fleisch', calories: 107, protein: 24, carbs: 0, fat: 1, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p07', name: 'Lachsfilet', category: 'Fisch', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p08', name: 'Thunfisch (Dose, in Wasser)', category: 'Fisch', calories: 116, protein: 26, carbs: 0, fat: 1, serving: '100g', servingMultiplier: 1 },
  { id: 'p09', name: 'Kabeljau', category: 'Fisch', calories: 82, protein: 18, carbs: 0, fat: 0.7, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p10', name: 'Garnelen', category: 'Fisch', calories: 99, protein: 24, carbs: 0, fat: 0.3, serving: '100g', servingMultiplier: 1 },
  { id: 'p11', name: 'Ei (Größe M)', category: 'Eier & Milch', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '60g (1 Ei)', servingMultiplier: 0.6 },
  { id: 'p12', name: 'Eiklar', category: 'Eier & Milch', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, serving: '33g (1 Eiweiß)', servingMultiplier: 0.33 },
  { id: 'p13', name: 'Magerquark', category: 'Eier & Milch', calories: 67, protein: 12, carbs: 4, fat: 0.3, serving: '250g', servingMultiplier: 2.5 },
  { id: 'p14', name: 'Griechischer Joghurt (10%)', category: 'Eier & Milch', calories: 133, protein: 5, carbs: 4, fat: 10, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p15', name: 'Skyr', category: 'Eier & Milch', calories: 63, protein: 11, carbs: 4, fat: 0.2, serving: '150g', servingMultiplier: 1.5 },
  { id: 'p16', name: 'Whey Protein Pulver', category: 'Supplements', calories: 400, protein: 80, carbs: 8, fat: 5, serving: '30g', servingMultiplier: 0.3 },
  { id: 'p17', name: 'Tofu (fest)', category: 'Pflanzlich', calories: 144, protein: 15, carbs: 2, fat: 8.7, serving: '125g', servingMultiplier: 1.25 },
  { id: 'p18', name: 'Tempeh', category: 'Pflanzlich', calories: 192, protein: 20, carbs: 8, fat: 11, serving: '100g', servingMultiplier: 1 },

  // === KOHLENHYDRATE ===
  { id: 'c01', name: 'Reis (gekocht)', category: 'Getreide', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '200g', servingMultiplier: 2 },
  { id: 'c02', name: 'Basmatireis (gekocht)', category: 'Getreide', calories: 121, protein: 3.5, carbs: 25, fat: 0.4, serving: '200g', servingMultiplier: 2 },
  { id: 'c03', name: 'Vollkornreis (gekocht)', category: 'Getreide', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: '200g', servingMultiplier: 2 },
  { id: 'c04', name: 'Nudeln / Pasta (gekocht)', category: 'Getreide', calories: 131, protein: 5, carbs: 25, fat: 1.1, serving: '200g', servingMultiplier: 2 },
  { id: 'c05', name: 'Vollkornnudeln (gekocht)', category: 'Getreide', calories: 124, protein: 5, carbs: 24, fat: 0.5, serving: '200g', servingMultiplier: 2 },
  { id: 'c06', name: 'Haferflocken', category: 'Getreide', calories: 379, protein: 13, carbs: 67, fat: 7, serving: '50g', servingMultiplier: 0.5 },
  { id: 'c07', name: 'Kartoffel (gekocht)', category: 'Getreide', calories: 86, protein: 2, carbs: 20, fat: 0.1, serving: '200g', servingMultiplier: 2 },
  { id: 'c08', name: 'Süßkartoffel (gekocht)', category: 'Getreide', calories: 90, protein: 1.6, carbs: 21, fat: 0.1, serving: '200g', servingMultiplier: 2 },
  { id: 'c09', name: 'Quinoa (gekocht)', category: 'Getreide', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, serving: '150g', servingMultiplier: 1.5 },
  { id: 'c10', name: 'Couscous (gekocht)', category: 'Getreide', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, serving: '150g', servingMultiplier: 1.5 },
  { id: 'c11', name: 'Vollkornbrot', category: 'Brot', calories: 247, protein: 8, carbs: 44, fat: 3.5, serving: '50g (1 Scheibe)', servingMultiplier: 0.5 },
  { id: 'c12', name: 'Toastbrot (Weizen)', category: 'Brot', calories: 265, protein: 8, carbs: 49, fat: 3.5, serving: '25g (1 Scheibe)', servingMultiplier: 0.25 },
  { id: 'c13', name: 'Dinkelbrötchen', category: 'Brot', calories: 261, protein: 9, carbs: 50, fat: 2.5, serving: '60g', servingMultiplier: 0.6 },
  { id: 'c14', name: 'Wraps / Tortilla', category: 'Brot', calories: 310, protein: 8, carbs: 52, fat: 8, serving: '65g (1 Stück)', servingMultiplier: 0.65 },

  // === OBST ===
  { id: 'f01', name: 'Banane', category: 'Obst', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '120g (1 Stück)', servingMultiplier: 1.2 },
  { id: 'f02', name: 'Apfel', category: 'Obst', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '180g (1 Stück)', servingMultiplier: 1.8 },
  { id: 'f03', name: 'Erdbeeren', category: 'Obst', calories: 33, protein: 0.7, carbs: 8, fat: 0.3, serving: '150g', servingMultiplier: 1.5 },
  { id: 'f04', name: 'Blaubeeren', category: 'Obst', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, serving: '125g', servingMultiplier: 1.25 },
  { id: 'f05', name: 'Orange', category: 'Obst', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, serving: '150g (1 Stück)', servingMultiplier: 1.5 },
  { id: 'f06', name: 'Weintrauben', category: 'Obst', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, serving: '125g', servingMultiplier: 1.25 },
  { id: 'f07', name: 'Mango', category: 'Obst', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, serving: '150g', servingMultiplier: 1.5 },
  { id: 'f08', name: 'Avocado', category: 'Obst', calories: 160, protein: 2, carbs: 8.5, fat: 15, serving: '75g (½ Stk)', servingMultiplier: 0.75 },

  // === GEMÜSE ===
  { id: 'v01', name: 'Brokkoli', category: 'Gemüse', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '150g', servingMultiplier: 1.5 },
  { id: 'v02', name: 'Spinat (frisch)', category: 'Gemüse', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g', servingMultiplier: 1 },
  { id: 'v03', name: 'Paprika (rot)', category: 'Gemüse', calories: 31, protein: 1, carbs: 6, fat: 0.3, serving: '150g (1 Stk)', servingMultiplier: 1.5 },
  { id: 'v04', name: 'Tomate', category: 'Gemüse', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '120g (1 Stk)', servingMultiplier: 1.2 },
  { id: 'v05', name: 'Gurke', category: 'Gemüse', calories: 12, protein: 0.6, carbs: 2.2, fat: 0.1, serving: '100g', servingMultiplier: 1 },
  { id: 'v06', name: 'Karotte', category: 'Gemüse', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, serving: '80g (1 Stk)', servingMultiplier: 0.8 },
  { id: 'v07', name: 'Zucchini', category: 'Gemüse', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, serving: '200g', servingMultiplier: 2 },
  { id: 'v08', name: 'Champignons', category: 'Gemüse', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, serving: '100g', servingMultiplier: 1 },
  { id: 'v09', name: 'Zwiebel', category: 'Gemüse', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, serving: '80g (1 Stk)', servingMultiplier: 0.8 },
  { id: 'v10', name: 'Blattsalat (gemischt)', category: 'Gemüse', calories: 15, protein: 1.3, carbs: 2.5, fat: 0.2, serving: '100g', servingMultiplier: 1 },

  // === MILCHPRODUKTE ===
  { id: 'd01', name: 'Vollmilch (3.5%)', category: 'Milchprodukte', calories: 64, protein: 3.3, carbs: 4.7, fat: 3.5, serving: '250ml', servingMultiplier: 2.5 },
  { id: 'd02', name: 'Fettarme Milch (1.5%)', category: 'Milchprodukte', calories: 47, protein: 3.4, carbs: 4.9, fat: 1.5, serving: '250ml', servingMultiplier: 2.5 },
  { id: 'd03', name: 'Hafermilch', category: 'Milchprodukte', calories: 42, protein: 0.5, carbs: 6.5, fat: 1.5, serving: '250ml', servingMultiplier: 2.5 },
  { id: 'd04', name: 'Gouda (jung)', category: 'Milchprodukte', calories: 356, protein: 25, carbs: 0, fat: 28, serving: '30g (1 Scheibe)', servingMultiplier: 0.3 },
  { id: 'd05', name: 'Mozzarella', category: 'Milchprodukte', calories: 280, protein: 18, carbs: 1, fat: 22, serving: '125g', servingMultiplier: 1.25 },
  { id: 'd06', name: 'Feta-Käse', category: 'Milchprodukte', calories: 264, protein: 14, carbs: 1.3, fat: 21, serving: '50g', servingMultiplier: 0.5 },
  { id: 'd07', name: 'Parmesan', category: 'Milchprodukte', calories: 431, protein: 38, carbs: 0, fat: 29, serving: '15g', servingMultiplier: 0.15 },
  { id: 'd08', name: 'Hüttenkäse', category: 'Milchprodukte', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '200g', servingMultiplier: 2 },

  // === FETTE & ÖLE ===
  { id: 'o01', name: 'Olivenöl', category: 'Öle & Fette', calories: 884, protein: 0, carbs: 0, fat: 100, serving: '10ml (1 EL)', servingMultiplier: 0.1 },
  { id: 'o02', name: 'Butter', category: 'Öle & Fette', calories: 741, protein: 0.7, carbs: 0.6, fat: 83, serving: '10g', servingMultiplier: 0.1 },
  { id: 'o03', name: 'Kokosöl', category: 'Öle & Fette', calories: 892, protein: 0, carbs: 0, fat: 99, serving: '10ml (1 EL)', servingMultiplier: 0.1 },
  { id: 'o04', name: 'Erdnussbutter', category: 'Öle & Fette', calories: 588, protein: 25, carbs: 20, fat: 50, serving: '15g (1 EL)', servingMultiplier: 0.15 },
  { id: 'o05', name: 'Mandelbutter', category: 'Öle & Fette', calories: 614, protein: 21, carbs: 19, fat: 56, serving: '15g (1 EL)', servingMultiplier: 0.15 },

  // === HÜLSENFRÜCHTE ===
  { id: 'l01', name: 'Kichererbsen (Dose)', category: 'Hülsenfrüchte', calories: 119, protein: 7, carbs: 20, fat: 2.1, serving: '150g', servingMultiplier: 1.5 },
  { id: 'l02', name: 'Kidneybohnen (Dose)', category: 'Hülsenfrüchte', calories: 84, protein: 6.9, carbs: 11, fat: 0.5, serving: '150g', servingMultiplier: 1.5 },
  { id: 'l03', name: 'Linsen (gekocht)', category: 'Hülsenfrüchte', calories: 116, protein: 9, carbs: 20, fat: 0.4, serving: '150g', servingMultiplier: 1.5 },
  { id: 'l04', name: 'Edamame', category: 'Hülsenfrüchte', calories: 121, protein: 12, carbs: 9, fat: 5, serving: '100g', servingMultiplier: 1 },

  // === NÜSSE & SAMEN ===
  { id: 'n01', name: 'Mandeln', category: 'Nüsse', calories: 576, protein: 21, carbs: 22, fat: 49, serving: '25g', servingMultiplier: 0.25 },
  { id: 'n02', name: 'Walnüsse', category: 'Nüsse', calories: 654, protein: 15, carbs: 14, fat: 65, serving: '25g', servingMultiplier: 0.25 },
  { id: 'n03', name: 'Cashews', category: 'Nüsse', calories: 553, protein: 18, carbs: 30, fat: 44, serving: '25g', servingMultiplier: 0.25 },
  { id: 'n04', name: 'Chiasamen', category: 'Nüsse', calories: 486, protein: 17, carbs: 42, fat: 31, serving: '15g (1 EL)', servingMultiplier: 0.15 },
  { id: 'n05', name: 'Leinsamen', category: 'Nüsse', calories: 534, protein: 18, carbs: 29, fat: 42, serving: '10g (1 EL)', servingMultiplier: 0.1 },

  // === SNACKS & SÜSSES ===
  { id: 's01', name: 'Proteinriegel (Durchschnitt)', category: 'Snacks', calories: 370, protein: 30, carbs: 35, fat: 12, serving: '60g (1 Riegel)', servingMultiplier: 0.6 },
  { id: 's02', name: 'Reiswaffeln', category: 'Snacks', calories: 387, protein: 7, carbs: 85, fat: 2.8, serving: '10g (1 Stück)', servingMultiplier: 0.1 },
  { id: 's03', name: 'Dunkle Schokolade (70%)', category: 'Snacks', calories: 530, protein: 7, carbs: 47, fat: 35, serving: '25g (3 Stücke)', servingMultiplier: 0.25 },
  { id: 's04', name: 'Honig', category: 'Snacks', calories: 304, protein: 0.3, carbs: 82, fat: 0, serving: '10g (1 TL)', servingMultiplier: 0.1 },
  { id: 's05', name: 'Müsliriegel', category: 'Snacks', calories: 450, protein: 6, carbs: 64, fat: 18, serving: '35g (1 Riegel)', servingMultiplier: 0.35 },

  // === GETRÄNKE ===
  { id: 'b01', name: 'Orangensaft', category: 'Getränke', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, serving: '250ml', servingMultiplier: 2.5 },
  { id: 'b02', name: 'Apfelschorle', category: 'Getränke', calories: 24, protein: 0, carbs: 6, fat: 0, serving: '330ml', servingMultiplier: 3.3 },
  { id: 'b03', name: 'Cola', category: 'Getränke', calories: 42, protein: 0, carbs: 11, fat: 0, serving: '330ml', servingMultiplier: 3.3 },
  { id: 'b04', name: 'Cappuccino (mit Milch)', category: 'Getränke', calories: 30, protein: 1.6, carbs: 2.5, fat: 1.5, serving: '200ml', servingMultiplier: 2 },
  { id: 'b05', name: 'Protein-Shake (Wasser)', category: 'Getränke', calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: '300ml', servingMultiplier: 3 },

  // === FERTIGGERICHTE / COMMON MEALS ===
  { id: 'm01', name: 'Döner Kebab', category: 'Fertiggerichte', calories: 215, protein: 11, carbs: 20, fat: 10, serving: '350g', servingMultiplier: 3.5 },
  { id: 'm02', name: 'Pizza Margherita (TK)', category: 'Fertiggerichte', calories: 235, protein: 10, carbs: 30, fat: 8, serving: '350g', servingMultiplier: 3.5 },
  { id: 'm03', name: 'Sushi (Lachs-Set)', category: 'Fertiggerichte', calories: 150, protein: 7, carbs: 24, fat: 3, serving: '300g', servingMultiplier: 3 },
  { id: 'm04', name: 'Burger (einfach)', category: 'Fertiggerichte', calories: 250, protein: 13, carbs: 24, fat: 12, serving: '220g', servingMultiplier: 2.2 },
  { id: 'm05', name: 'Caesar Salad', category: 'Fertiggerichte', calories: 127, protein: 6, carbs: 7, fat: 8, serving: '250g', servingMultiplier: 2.5 },
  { id: 'm06', name: 'Currywurst mit Pommes', category: 'Fertiggerichte', calories: 198, protein: 7, carbs: 18, fat: 11, serving: '400g', servingMultiplier: 4 },
  { id: 'm07', name: 'Schnitzel (paniert)', category: 'Fertiggerichte', calories: 223, protein: 18, carbs: 12, fat: 12, serving: '200g', servingMultiplier: 2 },

  // === SAUCEN & DRESSINGS ===
  { id: 'sc01', name: 'Ketchup', category: 'Saucen', calories: 110, protein: 1, carbs: 27, fat: 0, serving: '15g (1 EL)', servingMultiplier: 0.15 },
  { id: 'sc02', name: 'Mayonnaise', category: 'Saucen', calories: 680, protein: 1, carbs: 1, fat: 75, serving: '15g (1 EL)', servingMultiplier: 0.15 },
  { id: 'sc03', name: 'Sojasauce', category: 'Saucen', calories: 53, protein: 5, carbs: 6, fat: 0, serving: '15ml (1 EL)', servingMultiplier: 0.15 },
  { id: 'sc04', name: 'Tomatensauce', category: 'Saucen', calories: 50, protein: 1.5, carbs: 8, fat: 1.5, serving: '100ml', servingMultiplier: 1 },
  { id: 'sc05', name: 'Hummus', category: 'Saucen', calories: 166, protein: 8, carbs: 14, fat: 10, serving: '30g (1 EL)', servingMultiplier: 0.3 },
];

// Alle einzigartigen Kategorien
export const CATEGORIES = [...new Set(FOOD_DATABASE.map(f => f.category))];

/**
 * Durchsucht die Datenbank nach Name oder Kategorie
 */
export function searchFoods(query, category = null) {
  if (!query && !category) return FOOD_DATABASE.slice(0, 20);
  
  let results = FOOD_DATABASE;
  
  if (category) {
    results = results.filter(f => f.category === category);
  }
  
  if (query && query.length >= 1) {
    const lower = query.toLowerCase();
    results = results.filter(f =>
      f.name.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower)
    );
  }
  
  return results.slice(0, 30);
}

/**
 * Holt ein Lebensmittel nach ID
 */
export function getFoodById(id) {
  return FOOD_DATABASE.find(f => f.id === id);
}

/**
 * Berechnet tatsächliche Nährwerte basierend auf Portionsgröße
 */
export function calculateServingNutrition(food, multiplier = null) {
  const m = multiplier ?? food.servingMultiplier;
  return {
    calories: Math.round(food.calories * m),
    protein: Math.round(food.protein * m * 10) / 10,
    carbs: Math.round(food.carbs * m * 10) / 10,
    fat: Math.round(food.fat * m * 10) / 10
  };
}

export default FOOD_DATABASE;
