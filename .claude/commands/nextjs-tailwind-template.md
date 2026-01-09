# Next.js + Tailwind CSS Project Template

Du bist ein Experte für Next.js 16+ und Tailwind CSS 4+ Projekte. Erstelle Projekte nach diesem bewährten Template.

---

## Projektstruktur

```
projekt-name/
├── src/
│   └── app/
│       ├── page.tsx          # Hauptseite (Client Component)
│       ├── layout.tsx        # Root Layout mit Metadata
│       ├── globals.css       # Globale Styles + Design System
│       └── favicon.ico
├── public/                    # Statische Assets (Bilder, Logos)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

---

## Package.json Template

```json
{
  "name": "projekt-name",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## TypeScript Konfiguration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## PostCSS Konfiguration (postcss.config.mjs)

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

---

## Next.js Konfiguration (next.config.ts)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

---

## Design System (globals.css)

```css
@import "tailwindcss";

/* ========================================
   CSS Design System
   ======================================== */

:root {
    /* Primärfarben */
    --primary: #FE1230;
    --primary-hover: #e0102a;
    --secondary: #0061F7;
    --secondary-hover: #0050d0;

    /* Hintergrund & Oberflächen */
    --bg-slate: #F8FAFC;
    --card-white: #FFFFFF;

    /* Text */
    --text-dark: #1E293B;
    --text-medium: #475569;
    --text-light: #94A3B8;

    /* Borders & States */
    --border-light: #E2E8F0;
    --success-green: #10B981;
    --warning-yellow: #F59E0B;
    --error-red: #EF4444;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-slate);
    color: var(--text-dark);
    line-height: 1.6;
    min-height: 100vh;
}

/* Header */
.header {
    background: var(--card-white);
    padding: 1rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Main Container */
.main-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    padding-bottom: 3rem;
}

/* Card */
.card {
    background: var(--card-white);
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
    margin-bottom: 1.5rem;
}

.card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.card-subtitle {
    font-size: 1rem;
    color: var(--text-medium);
    margin-bottom: 2rem;
}

/* Step Sections mit Animation */
.step-section {
    display: none;
}

.step-section.active {
    display: block;
    animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Form Elements */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.form-hint {
    font-size: 0.875rem;
    color: var(--text-medium);
    margin-bottom: 0.75rem;
}

/* Input Text */
.input-text {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-text:focus {
    outline: none;
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(0, 97, 247, 0.1);
}

/* Textarea */
.textarea {
    width: 100%;
    min-height: 150px;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.textarea:focus {
    outline: none;
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(0, 97, 247, 0.1);
}

.textarea::placeholder {
    color: var(--text-light);
}

/* Buttons */
.btn-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
}

.btn {
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(254, 18, 48, 0.3);
}

.btn-secondary {
    background: transparent;
    color: var(--secondary);
    border: 2px solid var(--secondary);
}

.btn-secondary:hover {
    background: var(--secondary);
    color: white;
}

.btn-outline {
    background: transparent;
    color: var(--text-medium);
    border: 2px solid var(--border-light);
}

.btn-outline:hover {
    border-color: var(--text-medium);
    color: var(--text-dark);
}

.btn-success {
    background: var(--success-green);
    color: white;
}

.btn-success:hover {
    background: #0ea572;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Help Box (Info) */
.help-box {
    background: rgba(0, 97, 247, 0.05);
    border-left: 4px solid var(--secondary);
    padding: 1rem 1.25rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin-bottom: 1.5rem;
}

.help-box-title {
    font-weight: 600;
    color: var(--secondary);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.help-box ul {
    margin: 0;
    padding-left: 1.25rem;
    color: var(--text-medium);
    font-size: 0.9rem;
}

/* Warning Box */
.warning-box {
    background: rgba(254, 18, 48, 0.05);
    border-left: 4px solid var(--primary);
    padding: 1rem 1.25rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: var(--text-medium);
}

/* Modal */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-overlay.show {
    display: flex;
}

.modal {
    background: var(--card-white);
    padding: 2rem;
    border-radius: 1rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.modal-text {
    color: var(--text-medium);
    margin-bottom: 1.5rem;
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Progress Indicator */
.progress-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.progress-step {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border-light);
    transition: all 0.3s ease;
}

.progress-step.active {
    background: var(--primary);
    transform: scale(1.2);
}

.progress-step.completed {
    background: var(--success-green);
}

/* Footer */
.footer {
    background: var(--card-white);
    border-top: 1px solid var(--border-light);
    padding: 2rem;
    margin-top: 2rem;
}

.footer-grid {
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    text-align: center;
}

/* Saved Indicator */
.saved-indicator {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: var(--success-green);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
}

.saved-indicator.show {
    opacity: 1;
    transform: translateY(0);
}

/* Responsive */
@media (max-width: 640px) {
    .card {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.5rem;
    }

    .btn-container {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        text-align: center;
    }

    .header {
        padding: 1rem;
    }

    .footer-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
```

---

## Layout Template (layout.tsx)

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projekt Titel",
  description: "Projekt Beschreibung",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

---

## Page Template (page.tsx)

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Type Definitionen
interface FormData {
  // Definiere hier die Formularfelder
  field1: string;
  field2: number;
}

const initialFormData: FormData = {
  field1: '',
  field2: 5,
};

const STORAGE_KEY = 'projektName_data';
const TOTAL_STEPS = 3;

export default function Home() {
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSaved, setShowSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // LocalStorage laden
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      } catch (e) {
        console.error('Fehler beim Laden:', e);
      }
    }
  }, []);

  // Auto-Save mit Debounce
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage();
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [formData, currentStep]);

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, currentStep }));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Feld aktualisieren
  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowResetModal(false);
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <span className="logo-placeholder">Projekt Logo</span>
        <div className="progress-container">
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <div
              key={i}
              className={`progress-step ${
                i + 1 === currentStep ? 'active' : ''
              } ${i + 1 < currentStep ? 'completed' : ''}`}
            />
          ))}
          <span className="progress-text">Schritt {currentStep} von {TOTAL_STEPS}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <div className="card">
          {/* Step 1 */}
          <section className={`step-section ${currentStep === 1 ? 'active' : ''}`}>
            <h1 className="card-title">Willkommen</h1>
            <p className="card-subtitle">Beschreibung des ersten Schritts</p>

            <div className="form-group">
              <label htmlFor="field1" className="form-label">Feld 1</label>
              <input
                type="text"
                id="field1"
                className="input-text"
                value={formData.field1}
                onChange={(e) => updateField('field1', e.target.value)}
                placeholder="Eingabe..."
              />
            </div>

            <div className="btn-container">
              <div></div>
              <button className="btn btn-primary" onClick={nextStep}>
                Weiter →
              </button>
            </div>
          </section>

          {/* Step 2 */}
          <section className={`step-section ${currentStep === 2 ? 'active' : ''}`}>
            <h1 className="card-title">Zweiter Schritt</h1>
            <p className="card-subtitle">Beschreibung des zweiten Schritts</p>

            <div className="help-box">
              <div className="help-box-title">💡 Hinweis</div>
              <ul>
                <li>Hilfreiche Information 1</li>
                <li>Hilfreiche Information 2</li>
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="field2" className="form-label">Feld 2</label>
              <textarea
                id="field2"
                className="textarea"
                placeholder="Beschreibe..."
              />
            </div>

            <div className="btn-container">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Zurück
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Weiter →
              </button>
            </div>
          </section>

          {/* Step 3 - Ergebnis */}
          <section className={`step-section ${currentStep === 3 ? 'active' : ''}`}>
            <h1 className="card-title">Ergebnis</h1>
            <p className="card-subtitle">Hier ist dein Ergebnis</p>

            <div className="btn-container">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Zurück
              </button>
              <button className="btn btn-success">
                ✓ Fertig
              </button>
            </div>
          </section>

          {/* Reset Button */}
          <div className="reset-container">
            <button className="btn-reset" onClick={() => setShowResetModal(true)}>
              Zurücksetzen
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Kontakt</h4>
            <a href="mailto:info@example.com">info@example.com</a>
          </div>
          <div className="footer-col">
            <h4>Website</h4>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              example.com
            </a>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <p>Weitere Informationen</p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Projektname
        </div>
      </footer>

      {/* Saved Indicator */}
      <div className={`saved-indicator ${showSaved ? 'show' : ''}`}>
        ✓ Gespeichert
      </div>

      {/* Reset Modal */}
      <div className={`modal-overlay ${showResetModal ? 'show' : ''}`}>
        <div className="modal">
          <div className="modal-title">Zurücksetzen?</div>
          <div className="modal-text">
            Alle Eingaben werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
          </div>
          <div className="modal-buttons">
            <button className="btn btn-outline" onClick={() => setShowResetModal(false)}>
              Abbrechen
            </button>
            <button className="btn btn-primary" onClick={resetAll}>
              Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## Wichtige Patterns

