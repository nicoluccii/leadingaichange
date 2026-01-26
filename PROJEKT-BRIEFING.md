# Projekt-Briefing: Trainings-Reflexionstool

> Dieses Dokument beschreibt die vollstaendige technische und gestalterische Architektur des Projekts "Leading AI Change – Fuehrungscockpit". Es dient als Blaupause, um ein identisch aufgebautes Tool fuer ein anderes Trainingsthema zu erstellen.

---

## 1. Projektuebersicht

| Eigenschaft | Wert |
|---|---|
| **Projekttyp** | Interaktives Trainings-Reflexionstool (Single-Page Web-App) |
| **Zweck** | Teilnehmer durchlaufen einen mehrstufigen Selbstcheck, dokumentieren Erkenntnisse und generieren am Ende einen personalisierten KI-Prompt fuer die Weiterarbeit |
| **Sprache der UI** | Deutsch |
| **Backend** | Keins – reine Client-Side-Anwendung |
| **Datenpersistenz** | Browser localStorage (kein Server, keine Datenbank) |
| **Zugangsschutz** | Einfacher Passwort-Screen (hartcodiert im Frontend) |

---

## 2. Tech Stack

### 2.1 Kern-Technologien

| Technologie | Version | Zweck |
|---|---|---|
| **Next.js** | 16.1.1 | React-Framework (App Router) |
| **React** | 19.2.3 | UI-Library |
| **TypeScript** | ^5 | Typisierung |
| **Tailwind CSS** | ^4 (via PostCSS) | Styling-Framework |

### 2.2 Dependencies (package.json)

