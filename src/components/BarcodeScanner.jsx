import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, ScanBarcode, Loader } from 'lucide-react';
import { useMeals } from '../store/MealContext';
import { generateId, getTodayString, getMealType } from '../utils/calculations';
import './BarcodeScanner.css';

// Einfache EAN-zu-Produkt Lookup (Demo – in Produktion durch API ersetzen wie OpenFoodFacts)
const BARCODE_DB = {
  '4017100024405': { name: 'Haribo Goldbären', calories: 343, protein: 7, carbs: 77, fat: 0.5, serving: '100g' },
  '4000521005009': { name: 'Milka Alpenmilch', calories: 530, protein: 6, carbs: 59, fat: 30, serving: '100g' },
  '7622210449283': { name: 'Oreo Original', calories: 480, protein: 4, carbs: 69, fat: 20, serving: '44g (6 Stk)' },
  '5000112628548': { name: 'Coca-Cola 330ml', calories: 42, protein: 0, carbs: 11, fat: 0, serving: '330ml' },
  '4001686301531': { name: 'Ritter Sport Nuss', calories: 567, protein: 9, carbs: 48, fat: 38, serving: '100g' },
};

export default function BarcodeScanner({ onClose }) {
  const navigate = useNavigate();
  const { dispatch } = useMeals();
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  async function startScanner() {
    try {
      const html5Qr = new Html5Qrcode('barcode-reader');
      html5QrRef.current = html5Qr;
      setScanning(true);

      await html5Qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleScanResult(decodedText);
          stopScanner();
        },
        () => {} // Ignore errors during scanning
      );
    } catch (err) {
      setError('Kamera konnte nicht gestartet werden. Bitte Zugriff erlauben.');
      setScanning(false);
    }
  }

  function stopScanner() {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setScanning(false);
  }

  function handleScanResult(barcode) {
    const product = BARCODE_DB[barcode];
    if (product) {
      setResult({ barcode, ...product });
    } else {
      // Nicht gefunden – an OpenFoodFacts weiterleiten (Demo)
      setResult({
        barcode,
        name: `Produkt (${barcode})`,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving: 'Unbekannt',
        notFound: true
      });
    }
  }

  function handleAddProduct() {
    if (!result) return;
    const meal = {
      id: generateId(),
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      mealType: getMealType(new Date()),
      isAiGenerated: false,
      barcode: result.barcode,
      ingredients: [{
        id: generateId(),
        name: result.name,
        amount: result.serving,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat
      }]
    };
    dispatch({ type: 'ADD_MEAL', payload: meal });
    navigate('/', { replace: true });
  }

  function handleRetry() {
    setResult(null);
    setError(null);
    startScanner();
  }

  return (
    <div className="barcode-scanner">
      {/* Header */}
      <div className="barcode-scanner__header">
        <ScanBarcode size={20} />
        <h2>Barcode-Scanner</h2>
        <button className="barcode-scanner__close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Scanner View */}
      {!result && !error && (
        <div className="barcode-scanner__view">
          <div id="barcode-reader" ref={scannerRef} className="barcode-scanner__reader" />
          {scanning && (
            <div className="barcode-scanner__hint">
              <p>Halte den Barcode vor die Kamera</p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="barcode-scanner__error">
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={handleRetry}>Erneut versuchen</button>
          <button className="btn btn-ghost" onClick={onClose}>Schließen</button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="barcode-scanner__result">
          <div className="barcode-result-card card">
            <span className="barcode-result__barcode">{result.barcode}</span>
            <h3 className="barcode-result__name">{result.name}</h3>
            {result.notFound ? (
              <p className="barcode-result__notfound">Produkt nicht in der Datenbank gefunden. Du kannst es manuell eingeben.</p>
            ) : (
              <>
                <p className="barcode-result__serving">{result.serving}</p>
                <div className="barcode-result__macros">
                  <div className="barcode-macro barcode-macro--cal">
                    <span className="barcode-macro__val">{result.calories}</span>
                    <span className="barcode-macro__label">kcal</span>
                  </div>
                  <div className="barcode-macro barcode-macro--p">
                    <span className="barcode-macro__val">{result.protein}g</span>
                    <span className="barcode-macro__label">Protein</span>
                  </div>
                  <div className="barcode-macro barcode-macro--c">
                    <span className="barcode-macro__val">{result.carbs}g</span>
                    <span className="barcode-macro__label">Carbs</span>
                  </div>
                  <div className="barcode-macro barcode-macro--f">
                    <span className="barcode-macro__val">{result.fat}g</span>
                    <span className="barcode-macro__label">Fett</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="barcode-result__actions">
            {!result.notFound && (
              <button className="btn btn-accent btn-lg btn-block" onClick={handleAddProduct}>
                Hinzufügen
              </button>
            )}
            <button className="btn btn-ghost btn-block" onClick={handleRetry}>
              Erneut scannen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
