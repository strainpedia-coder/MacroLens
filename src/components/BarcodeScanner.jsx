import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, ScanBarcode, Loader, FileText } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useMeals } from '../store/MealContext';
import { generateId, getTodayString, getMealType } from '../utils/calculations';
import './BarcodeScanner.css';

export default function BarcodeScanner({ onClose }) {
  const navigate = useNavigate();
  const { dispatch } = useMeals();
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(100);

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

  async function handleScanResult(barcode) {
    stopScanner();
    setLoading(true);
    setError(null);
    
    // Haptic Feedback for success scan
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch(e) {} // Ignore on pure web
    
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await response.json();

      if (json.status === 1 && json.product) {
        const p = json.product;
        const nutris = p.nutriments || {};
        
        setResult({
          barcode,
          name: p.product_name_de || p.product_name || `Produkt (${barcode})`,
          baseCalories: Math.round(nutris['energy-kcal_100g'] || 0),
          baseProtein: Math.round(nutris.proteins_100g || 0),
          baseCarbs: Math.round(nutris.carbohydrates_100g || 0),
          baseFat: Math.round(nutris.fat_100g || 0),
        });
        setAmount(100);
      } else {
        setResult({
          barcode,
          name: `Unbekannt (${barcode})`,
          baseCalories: 0, baseProtein: 0, baseCarbs: 0, baseFat: 0,
          notFound: true
        });
      }
    } catch (err) {
      setError('Fehler beim Abrufen der Produktdaten aus OpenFoodFacts.');
    } finally {
      setLoading(false);
    }
  }

  // Scaled macros helper
  const scaledCalories = result ? Math.round(result.baseCalories * (amount / 100)) : 0;
  const scaledProtein = result ? Math.round(result.baseProtein * (amount / 100)) : 0;
  const scaledCarbs = result ? Math.round(result.baseCarbs * (amount / 100)) : 0;
  const scaledFat = result ? Math.round(result.baseFat * (amount / 100)) : 0;

  function handleAddProduct() {
    if (!result || result.notFound) return;
    const meal = {
      id: generateId(),
      name: result.name,
      calories: scaledCalories,
      protein: scaledProtein,
      carbs: scaledCarbs,
      fat: scaledFat,
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      mealType: getMealType(new Date()),
      isAiGenerated: false,
      barcode: result.barcode,
      ingredients: [{
        id: generateId(),
        name: result.name,
        amount: `${amount}g`,
        calories: scaledCalories,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat
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

      {/* Loading */}
      {loading && (
        <div className="barcode-scanner__error">
          <Loader size={36} className="spin text-accent" />
          <p>Produktdaten werden verarbeitet...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
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
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <label htmlFor="amount" className="input-label" style={{ textAlign: 'left' }}>Menge in Gramm (g)</label>
                  <input 
                    type="number" 
                    id="amount"
                    className="input-field" 
                    style={{ textAlign: 'center', fontSize: 'var(--font-xl)', fontWeight: 'bold' }}
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value) || 0)} 
                    min="1"
                  />
                  <p className="barcode-result__serving">Basierend auf 100g Tabelle</p>
                </div>

                <div className="barcode-result__macros">
                  <div className="barcode-macro barcode-macro--cal">
                    <span className="barcode-macro__val">{scaledCalories}</span>
                    <span className="barcode-macro__label">kcal</span>
                  </div>
                  <div className="barcode-macro barcode-macro--p">
                    <span className="barcode-macro__val">{scaledProtein}g</span>
                    <span className="barcode-macro__label">Protein</span>
                  </div>
                  <div className="barcode-macro barcode-macro--c">
                    <span className="barcode-macro__val">{scaledCarbs}g</span>
                    <span className="barcode-macro__label">Carbs</span>
                  </div>
                  <div className="barcode-macro barcode-macro--f">
                    <span className="barcode-macro__val">{scaledFat}g</span>
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