**Runtime (3):**
```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

**Dev (7):**
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.1",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

**Wichtig:** Es werden KEINE externen UI-Bibliotheken verwendet (kein shadcn/ui, kein Material UI, kein Chakra). Alle Komponenten sind handgebaut mit Custom CSS.

### 2.3 Konfigurationsdateien

**tsconfig.json:**
- Target: ES2017
- Module Resolution: bundler
- Path-Alias: `@/*` -> `./src/*`
- Strict Mode: aktiviert

**postcss.config.mjs:**
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
export default config;
```

**next.config.ts:**
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

Es gibt KEINE tailwind.config.ts/js – Tailwind v4 wird ueber PostCSS und CSS-Imports konfiguriert.

### 2.4 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## 3. Projektstruktur

```
projekt-root/
├── public/
│   └── logo.png                    ← Firmenlogo (einziges genutztes Asset)
├── src/
│   └── app/
│       ├── layout.tsx              ← Root Layout (Metadata, HTML-Shell)
│       ├── page.tsx                ← GESAMTE Applikation (~1560 Zeilen)
│       ├── globals.css             ← GESAMTES Styling (~870 Zeilen)
│       └── favicon.ico
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── next.config.ts
└── .gitignore
```

### Architektur-Entscheidung: Monolithischer Ansatz

Die gesamte Anwendung lebt in **einer einzigen Datei** (`page.tsx`). Keine separaten Komponenten-Dateien, keine Ordner fuer Components, Hooks, Utils etc. Das ist bewusst so gewaehlt fuer Einfachheit und schnelle Iteration.

**Fuer ein neues Projekt koennte man ueberlegen:**
- Ob man dabei bleibt (bei aehnlicher Groesse/Komplexitaet OK)
- Oder ob man Komponenten auslagert (bei mehr Modulen sinnvoll)

---

## 4. Dateistruktur im Detail

### 4.1 layout.tsx (Root Layout)

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leading AI Change – Cockpit",
  description: "Dein persoenlicher Begleiter fuer das Zirkeltraining Leading AI Change",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌶️</text></svg>",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

- Sprache `lang="de"`
- Emoji-Favicon (kein externes Favicon noetig)
- Minimales Layout – kein Wrapper, kein Provider

### 4.2 page.tsx (Hauptdatei) – Aufbau

Die Datei ist als `'use client'` markiert und enthaelt alles:

```
1.   TypeScript Interfaces (FormData)
2.   Konfigurations-Daten (Labels, Prompt-Templates, Konstanten)
3.   Haupt-Komponente Home()
4.     - State-Variablen (useState)
5.     - Effekte (useEffect) – localStorage laden, Auto-Save
6.     - Handler-Funktionen (Login, Navigation, Prompt-Generierung, etc.)
7.     - Render: Login-Screen ODER App mit Header + Steps + Footer + Modals
```

---

## 5. Wizard-Architektur (Schritt-fuer-Schritt-Ablauf)

Das Tool ist ein **7-Schritte-Wizard**. Jeder Schritt wird ueber `currentStep` State gesteuert und nur der aktive Step wird gerendert:

```tsx
{currentStep === 1 && ( <section>...</section> )}
{currentStep === 2 && ( <section>...</section> )}
// etc.
```

### Die 7 Schritte:

| Step | Titel | Modultyp | Beschreibung |
|------|-------|----------|--------------|
| 1 | **Willkommen** | Welcome-Screen + optionaler Text-Input | Einfuehrung, Lernziele, optionale Headline (Freitext) |
| 2 | **Verortung** | 2x Slider (1-5 Skala) | Zwei Positionierungsfragen mit beschreibenden Labels pro Stufe |
| 3 | **Selbstcheck** | 12x Slider (0-10 Skala) | Selbsteinschaetzung in 4 Kategorien (ICH / ICH->TEAM / STRUKTUREN / WISSEN) |
| 4 | **Erkenntnisse** | 1x Textarea | Freitext-Dokumentation von Erkenntnissen |
| 5 | **Entwicklungssituation** | 3x Textarea | Beobachtung, Herausforderung, Ziel – jeweils Freitext |
| 6 | **Moduswahl** | 4x Auswahl-Karten | Auswahl des KI-Coaching-Modus |
| 7 | **Prompt-Output** | Editierbares Textarea + Compliance-Checkliste | Generierter Prompt anzeigen, pruefen, kopieren, herunterladen |

### Verfuegbare Modul-Typen (wiederverwertbar):

1. **Willkommens-Screen** – Titel, Beschreibung, Feature-Liste, optionaler Input
2. **Slider (1-5 mit Labels)** – Jede Stufe hat eine textuelle Beschreibung
3. **Slider (0-10 mit Farbcode)** – Rot (0-3), Orange (4-6), Gruen (7-10)
4. **Freitext-Eingabe** (Textarea) – Mit Platzhalter-Text
5. **Mehrere Freitext-Felder** auf einer Seite
6. **Auswahl-Karten** – Klickbare Karten mit Icon, Titel, Beschreibung, Hinweis
7. **Prompt-Ausgabe** mit Compliance-Checkliste, Kopier- und Download-Funktion

---

## 6. State Management

### 6.1 Haupt-State

```tsx
// Authentifizierung
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [passwordInput, setPasswordInput] = useState('');
const [passwordError, setPasswordError] = useState(false);

// Navigation
const [currentStep, setCurrentStep] = useState(1);

// Formulardaten
const [formData, setFormData] = useState<FormData>(initialFormData);

// Prompt-Output
const [promptOutput, setPromptOutput] = useState('');
const [selectedMode, setSelectedMode] = useState<PromptMode | null>(null);
const [pendingMode, setPendingMode] = useState<PromptMode | null>(null);

// UI-Feedback
const [showSaved, setShowSaved] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);
const [showResponsibilityModal, setShowResponsibilityModal] = useState(false);
const [copyButtonState, setCopyButtonState] = useState<'default' | 'copied'>('default');
const [logoError, setLogoError] = useState(false);

// EU AI Act Compliance
const [complianceChecks, setComplianceChecks] = useState({
  faktenCheck: false,
  biasFilter: false,
  datenschutz: false,
  verantwortung: false,
});
```

### 6.2 FormData Interface

```tsx
interface FormData {
  headline: string;              // Freitext
  eigeneNutzung: number;         // 1-5 Slider
  erwartungOrganisation: number; // 1-5 Slider
  q1: number;                    // 0-10 Slider (12 Stueck: q1-q12)
  q2: number;
  // ... bis q12
  erkenntnisseAustausch: string;       // Textarea
  situationsbeschreibung: string;      // Textarea
  zentraleHerausforderung: string;     // Textarea
  entwicklungsziel: string;            // Textarea
}
```

### 6.3 Persistenz (localStorage)

```tsx
const STORAGE_KEY = 'leadingAIChange_data';

// Laden beim Start
useEffect(() => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    const parsed = JSON.parse(savedData);
    setFormData(prev => ({ ...prev, ...parsed }));
    if (parsed.currentStep) setCurrentStep(parsed.currentStep);
  }
}, []);

// Auto-Save mit 1000ms Debounce
useEffect(() => {
  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
  saveTimeoutRef.current = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, currentStep }));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, 1000);
}, [formData]);
```

**Wichtig:** Der aktuelle Schritt wird mitgespeichert. Beim Neuladen springt der User zurueck zu seinem letzten Schritt.

---

## 7. Prompt-Generierung (Kernfunktion)

### 7.1 Template-System

Es gibt **4 Prompt-Modi** (plus 1 Legacy-Template):

| Modus | Beschreibung | Laenge | Ziel-KI |
|-------|-------------|--------|---------|
| **Coach** | Systemisch, fragend, prozessbegleitend | ~140 Zeilen | GPT-4o, Claude Opus |
| **Impuls** | Direkt, handlungsorientiert, pragmatisch | ~85 Zeilen | GPT-4o, Claude Sonnet |
| **Rohdaten** | Nur strukturierte Daten, kein KI-Prompt | ~50 Zeilen | Beliebig |
| **Kompakt** | Kurz, optimiert fuer schwaecher KI-Modelle | ~45 Zeilen | GPT-3.5, Copilot, Gemini Flash |

### 7.2 Template-Platzhalter

Templates verwenden `{{variable_name}}` Syntax, die per `.replace()` befuellt wird:

```
{{headline}}
{{eigene_nutzung}}
{{eigene_nutzung_label}}
{{erwartung_organisation}}
{{erwartung_organisation_label}}
{{q1}} bis {{q12}}
{{erkenntnisse_austausch}}
{{situationsbeschreibung}}
{{zentrale_herausforderung}}
{{entwicklungsziel}}
{{datum}}
```

### 7.3 Generierungs-Flow

1. User waehlt Modus (Step 6)
2. → Responsibility-Modal erscheint (EU AI Act Hinweis)
3. User bestaetigt → Prompt wird generiert und automatisch in Clipboard kopiert
4. → Step 7: Prompt wird in editierbarem Textarea angezeigt
5. → User muss 4 Compliance-Checkboxen bestätigen, bevor Copy/Download freigeschaltet wird

### 7.4 Clipboard & Download

```tsx
// Kopieren (mit Fallback fuer aeltere Browser)
try {
  await navigator.clipboard.writeText(prompt);
} catch {
  const textarea = document.createElement('textarea');
  textarea.value = prompt;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Download als .txt
const blob = new Blob([promptOutput], { type: 'text/plain;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'Leading_AI_Change_Prompt.txt';
a.click();
```

---

## 8. Design-System

### 8.1 Farben (CSS Custom Properties)

```css
:root {
    --chili-red: #FE1230;           /* Primaerfarbe, CTAs, Akzente */
    --chili-red-hover: #e0102a;     /* Hover-State */
    --ocean-blue: #0061F7;          /* Sekundaerfarbe, Links, Info-Boxen */
    --ocean-blue-hover: #0050d0;    /* Hover-State */
    --bg-slate: #F8FAFC;            /* Seitenhintergrund */
    --card-white: #FFFFFF;          /* Kartenfarbe */
    --text-dark: #1E293B;           /* Primaerer Text */
    --text-medium: #475569;         /* Sekundaerer Text */
    --text-light: #94A3B8;          /* Tertiaerer Text, Hinweise */
    --border-light: #E2E8F0;        /* Rahmen, Trennlinien */
    --success-green: #10B981;       /* Erfolg, Abgeschlossen */
}
```

**Zusaetzliche Farben im Code (nicht als Variable):**
- Slider Rot: `#EF4444` (Wert 0-3)
- Slider Orange: `#F59E0B` (Wert 4-6)
- Slider Gruen: `#10B981` (Wert 7-10)
- Prompt-Hintergrund: `#1E293B` (dark slate)
- Prompt-Text: `#E2E8F0`

