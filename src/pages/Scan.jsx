import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Loader, ScanLine, Search, ScanBarcode } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { analyzeMealPhoto } from '../services/aiService';
import FoodSearch from '../components/FoodSearch';
import BarcodeScanner from '../components/BarcodeScanner';
import './Scan.css';

export default function Scan() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  const isNative = Capacitor.isNativePlatform();

  async function handleNativeCapture(source) {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source
      });
      
      if (image.webPath) {
        setPreview(image.webPath);
        // Da wir ein Web-File für den Upload/AI Service brauchen, faken wir das hier für den Mock:
        // In Produktion müsste man die native URL als Blob runterladen/konvertieren.
        // Für den Demo-AI-Service reicht es, dem file state "etwas" zu zuweisen.
        setFile(new File([], "native_photo.jpg", { type: "image/jpeg" }));
      }
    } catch (err) {
      console.log('Kamera abgebrochen oder Fehler:', err);
    }
  }

  function handleFileSelect(e) {
    if (isNative) return handleNativeCapture(CameraSource.Photos);
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  function handleCapture(e) {
    if (isNative) return handleNativeCapture(CameraSource.Camera);
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  function triggerWebInput(type) {
    if (isNative) {
      handleNativeCapture(type === 'camera' ? CameraSource.Camera : CameraSource.Photos);
    } else {
      if (type === 'camera' && cameraInputRef.current) cameraInputRef.current.click();
      if (type === 'upload' && fileInputRef.current) fileInputRef.current.click();
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    try {
      const result = await analyzeMealPhoto(file);
      sessionStorage.setItem('scanResult', JSON.stringify(result));
      navigate('/result');
    } catch (err) {
      console.error('Analyse fehlgeschlagen:', err);
      setAnalyzing(false);
    }
  }

  function clearPreview() {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Lebensmittel-Suche Fullscreen
  if (showSearch) {
    return <FoodSearch onClose={() => setShowSearch(false)} />;
  }

  // Barcode-Scanner Fullscreen
  if (showBarcode) {
    return <BarcodeScanner onClose={() => setShowBarcode(false)} />;
  }

  return (
    <div className="page scan-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Mahlzeit erfassen</h1>
        <button className="btn btn-ghost" style={{ padding: '6px 12px' }} onClick={() => navigate(-1)}>
          <X size={18} />
        </button>
      </div>

      {/* Analyzing Overlay */}
      {analyzing && (
        <motion.div 
          className="scan-analyzing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="scan-analyzing__content">
            <div className="scan-analyzing__spinner">
              <Loader size={32} className="spin" />
            </div>
            <h3>Analysiere Mahlzeit...</h3>
            <p>KI erkennt Zutaten und berechnet Makros</p>
            <div className="scan-analyzing__steps">
              <motion.div 
                className="analyzing-step analyzing-step--done"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                ✓ Bild verarbeitet
              </motion.div>
              <motion.div 
                className="analyzing-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                ⟳ Zutaten werden erkannt...
              </motion.div>
              <motion.div 
                className="analyzing-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                ⟳ Makros werden berechnet...
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview or Upload Area */}
      {preview ? (
        <motion.div 
          className="scan-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="scan-preview__image-wrap">
            <img src={preview} alt="Mahlzeit Vorschau" className="scan-preview__image" />
            <button className="scan-preview__clear" onClick={clearPreview}>
              <X size={18} />
            </button>
            <div className="scan-preview__overlay">
              <ScanLine size={48} className="scan-preview__scan-icon" />
            </div>
          </div>
          <button 
            className="btn btn-accent btn-lg btn-block mt-xl"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            <ScanLine size={20} />
            Mahlzeit analysieren
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="scan-upload"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Manuelle Suche */}
          <button className="scan-option scan-option--search" onClick={() => setShowSearch(true)}>
            <div className="scan-option__icon scan-option__icon--search">
              <Search size={36} />
            </div>
            <span className="scan-option__label">Manuell suchen</span>
            <span className="scan-option__desc">Lebensmittel in der Datenbank finden</span>
          </button>

          {/* Kamera-Button */}
          <button className="scan-option scan-option--camera" onClick={() => triggerWebInput('camera')}>
            {!isNative && (
              <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleCapture}
                className="scan-option__input"
              />
            )}
            <div className="scan-option__icon">
              <Camera size={36} />
            </div>
            <span className="scan-option__label">Foto aufnehmen</span>
            <span className="scan-option__desc">Kamera öffnen und Mahlzeit fotografieren</span>
          </button>

          {/* Upload-Button */}
          <button className="scan-option scan-option--upload" onClick={() => triggerWebInput('upload')}>
            {!isNative && (
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                className="scan-option__input"
              />
            )}
            <div className="scan-option__icon scan-option__icon--secondary">
              <Upload size={36} />
            </div>
            <span className="scan-option__label">Aus Galerie wählen</span>
            <span className="scan-option__desc">Bild aus der Foto-Bibliothek auswählen</span>
          </button>

          {/* Barcode-Scanner */}
          <button className="scan-option scan-option--barcode" onClick={() => setShowBarcode(true)}>
            <div className="scan-option__icon scan-option__icon--barcode">
              <ScanBarcode size={36} />
            </div>
            <span className="scan-option__label">Barcode scannen</span>
            <span className="scan-option__desc">Verpackte Produkte per Barcode erfassen</span>
          </button>

          {/* Hinweis */}
          <div className="scan-hint">
            <p>📸 Tipp: Fotografiere die gesamte Mahlzeit von oben für beste Ergebnisse</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
