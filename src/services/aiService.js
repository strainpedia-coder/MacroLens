// Simulierter AI-Service für Mahlzeit-Erkennung
// In Produktion: Durch echte API (OpenAI Vision, etc.) ersetzen

import { generateId } from '../utils/calculations';

/**
 * Datenbank mit erkennbaren Mahlzeiten
 */
const MEAL_DATABASE = [
  {
    name: 'Hähnchenbrustfilet mit Reis und Brokkoli',
    confidence: 0.92,
    calories: 485,
    protein: 42,
    carbs: 52,
    fat: 10,
    ingredients: [
      { name: 'Hähnchenbrust', amount: '200g', calories: 220, protein: 40, carbs: 0, fat: 4 },
      { name: 'Basmatireis', amount: '150g (gekocht)', calories: 195, protein: 4, carbs: 45, fat: 0.5 },
      { name: 'Brokkoli', amount: '120g', calories: 40, protein: 3.5, carbs: 4, fat: 0.5 },
      { name: 'Olivenöl', amount: '1 TL', calories: 40, protein: 0, carbs: 0, fat: 4.5 }
    ]
  },
  {
    name: 'Avocado Toast mit Ei',
    confidence: 0.88,
    calories: 380,
    protein: 16,
    carbs: 30,
    fat: 24,
    ingredients: [
      { name: 'Vollkorntoast', amount: '2 Scheiben', calories: 140, protein: 6, carbs: 26, fat: 2 },
      { name: 'Avocado', amount: '½ Stück', calories: 120, protein: 1.5, carbs: 2, fat: 11 },
      { name: 'Spiegelei', amount: '1 Stück', calories: 90, protein: 6.5, carbs: 0.5, fat: 7 },
      { name: 'Chiliflocken', amount: '1 Prise', calories: 3, protein: 0, carbs: 0.5, fat: 0 }
    ]
  },
  {
    name: 'Griechischer Salat',
    confidence: 0.85,
    calories: 320,
    protein: 12,
    carbs: 14,
    fat: 25,
    ingredients: [
      { name: 'Tomaten', amount: '150g', calories: 27, protein: 1.3, carbs: 5, fat: 0.3 },
      { name: 'Gurke', amount: '100g', calories: 12, protein: 0.6, carbs: 2.5, fat: 0.1 },
      { name: 'Feta-Käse', amount: '80g', calories: 210, protein: 11, carbs: 1, fat: 17 },
      { name: 'Oliven', amount: '30g', calories: 45, protein: 0.4, carbs: 1.5, fat: 4 },
      { name: 'Olivenöl', amount: '1 EL', calories: 120, protein: 0, carbs: 0, fat: 13.5 }
    ]
  },
  {
    name: 'Protein-Smoothie Bowl',
    confidence: 0.90,
    calories: 420,
    protein: 32,
    carbs: 48,
    fat: 12,
    ingredients: [
      { name: 'Whey Protein', amount: '30g', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
      { name: 'Banane', amount: '1 Stück', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: 'Blaubeeren', amount: '80g', calories: 46, protein: 0.6, carbs: 11, fat: 0.3 },
      { name: 'Haferflocken', amount: '30g', calories: 114, protein: 4, carbs: 20, fat: 2.2 },
      { name: 'Mandeln', amount: '15g', calories: 86, protein: 3, carbs: 1, fat: 7.5 }
    ]
  },
  {
    name: 'Pasta Bolognese',
    confidence: 0.87,
    calories: 620,
    protein: 30,
    carbs: 72,
    fat: 22,
    ingredients: [
      { name: 'Spaghetti', amount: '200g (gekocht)', calories: 280, protein: 10, carbs: 56, fat: 1.5 },
      { name: 'Rinderhackfleisch', amount: '120g', calories: 240, protein: 24, carbs: 0, fat: 16 },
      { name: 'Tomatensauce', amount: '100ml', calories: 50, protein: 1.5, carbs: 8, fat: 1.5 },
      { name: 'Parmesan', amount: '15g', calories: 60, protein: 4, carbs: 0, fat: 4 }
    ]
  },
  {
    name: 'Lachs mit Süßkartoffel',
    confidence: 0.91,
    calories: 520,
    protein: 38,
    carbs: 40,
    fat: 22,
    ingredients: [
      { name: 'Lachsfilet', amount: '180g', calories: 330, protein: 36, carbs: 0, fat: 20 },
      { name: 'Süßkartoffel', amount: '200g', calories: 170, protein: 2, carbs: 40, fat: 0.2 },
      { name: 'Zitronensaft', amount: '1 EL', calories: 4, protein: 0, carbs: 1, fat: 0 }
    ]
  },
  {
    name: 'Overnight Oats mit Beeren',
    confidence: 0.93,
    calories: 380,
    protein: 15,
    carbs: 55,
    fat: 12,
    ingredients: [
      { name: 'Haferflocken', amount: '60g', calories: 228, protein: 8, carbs: 40, fat: 4.5 },
      { name: 'Milch', amount: '150ml', calories: 72, protein: 5, carbs: 7, fat: 2.5 },
      { name: 'Honig', amount: '1 TL', calories: 21, protein: 0, carbs: 6, fat: 0 },
      { name: 'Erdbeeren', amount: '80g', calories: 26, protein: 0.7, carbs: 6, fat: 0.3 },
      { name: 'Chiasamen', amount: '10g', calories: 49, protein: 1.6, carbs: 0.7, fat: 3.1 }
    ]
  },
  {
    name: 'Burrito Bowl',
    confidence: 0.84,
    calories: 560,
    protein: 28,
    carbs: 65,
    fat: 20,
    ingredients: [
      { name: 'Reis', amount: '150g (gekocht)', calories: 195, protein: 4, carbs: 45, fat: 0.5 },
      { name: 'Schwarze Bohnen', amount: '80g', calories: 105, protein: 8, carbs: 19, fat: 0.5 },
      { name: 'Hähnchen', amount: '100g', calories: 110, protein: 20, carbs: 0, fat: 2 },
      { name: 'Guacamole', amount: '50g', calories: 80, protein: 1, carbs: 3, fat: 7 },
      { name: 'Sauerrahm', amount: '30g', calories: 56, protein: 0.7, carbs: 1, fat: 5.5 },
      { name: 'Salsa', amount: '40g', calories: 14, protein: 0.3, carbs: 3, fat: 0.1 }
    ]
  },
  {
    name: 'Rührei mit Vollkornbrot',
    confidence: 0.94,
    calories: 350,
    protein: 22,
    carbs: 25,
    fat: 18,
    ingredients: [
      { name: 'Eier', amount: '3 Stück', calories: 210, protein: 18, carbs: 1, fat: 15 },
      { name: 'Vollkornbrot', amount: '1 Scheibe', calories: 70, protein: 3, carbs: 12, fat: 1 },
      { name: 'Butter', amount: '5g', calories: 37, protein: 0, carbs: 0, fat: 4 },
      { name: 'Schnittlauch', amount: '5g', calories: 2, protein: 0.2, carbs: 0.3, fat: 0 }
    ]
  },
  {
    name: 'Quinoa-Salat mit Kichererbsen',
    confidence: 0.86,
    calories: 440,
    protein: 18,
    carbs: 55,
    fat: 16,
    ingredients: [
      { name: 'Quinoa', amount: '120g (gekocht)', calories: 140, protein: 5, carbs: 25, fat: 2 },
      { name: 'Kichererbsen', amount: '100g', calories: 160, protein: 9, carbs: 27, fat: 2.5 },
      { name: 'Paprika', amount: '80g', calories: 25, protein: 0.8, carbs: 5, fat: 0.2 },
      { name: 'Olivenöl', amount: '1 EL', calories: 120, protein: 0, carbs: 0, fat: 13.5 }
    ]
  }
];

/**
 * Konvertiert eine Datei für die OpenAI API in Base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Analysiert ein Mahlzeiten-Foto. Nutzt die OpenAI Vision API,
 * falls ein Key hinterlegt ist, sonst den Mock-Fallback.
 */
export async function analyzeMealPhoto(imageFile) {
  const apiKey = localStorage.getItem('openai_api_key');
  let imageUrl = null;
  if (imageFile) {
    imageUrl = URL.createObjectURL(imageFile);
  }

  // ==== ECHTE KI (OPENAI VISION) ====
  if (apiKey && imageFile && imageFile.type && imageFile.type.startsWith('image/')) {
    try {
      const base64Image = await fileToBase64(imageFile);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Du bist ein professioneller Ernährungsberater, der Essen anhand von Bildern extrem präzise schätzt.
Antworte AUSSCHLIESSLICH in diesem exakten JSON Format:
{
  "name": "Kurzer, passender Name des Gerichts (deutsch)",
  "confidence": 0.95,
  "calories": 450,
  "protein": 30,
  "carbs": 40,
  "fat": 15,
  "ingredients": [
    { "name": "Zutat 1", "amount": "100g", "calories": 100, "protein": 5, "carbs": 10, "fat": 2 }
  ]
}
Die Summe der Kalorien & Makros der Zutaten muss exakt zu den Gesamtwerten passen.`
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analysiere die Mahlzeit auf diesem Bild." },
                { type: "image_url", image_url: { url: base64Image, detail: "low" } }
              ]
            }
          ],
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);

      // IDs hinzufügen
      const processedIngredients = (parsed.ingredients || []).map(ing => ({
        ...ing,
        id: generateId()
      }));

      return {
        id: generateId(),
        ...parsed,
        ingredients: processedIngredients,
        imageUrl,
        timestamp: new Date().toISOString(),
        isAiGenerated: true
      };

    } catch (err) {
      console.error('OpenAI Fehler, nutze Fallback:', err);
      // Wenn OpenAI fehlschlägt, machen wir im Fallback weiter
    }
  }

  // ==== FALLBACK (MOCK DATEN) ====
  
  // Simulierte Verarbeitungszeit (1.5-3 Sekunden)
  const delay = 1500 + Math.random() * 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Zufällige Mahlzeit aus der Datenbank wählen
  const randomIndex = Math.floor(Math.random() * MEAL_DATABASE.length);
  const meal = { ...MEAL_DATABASE[randomIndex] };
  
  // Leichte Variation der Konfidenz (±5%)
  meal.confidence = Math.min(0.98, Math.max(0.70, meal.confidence + (Math.random() - 0.5) * 0.1));
  meal.confidence = Math.round(meal.confidence * 100) / 100;
  
  // Leichte Variation der Werte (±10%) für mehr Realismus
  const vary = (val) => Math.round(val * (0.90 + Math.random() * 0.20));
  meal.calories = vary(meal.calories);
  meal.protein = vary(meal.protein);
  meal.carbs = vary(meal.carbs);
  meal.fat = vary(meal.fat);
  
  meal.ingredients = meal.ingredients.map(ing => ({
    ...ing,
    id: generateId(),
    calories: vary(ing.calories),
    protein: vary(ing.protein || 0),
    carbs: vary(ing.carbs || 0),
    fat: vary(ing.fat || 0)
  }));

  return {
    id: generateId(),
    ...meal,
    imageUrl,
    timestamp: new Date().toISOString(),
    isAiGenerated: true
  };
}

/**
 * Gibt eine Liste von Vorschlägen für die Suche zurück
 */
export function searchMeals(query) {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return MEAL_DATABASE.filter(m => 
    m.name.toLowerCase().includes(lower) ||
    m.ingredients.some(i => i.name.toLowerCase().includes(lower))
  ).slice(0, 5);
}