### 8.2 Typografie

```css
/* Hauptschrift: System Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Monospace (fuer Prompt-Ausgabe): */
font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
```

**Keine Custom Fonts geladen** – rein System Fonts fuer maximale Performance.

**Schriftgroessen:**
- Kartentitel: `1.75rem` (28px)
- Abschnittstitel: `1.25rem` (20px)
- Body: `1rem` (16px)
- Labels: `0.95rem` (15px)
- Hinweise: `0.875rem` (14px)
- Kleintext: `0.75rem` (12px)

**Zeilenhoehe:** `1.6` (global)

### 8.3 Layout

- **Max-Width:** `800px` (Content-Bereich)
- **Zentriert:** `margin: 0 auto`
- **Padding:** `0 1rem` seitlich, `3rem` unten
- **Header:** Flex, space-between, weisser Hintergrund
- **Footer:** CSS Grid mit 3 Spalten
- **Kein Sidebar, kein Dashboard-Layout** – reines Content-zentriertes Design

### 8.4 Komponenten-Styles

#### Karten (Card)
```css
.card {
    background: white;
    border-radius: 1rem;          /* 16px */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;              /* 40px */
    margin-bottom: 1.5rem;
}
```

#### Buttons
| Button-Typ | Hintergrund | Rahmen | Hover |
|---|---|---|---|
| Primary | `#FE1230` (rot) | keiner | dunkler, nach oben, Schatten |
| Secondary | transparent | `2px solid #0061F7` | fuellt blau |
| Outline | transparent | `2px solid #E2E8F0` | Rahmen dunkler |
| Success | `#10B981` (gruen) | keiner | dunkler |
| Skip | transparent | keiner | Textfarbe dunkler |
| Reset | transparent | `1px solid #E2E8F0` | rot |