### State Management
- **React Hooks** mit `useState` und `useEffect`
- **LocalStorage** für Persistenz
- **Debounced Auto-Save** (1000ms)
- **Immutable Updates**: `setFormData(prev => ({ ...prev, [field]: value }))`

### TypeScript Patterns
- Interface für FormData definieren
- `keyof FormData` für dynamische Feldaktualisierungen
- `as const` für Label-Objekte

### UI/UX Patterns
- **Step-basierte Navigation** mit Fortschrittsanzeige
- **Smooth Scroll** bei Seitenwechsel
- **Visuelles Feedback** (Gespeichert-Indikator)
- **Bestätigungs-Modal** für destruktive Aktionen
- **Responsive Design** ab 640px Breakpoint

### CSS Konventionen
- CSS Variablen für Design Tokens
- BEM-ähnliche Klassenbenennungen
- Transitions für interaktive Elemente
- Focus-States für Barrierefreiheit

---

## Projekt Setup Befehle

```bash
# Neues Next.js Projekt erstellen
npx create-next-app@latest projekt-name --typescript --tailwind --eslint --app --src-dir --no-import-alias

# Abhängigkeiten installieren
cd projekt-name
npm install

# Entwicklungsserver starten
npm run dev

# Build erstellen
npm run build
```

---

## Checkliste für neue Projekte

- [ ] Projektstruktur nach Template anlegen
- [ ] CSS Variablen anpassen (Farben, etc.)
- [ ] TypeScript Interface für FormData definieren
- [ ] LocalStorage Key eindeutig benennen
- [ ] Metadata in layout.tsx anpassen
- [ ] Steps und Navigation implementieren
- [ ] Responsive Breakpoints testen
- [ ] Auto-Save Funktionalität prüfen