Alle Buttons: `border-radius: 0.75rem`, `padding: 0.875rem 2rem`, `font-weight: 600`

#### Info-Boxen
| Box-Typ | Hintergrund | Rand-Links | Verwendung |
|---|---|---|---|
| Help-Box | `rgba(0,97,247,0.05)` | `4px solid #0061F7` | Tipps, Lernziele |
| Warning-Box | `rgba(254,18,48,0.05)` | `4px solid #FE1230` | Warnungen |
| Compliance-Box | `rgba(0,97,247,0.04)` | `1px border` | EU AI Act |

#### Formular-Elemente
- Input/Textarea: `border: 2px solid #E2E8F0`, `border-radius: 0.75rem`
- Focus: `border-color: #0061F7`, `box-shadow: 0 0 0 3px rgba(0,97,247,0.1)`
- Textarea min-height: `150px` (Standard) oder `100px` (kompakt)

#### Slider
- Track: `8px` hoch, `border-radius: 4px`
- Thumb: `24px` Kreis, `background: #FE1230`, Schatten
- Dynamischer Hintergrund via `linear-gradient` (gefuellter Teil farbig)
- Verortungs-Slider: Wert-Anzeige darunter als Box
- Selbstcheck-Slider: Wert-Anzeige rechts daneben

#### Kategorie-Header (Selbstcheck-Bereiche)
```css
.category-header {
    background: linear-gradient(135deg, #FE1230 0%, #ff4d5a 100%);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
}
```

#### Mode-Selection-Karten
```css
.mode-card {
    border: 2px solid #E2E8F0;
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
    /* Hover: roter Rahmen + Schatten + translateY(-2px) */
}
.mode-card-secondary {
    background: #F8FAFC;  /* Grauer Hintergrund fuer "schwaecher" Modi */
    /* Hover: blauer Rahmen statt rot */
}
```

#### Modals
```css
.modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
}
.modal {
    max-width: 400px; width: 90%;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
```

### 8.5 Animationen

```css
/* Fade-In fuer Steps */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
/* Dauer: 0.4s ease */

/* Alle Transitions: 0.3s ease (Standard) */
/* Button Hover: translateY(-2px) */
/* Slider Thumb Hover: scale(1.1) */
/* Smooth Scroll: window.scrollTo({ behavior: 'smooth' }) */
```

### 8.6 Responsive Design

**Einziger Breakpoint:** `640px`

```css
@media (max-width: 640px) {
    .card { padding: 1.5rem; }           /* statt 2.5rem */
    .card-title { font-size: 1.5rem; }   /* statt 1.75rem */
    .btn-container { flex-direction: column; }
    .btn { width: 100%; }
    .progress-text { display: none; }
    .footer-grid { grid-template-columns: 1fr; }
    .mode-icon { font-size: 1.75rem; }   /* statt 2rem */
}
```

---

## 9. Features & Interaktionsmuster

### 9.1 Login-Screen
- Zentriertes Card mit Logo, Titel, Passwort-Input
- Hintergrund: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`
- Fehlermeldung bei falschem Passwort (rot)
- Passwort hartcodiert im Frontend

### 9.2 Progress-Indicator (Header)
- 7 kleine Kreise (12px), horizontal angeordnet
- Inaktiv: Grau (`#E2E8F0`)
- Aktiv: Rot (`#FE1230`) + `scale(1.2)`
- Abgeschlossen: Gruen (`#10B981`)
- Klickbar: Zurueck zu bereits besuchten Steps
- Text: "Schritt X von 7" (auf Mobile ausgeblendet)

### 9.3 Navigation
- "Weiter" Button (primary, rot) auf jeder Seite
- "Zurueck" Button (secondary, blau-outline)
- "Ueberspringen" Link (underline, grau) – nur bei optionalen Steps
- Smooth Scroll nach oben bei Schrittwechsel

### 9.4 Auto-Save
- Debounced (1000ms) nach jeder Aenderung
- Gruene Anzeige "Gespeichert" rechts unten (2 Sekunden sichtbar)
- Speichert alle Formulardaten + aktuellen Schritt

### 9.5 Reset-Funktion
- "Alle Eingaben zuruecksetzen" Button
- Bestaetigung per Modal ("Wirklich zuruecksetzen?")
- Loescht localStorage und setzt alles auf Default

### 9.6 EU AI Act Compliance-Flow
1. User waehlt Modus → Responsibility-Modal erscheint
2. Modal erklaert: "Im naechsten Schritt siehst du eine Compliance-Checkliste"
3. User bestaetigt → Prompt wird generiert
4. Auf Step 7: 4 Checkboxen muessen aktiviert werden
5. Erst wenn alle 4 gecheckt sind, wird Copy/Download freigeschaltet
6. Disclaimer am Ende: "Hinweis gem. EU AI Act..."

### 9.7 Datenschutz-Hinweise
- Feste Leiste am unteren Bildschirmrand (fixed)
- "Alle Daten bleiben lokal in deinem Browser gespeichert – keine Serveruebertragung"
- Zusaetzlich: Datenschutz-Box vor den Freitext-Feldern (Step 5)

### 9.8 Footer
- 3 Spalten: Firma-Links, EU AI Act Link, Haftungsausschluss
- Copyright-Zeile darunter

---

## 10. Datenmodell (zum Anpassen)

Fuer ein neues Trainingsthema muessen folgende Daten angepasst werden:

### 10.1 Konfiguration (Konstanten)

```tsx
const ACCESS_PASSWORD = 'neuespasswort';
const STORAGE_KEY = 'neuerKey_data';
const TOTAL_STEPS = 7;  // Anzahl der Schritte anpassen
```

### 10.2 FormData (alle Eingabefelder)

```tsx
interface FormData {
  // Freitext-Felder
  headline: string;

  // Slider mit Labels (1-5 Skala) – Anzahl variabel
  eigeneNutzung: number;
  erwartungOrganisation: number;

  // Selbstcheck-Fragen (0-10 Skala) – Anzahl variabel
  q1: number;
  q2: number;
  // ... beliebig viele

  // Textareas – Anzahl variabel
  erkenntnisseAustausch: string;
  situationsbeschreibung: string;
  zentraleHerausforderung: string;
  entwicklungsziel: string;
}
```

### 10.3 Slider-Labels (Verortung)

```tsx
const verortungLabels = {
  eigeneNutzung: {
    1: 'Beschreibung fuer Stufe 1',
    2: 'Beschreibung fuer Stufe 2',
    3: 'Beschreibung fuer Stufe 3',
    4: 'Beschreibung fuer Stufe 4',
    5: 'Beschreibung fuer Stufe 5',
  },
  // ... weitere Slider mit Labels
};
```

### 10.4 Selbstcheck-Fragen

Die 12 Fragen sind in 4 Kategorien gruppiert:

```tsx
// Kategorie-Header: "ICH-Ebene"
{ id: 'q1', label: 'Fragetext...' },
{ id: 'q2', label: 'Fragetext...' },
{ id: 'q3', label: 'Fragetext...' },

// Kategorie-Header: "ICH → TEAM"
{ id: 'q4', label: 'Fragetext...' },
// ... usw.
```

Farbcodierung:
- 0-3: Rot (`#EF4444`) = "Ausbaufaehig"
- 4-6: Orange (`#F59E0B`) = "Im Aufbau"
- 7-10: Gruen (`#10B981`) = "Gut aufgestellt"

### 10.5 Prompt-Templates

Templates sind mehrzeilige Template-Strings mit `{{platzhalter}}` Syntax. Jedes Template definiert:
- Rolle/Persoenlichkeit des KI-Assistenten
- Skillset und Haltung
- Klare Grenzen
- Kontext-Daten (werden per Replace eingesetzt)
- Einstiegs-Anweisung
- Interaktionsstil

---

## 11. Anleitung: Neues Tool aufsetzen

### Schritt 1: Projekt klonen / neu erstellen

```bash
npx create-next-app@latest neues-tool --typescript --tailwind --eslint --app --src-dir
```

Dann package.json Versionen anpassen auf die getesteten:
- next: 16.1.1
- react: 19.2.3
- tailwindcss: ^4

### Schritt 2: Dateien uebernehmen

1. `globals.css` komplett uebernehmen (Design-System)
2. `layout.tsx` anpassen (Titel, Beschreibung, Emoji, Sprache)
3. `page.tsx` als Vorlage nehmen und anpassen:
   - FormData Interface neu definieren
   - Slider-Labels anpassen
   - Fragen austauschen
   - Steps hinzufuegen/entfernen
   - Prompt-Templates komplett neu schreiben
   - Konstanten anpassen (Passwort, Storage-Key, Schrittzahl)
4. Logo in `/public/` austauschen

### Schritt 3: Inhalt anpassen

Folgende Bereiche muessen fuer jedes neue Training komplett neu geschrieben werden:

| Bereich | Was anpassen |
|---|---|
| **Willkommens-Text** | Titel, Lernziele, Feature-Liste |
| **Verortungs-Slider** | Fragen und Stufenbeschreibungen |
| **Selbstcheck-Fragen** | Kategorien, Fragen, Anzahl |
| **Freitext-Felder** | Titel, Beschreibungen, Platzhalter |
| **Modus-Karten** | Titel, Beschreibungen, Icons |
| **Prompt-Templates** | Komplett neuer Inhalt pro Modus |
| **Compliance-Checks** | Pruefpunkte anpassen falls noetig |
| **Footer** | Links, Impressum, Copyright |

### Schritt 4: Design anpassen (optional)

Falls anderes Branding gewuenscht:
- CSS-Variablen in `globals.css` aendern (Farben)
- Logo austauschen
- Schriften anpassen (Google Fonts einbinden falls gewuenscht)

---

## 12. Bekannte Limitierungen

1. **Kein Backend** – Daten nur lokal, kein Tracking, keine Auswertung
2. **Kein echtes Auth** – Passwort im Frontend sichtbar (Source Code)
3. **Monolithische Datei** – Bei vielen neuen Modulen wird page.tsx schwer wartbar
4. **Keine Tests** – Kein Test-Setup vorhanden
5. **Kein Routing** – Nur eine Route (`/`), alles per State gesteuert
6. **Keine Internationalisierung** – Fest auf Deutsch, kein i18n-Framework
7. **Keine Analytics** – Kein Tracking des Nutzerverhaltens

---

## 13. Moegliche Erweiterungen fuer neue Projekte

- Echte Komponenten-Aufteilung (wenn mehr Module noetig)
- Supabase/Firebase fuer Datenpersistenz (wenn serverseitige Speicherung gewuenscht)
- Vercel Analytics (wenn Tracking gewuenscht)
- Multiple Routes statt Wizard (wenn nicht-linear)
- PDF-Export statt TXT-Download
- API-Integration (direkte KI-Anbindung statt Copy-Paste)
- Dark Mode (Grundstruktur wuerde es hergeben)

---

## 14. Zusammenfassung fuer den neuen Chat

> **Prompt-Vorlage fuer ein neues Projekt:**
>
> "Bau mir ein interaktives Trainings-Reflexionstool mit folgendem Tech Stack und Design:
>
> - Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
> - Single-Page App mit Wizard-Navigation (X Schritte)
> - Client-only, Daten in localStorage, Passwort-geschuetzt
> - Design: [Dieses Briefing als Referenz anhaengen]
> - Farben: [Primaerfarbe], [Sekundaerfarbe] (oder wie gehabt)
> - Module die ich brauche: [Slider, Skalenabfragen, Freitext, etc.]
> - Am Ende: Prompt-Generierung mit Template-System und Compliance-Checkliste
>
> Das Training heisst '[THEMA]' und hat folgende Inhalte/Module:
> [Hier die Schritte und Inhalte beschreiben]"

---

*Erstellt am 26.01.2026 | Basierend auf Projekt "Leading AI Change – Fuehrungscockpit" v1.0*
