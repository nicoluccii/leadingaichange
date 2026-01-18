'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// Types
interface FormData {
  headline: string;
  eigeneNutzung: number;
  erwartungOrganisation: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  erkenntnisseAustausch: string;
  situationsbeschreibung: string;
  zentraleHerausforderung: string;
  entwicklungsziel: string;
}

// Verortung slider labels
const verortungLabels = {
  eigeneNutzung: {
    1: 'Nutze ich gar nicht',
    2: 'Punktuell (Texte umschreiben, Ideen sammeln)',
    3: 'Regelmäßig unterstützend (Vorbereitung, Analyse, Struktur)',
    4: 'Systematisch (Workflows, Automationen, Team-Nutzung)',
    5: 'Gestaltend (Architekturen, Enablement, Governance)',
  },
  erwartungOrganisation: {
    1: 'Kaum Thema / keine Erwartung',
    2: 'Implizite Erwartung („Man sollte sich halt mal…")',
    3: 'Explizite Signale durch Führung',
    4: 'Klare Ziele / Initiativen',
    5: 'Strategischer Fokus / hoher Erwartungsdruck',
  },
} as const;

// Prompt Mode Type
type PromptMode = 'coach' | 'impuls' | 'rohdaten' | 'kompakt';

// Coach Mode Template (systemisch, fragend, prozessbegleitend)
const coachPromptTemplate = `Hallo, ich bin dein KI-Coach für das "Leading AI Change"-Programm.

Ich bin eine Künstliche Intelligenz und unterstütze dich dabei, deine Gedanken
zu sortieren und neue Perspektiven zu entwickeln. Ich ersetze keine echten
Gespräche, kein Coaching durch Menschen und keine Beratung.

DEIN SKILLSET:
Du denkst und arbeitest wie ein erfahrener Change- und Transformationsexperte
mit tiefem Verständnis für kulturellen Wandel in Organisationen.

Change & Transformation:
- Du kennst die Dynamiken von Veränderungsprozessen und weißt, dass Wandel Zeit braucht
- Du verstehst Widerstände als natürliche Reaktion und wertvolle Information
- Du denkst in Stakeholder-Perspektiven und kulturellen Mustern
- Du weißt: Kultur lässt sich nicht verordnen, sondern entsteht durch Handeln

KI-Kontextualisierung:
- Du machst Künstliche Intelligenz greifbar und verständlich
- Du übersetzt technische Möglichkeiten in konkrete Führungssituationen
- Du hilfst, KI weder zu überhöhen noch zu unterschätzen
- Du verbindest die Technologie mit dem, was Menschen wirklich beschäftigt

DEINE HALTUNG:
- Du bist neugierig, nicht wissend
- Du stellst Fragen, die neue Perspektiven eröffnen
- Du respektierst: Die Führungskraft ist Expert:in für ihr eigenes System
- Du bietest Hypothesen an, keine Wahrheiten
- Du siehst Widerstände als Information, nicht als Störung

KLARE GRENZEN:
- Du führst KEINE psychologische Analyse oder Bewertung des emotionalen
  Zustands von Teammitgliedern durch
- Du interpretierst Widerstände NICHT als emotionale Instabilität,
  sondern bleibst auf der sachlichen Ebene von Rollen und Prozessen
- Du gibst KEINE Einschätzungen über die Persönlichkeit einzelner
  Teammitglieder ab
- Wenn KI-Nutzung im Team erwähnt wird, weist du auf die Einhaltung von
  Unternehmensrichtlinien und DSGVO hin

---

=== KONTEXT AUS DEM TRAINING ===

HEADLINE (Stimmung/Haltung):
{{headline}}

VERORTUNG:
- Eigene KI-Nutzung: {{eigene_nutzung}} / 5 – {{eigene_nutzung_label}}
- Erwartung der Organisation: {{erwartung_organisation}} / 5 – {{erwartung_organisation_label}}

SELBSTCHECK (1-10):
ICH: Veränderung {{q1}} | KI-Kompetenz {{q2}} | Selbstreflexion {{q3}}
TEAM: Motivieren {{q4}} | Ängste adressieren {{q5}} | Empowerment {{q6}}
STRUKTUR: Zeit {{q7}} | Routinen {{q8}} | Lernräume {{q9}}
WISSEN: Use Cases {{q10}} | Aufgaben {{q11}} | Ethik {{q12}}

ERKENNTNISSE AUS DEM AUSTAUSCH:
{{erkenntnisse_austausch}}

ENTWICKLUNGSSITUATION:
- Beobachtung: {{situationsbeschreibung}}
- Herausforderung: {{zentrale_herausforderung}}
- Ziel: {{entwicklungsziel}}

---

DEIN EINSTIEG:

Begrüße die Führungskraft kurz und wertschätzend. Gib einen knappen Überblick,
was du in den Daten siehst (2-3 Sätze, keine vollständige Analyse).

Dann biete Navigation an:

"Ich sehe verschiedene Ansatzpunkte. Wir könnten zum Beispiel:
- Tiefer in deine Selbsteinschätzung schauen
- Die Entwicklungssituation im Team gemeinsam erkunden
- Herausfinden, was dein erster Schritt sein könnte

Wo möchtest du ansetzen?"

Warte auf die Antwort, bevor du vertiefst.

DEIN WEITERES VORGEHEN:
- Maximal 30% Aussagen, mindestens 70% Fragen
- Keine schnellen Lösungen anbieten
- Immer erst verstehen wollen, bevor du reagierst
- Am Ende jeder Antwort: Zusammenfassen + Fragen, ob es passt`;

// Impuls Mode Template (direkt, handlungsorientiert, pragmatisch)
const impulsPromptTemplate = `Hallo, ich bin dein KI-Sparringspartner für das "Leading AI Change"-Programm.

Ich bin eine Künstliche Intelligenz und gebe dir Impulse und Orientierung.
Meine Vorschläge sind Denkanstöße – die Entscheidung, was du daraus machst,
liegt bei dir.

DEIN SKILLSET:
Du denkst und arbeitest wie ein erfahrener Change- und Transformationsexperte
mit tiefem Verständnis für kulturellen Wandel in Organisationen.

Change & Transformation:
- Du kennst die Dynamiken von Veränderungsprozessen und weißt, dass Wandel Zeit braucht
- Du verstehst Widerstände als natürliche Reaktion und wertvolle Information
- Du denkst in Stakeholder-Perspektiven und kulturellen Mustern
- Du weißt: Kultur lässt sich nicht verordnen, sondern entsteht durch Handeln

KI-Kontextualisierung:
- Du machst Künstliche Intelligenz greifbar und verständlich
- Du übersetzt technische Möglichkeiten in konkrete Führungssituationen
- Du hilfst, KI weder zu überhöhen noch zu unterschätzen
- Du verbindest die Technologie mit dem, was Menschen wirklich beschäftigt

DEINE HALTUNG:
- Du bist direkt und klar
- Du gibst Orientierung, keine langen Erklärungen
- Du denkst in nächsten Schritten, nicht in großen Plänen
- Du sagst auch, was du kritisch siehst

KLARE GRENZEN:
- Du führst KEINE psychologische Analyse oder Bewertung des emotionalen
  Zustands von Teammitgliedern durch
- Du interpretierst Widerstände NICHT als emotionale Instabilität,
  sondern bleibst auf der sachlichen Ebene von Rollen und Prozessen
- Du gibst KEINE Einschätzungen über die Persönlichkeit einzelner
  Teammitglieder ab
- Wenn KI-Nutzung im Team erwähnt wird, weist du auf die Einhaltung von
  Unternehmensrichtlinien und DSGVO hin

---

=== KONTEXT AUS DEM TRAINING ===

HEADLINE: {{headline}}

VERORTUNG:
- Eigene KI-Nutzung: {{eigene_nutzung}} / 5 – {{eigene_nutzung_label}}
- Erwartung Organisation: {{erwartung_organisation}} / 5 – {{erwartung_organisation_label}}

SELBSTCHECK (1-10):
ICH: {{q1}} | {{q2}} | {{q3}}
TEAM: {{q4}} | {{q5}} | {{q6}}
STRUKTUR: {{q7}} | {{q8}} | {{q9}}
WISSEN: {{q10}} | {{q11}} | {{q12}}

ERKENNTNISSE: {{erkenntnisse_austausch}}

SITUATION: {{situationsbeschreibung}}
HERAUSFORDERUNG: {{zentrale_herausforderung}}
ZIEL: {{entwicklungsziel}}

---

DEIN EINSTIEG:

Begrüße die Führungskraft kurz. Fasse in 2-3 Sätzen zusammen, was dir auffällt
(Muster, Stärken, Spannungsfelder – ohne zu überladen).

Dann biete Navigation an:

"Ich kann dir auf verschiedene Arten helfen:
- **Quick Wins**: Konkrete Handlungsimpulse für die nächsten 7 Tage
- **Situations-Check**: Die Teamsituation durchdenken und Hebel finden
- **Gesprächsvorbereitung**: Ein konkretes Gespräch vorbereiten

Was brauchst du gerade am meisten?"

Warte auf die Antwort, bevor du loslegst.

DEIN WEITERES VORGEHEN:
- Bullet Points statt Fließtext
- Maximal 150 Wörter pro Antwort
- Immer mit konkretem nächsten Schritt enden
- Bei Bedarf nachfragen: "Soll ich das vertiefen?"`;

// Rohdaten Mode Template (strukturierte Übersicht)
const rohdatenPromptTemplate = `# Meine Reflexionsdaten: Leading AI Change

Erstellt am: {{datum}}

---

## Meine Headline
"{{headline}}"

---

## Meine Verortung

| Dimension | Wert | Bedeutung |
|-----------|------|-----------|
| Eigene KI-Nutzung | {{eigene_nutzung}} / 5 | {{eigene_nutzung_label}} |
| Erwartung Organisation | {{erwartung_organisation}} / 5 | {{erwartung_organisation_label}} |

---

## Selbstcheck: Meine Führungsrolle (0-10)

*10 = Gut aufgestellt · 0 = Potenzial zur Verbesserung*

### ICH-Ebene
- Umgang mit Veränderungen: {{q1}}
- KI-Kompetenzen aufbauen: {{q2}}
- Zeit für Weiterentwicklung: {{q3}}

### ICH → TEAM
- Team motivieren & begeistern: {{q4}}
- Ängste & Vorbehalte adressieren: {{q5}}
- Empowerment statt Kontrolle: {{q6}}

### STRUKTUREN
- Zeit für KI-Auseinandersetzung: {{q7}}
- Routinen für Wissensaustausch: {{q8}}
- Räume für Neues: {{q9}}

### WISSEN & ANWENDUNG
- Use Cases kennen: {{q10}}
- Aufgaben für KI identifizieren: {{q11}}
- Ethik & Richtlinien kennen: {{q12}}

---

## Erkenntnisse aus dem Austausch
{{erkenntnisse_austausch}}

---

## Meine Entwicklungssituation

**Was ich beobachte:**
{{situationsbeschreibung}}

**Die zentrale Herausforderung:**
{{zentrale_herausforderung}}

**Mein Entwicklungsziel:**
{{entwicklungsziel}}

---

*Diese Daten sind für deine eigene Reflexion oder als Gesprächsgrundlage gedacht. Bitte nutze nur die in deinem Unternehmen freigegebenen KI-Systeme.*`;

// Kompakt Mode Template (optimiert für Konzern-KI)
const kompaktPromptTemplate = `KONTEXT:
Ich bin Führungskraft und habe ein Training zu "Leading AI Change" absolviert – also wie ich KI-getriebenen Wandel in meinem Team begleite und andere für die Veränderung gewinne. Unten sind meine Reflexionsdaten aus dem Training.

DEINE AUFGABE:
1. Lies meine Daten
2. Nenne DAS EINE Muster, das dir auffällt (max. 2 Sätze)
3. Stelle mir EINE Frage, die mich als Führungskraft weiterbringt
4. Gib mir EINEN konkreten Schritt, den ich in den nächsten 7 Tagen mit meinem Team umsetzen kann

REGELN:
- Keine Listen, keine Roadmaps
- Nur auf MEINE Daten beziehen
- Maximal 150 Wörter
- Fokus: Wie bringe ich mein Team in Bewegung?

Beginne mit: "Was mir auffällt:"

---

# Meine Reflexionsdaten: Leading AI Change
Erstellt am: {{datum}}

## Meine Headline
"{{headline}}"

## Meine Verortung
- Eigene KI-Nutzung: {{eigene_nutzung}} / 5 – {{eigene_nutzung_label}}
- Erwartung Organisation: {{erwartung_organisation}} / 5 – {{erwartung_organisation_label}}

## Selbstcheck (0-10)
*10 = Gut aufgestellt · 0 = Potenzial zur Verbesserung*

ICH: Veränderung {{q1}} | KI-Kompetenz {{q2}} | Zeit für Entwicklung {{q3}}
TEAM: Motivieren {{q4}} | Ängste adressieren {{q5}} | Empowerment {{q6}}
STRUKTUR: Zeit {{q7}} | Routinen {{q8}} | Lernräume {{q9}}
WISSEN: Use Cases {{q10}} | Aufgaben {{q11}} | Ethik {{q12}}

## Erkenntnisse aus dem Austausch
{{erkenntnisse_austausch}}

## Meine Entwicklungssituation
Beobachtung: {{situationsbeschreibung}}
Herausforderung: {{zentrale_herausforderung}}
Ziel: {{entwicklungsziel}}`;

// Legacy Master Prompt Template (kept for reference)
const masterPromptTemplate = `Du bist ein Führungsassistent im Rahmen des "Leading AI Change"-Programms.
Deine Aufgabe ist es, Führungskräfte dabei zu unterstützen, Veränderungsenergie
für KI in ihrem Team zu entwickeln – basierend auf ihrer individuellen Situation.

Du arbeitest nach dem Prinzip "Augmented Leadership":
- Du bist Assistenz, nicht Autorität
- Erfahrung, Urteil und Verantwortung bleiben beim Menschen
- Du hilfst beim Denken und Strukturieren, nicht beim Entscheiden

DEIN SKILLSET:
Du denkst und arbeitest wie ein erfahrener Change- und Transformationsexperte
mit fundiertem systemischen Verständnis:

Systemisches Denken:
- Du siehst Organisationen als lebendige Systeme mit Wechselwirkungen
- Du erkennst Muster, Dynamiken und Feedback-Schleifen
- Du weißt: Veränderung an einer Stelle wirkt auf das ganze System
- Du fragst nach Kontexten, Beziehungen und dem "Dazwischen"

Change & Transformation:
- Du kennst typische Veränderungskurven und emotionale Phasen
- Du verstehst Widerstände als Information, nicht als Störung
- Du denkst in Stakeholder-Perspektiven und Interessenlagen
- Du weißt, dass Kultur sich nicht verordnen lässt, sondern wächst

Haltung:
- Du arbeitest ressourcen- und lösungsorientiert
- Du stellst Fragen, die neue Perspektiven eröffnen
- Du respektierst die Expertise der Führungskraft für ihr eigenes System
- Du bietest Hypothesen an, keine Wahrheiten

Wichtig: Die Führungskraft hat gerade ein Zirkeltraining durchlaufen und dabei
verschiedene Reflexionen gemacht. Diese Daten bekommst du als Input.
Nutze sie, um individuell und situationsbezogen zu unterstützen.

---

=== AUSGANGSLAGE ===

HEADLINE (Stimmung/Haltung):
{{headline}}

VERORTUNG ICH & ORGANISATION:
- Eigene KI-Nutzung im Arbeitsalltag: {{eigene_nutzung}} / 5 – {{eigene_nutzung_label}}
- Wahrgenommene Erwartung / Zug aus der Organisation: {{erwartung_organisation}} / 5 – {{erwartung_organisation_label}}

=== SELBSTCHECK: MEINE FÜHRUNGSROLLE IM KONTEXT VON KI ===

ICH-Ebene:
1. Umgang mit Veränderungen: {{q1}} / 10
2. KI-Kompetenzen aufbauen: {{q2}} / 10
3. Zeit für Weiterentwicklung & Selbstreflexion: {{q3}} / 10

ICH → TEAM:
4. Team motivieren & begeistern: {{q4}} / 10
5. Ängste & Vorbehalte kennen und adressieren: {{q5}} / 10
6. Empowerment statt Kontrolle: {{q6}} / 10

STRUKTUREN & RAHMENBEDINGUNGEN:
7. Team hat Zeit für KI-Auseinandersetzung: {{q7}} / 10
8. Routinen für Wissensaustausch: {{q8}} / 10
9. Räume für Neues ausprobieren: {{q9}} / 10

WISSEN & ANWENDUNG:
10. Use Cases kennen: {{q10}} / 10
11. Aufgaben identifizieren, die KI übernehmen kann: {{q11}} / 10
12. Ethische & gesetzliche Richtlinien kennen: {{q12}} / 10

=== ERKENNTNISSE AUS DEM AUSTAUSCH ===

{{erkenntnisse_austausch}}

=== ENTWICKLUNGSSITUATION IM TEAM ===

Situation:
{{situationsbeschreibung}}

Zentrale Herausforderung:
{{zentrale_herausforderung}}

Entwicklungsziel:
{{entwicklungsziel}}

---

ANALYSE DER AUSGANGSLAGE:

1. Prüfe die Selbstcheck-Werte:

   WENN viele ICH-Ebene-Werte (Q1-Q3) unter 5:
   → Die Führungskraft sollte erst bei sich selbst anfangen
   → Fokus: Eigene Kompetenz aufbauen, bevor sie andere mitnimmt
   → Frage: "Was brauchst DU, um sicherer zu werden?"

   WENN ICH-Ebene solide (≥6), aber ICH→TEAM niedrig (Q4-Q6):
   → Die Führungskraft ist selbst fit, aber unsicher in der Vermittlung
   → Fokus: Kommunikation, Motivation, Umgang mit Widerständen
   → Frage: "Wie kannst du dein Wissen weitergeben?"

   WENN ICH-Ebene und ICH→TEAM solide, aber STRUKTUREN niedrig (Q7-Q9):
   → Das Wollen ist da, aber die Rahmenbedingungen fehlen
   → Fokus: Zeit schaffen, Routinen etablieren, Freiräume erkämpfen
   → Frage: "Was müsste sich strukturell ändern?"

   WENN alles solide, aber WISSEN & ANWENDUNG niedrig (Q10-Q12):
   → Haltung stimmt, aber konkrete Anwendungsfälle fehlen
   → Fokus: Use Cases identifizieren, Pilotprojekte starten
   → Frage: "Wo könntet ihr morgen anfangen?"

2. Prüfe die Entwicklungssituation:

   Achte auf Hinweise zu:
   - Veränderungsdruck (hoch/niedrig)
   - Lernengagement (hoch/niedrig)
   - Emotionale Lage (Angst, Neugier, Widerstand, Überforderung)

   Passe deinen Ton und deine Vorschläge entsprechend an.

3. Prüfe die Headline:

   Die Headline zeigt die emotionale Grundhaltung:
   - Positiv → Energie nutzen, ins Handeln bringen
   - Neutral → Orientierung geben, Klarheit schaffen
   - Skeptisch → Ernst nehmen, nicht überreden, Raum für Bedenken

---

INTERAKTIONS-STIL:

GRUNDHALTUNG:
- Wertschätzend und auf Augenhöhe
- Neugierig fragend, nicht belehrend
- Konkret und handlungsorientiert
- Ehrlich, auch wenn es unbequem ist

STRUKTUR DEINER ANTWORTEN:

1. WÜRDIGUNG (kurz)
   Was siehst du in den Daten? Was fällt auf?
   Keine Lobhudelei, sondern ehrliche Beobachtung.

2. FOKUS-VORSCHLAG
   Basierend auf der Analyse: Wo würdest du ansetzen?
   Begründe kurz, warum dieser Fokus sinnvoll ist.

3. REFLEXIONSFRAGEN (2-3)
   Fragen, die zum Weiterdenken einladen.
   Nicht rhetorisch, sondern echt interessiert.

4. HANDLUNGSIMPULS
   Ein konkreter, kleiner nächster Schritt.
   So klein, dass er in den nächsten 7 Tagen machbar ist.

5. ANGEBOT
   "Soll ich...?"
   - ...einen Gesprächsleitfaden für die Situation entwickeln?
   - ...Argumente für/gegen XY durchdenken?
   - ...einen Plan für die nächsten 4 Wochen skizzieren?

WICHTIG:
- Stelle IMMER Rückfragen, bevor du zu viel annimmst
- Biete Optionen an, entscheide nicht für die Person
- Wenn die Daten widersprüchlich sind: Sprich es an
- Wenn etwas unklar ist: Frag nach

---

DAS KANN ICH:
- Strukturieren und sortieren helfen
- Reflexionsfragen stellen
- Perspektiven anbieten
- Konkrete Handlungsideen vorschlagen
- Gesprächsleitfäden entwickeln
- Argumente durchdenken

DAS KANN ICH NICHT:
- Entscheiden, was richtig ist
- Menschen einschätzen, die ich nicht kenne
- Garantieren, dass etwas funktioniert
- Ersetzen: echte Gespräche, echte Beziehungen, echtes Zuhören

WICHTIGER HINWEIS:
Die Daten, die du mir gibst, sind DEINE Interpretation der
Situation. Sie sind wertvoll als Ausgangspunkt, aber sie sind
nicht die volle Wahrheit. Bleib offen dafür, dass die Realität
komplexer ist.

---

Am Ende jeder Interaktion:
- Fasse zusammen, was ihr erarbeitet habt
- Benenne den konkreten nächsten Schritt
- Frag: "Passt das für dich? Was würdest du anpassen?"
- Erinnere: "Du entscheidest, was du daraus machst."

---

Bitte starte jetzt mit deiner Analyse und deinem ersten Impuls.`;

const STORAGE_KEY = 'leadingAIChange_data';
const TOTAL_STEPS = 6;

const initialFormData: FormData = {
  headline: '',
  eigeneNutzung: 3,
  erwartungOrganisation: 3,
  q1: 5,
  q2: 5,
  q3: 5,
  q4: 5,
  q5: 5,
  q6: 5,
  q7: 5,
  q8: 5,
  q9: 5,
  q10: 5,
  q11: 5,
  q12: 5,
  erkenntnisseAustausch: '',
  situationsbeschreibung: '',
  zentraleHerausforderung: '',
  entwicklungsziel: '',
};

const ACCESS_PASSWORD = 'leadingaichangegiz';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [promptOutput, setPromptOutput] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [copyButtonState, setCopyButtonState] = useState<'default' | 'copied'>('default');
  const [logoError, setLogoError] = useState(false);
  const [selectedMode, setSelectedMode] = useState<PromptMode | null>(null);
  const [showResponsibilityModal, setShowResponsibilityModal] = useState(false);
  const [pendingMode, setPendingMode] = useState<PromptMode | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ACCESS_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback(() => {
    const dataToSave = { ...formData, currentStep };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, [formData, currentStep]);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage();
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, saveToStorage]);

  // Update form data
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

  // Show responsibility modal before generating prompt
  const handleModeSelect = (mode: PromptMode) => {
    setPendingMode(mode);
    setShowResponsibilityModal(true);
  };

  // Generate prompt and copy to clipboard after user confirms
  const confirmAndGenerate = async () => {
    if (!pendingMode) return;

    const eigeneNutzungLabel = verortungLabels.eigeneNutzung[formData.eigeneNutzung as keyof typeof verortungLabels.eigeneNutzung];
    const erwartungOrgLabel = verortungLabels.erwartungOrganisation[formData.erwartungOrganisation as keyof typeof verortungLabels.erwartungOrganisation];

    // Select template based on mode
    let template: string;
    switch (pendingMode) {
      case 'coach':
        template = coachPromptTemplate;
        break;
      case 'impuls':
        template = impulsPromptTemplate;
        break;
      case 'rohdaten':
        template = rohdatenPromptTemplate;
        break;
      case 'kompakt':
        template = kompaktPromptTemplate;
        break;
      default:
        template = coachPromptTemplate;
    }

    // Create current date for rohdaten mode
    const now = new Date();
    const datum = now.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const prompt = template
      .replace('{{datum}}', datum)
      .replace('{{headline}}', formData.headline || '(nicht angegeben)')
      .replace('{{eigene_nutzung}}', String(formData.eigeneNutzung))
      .replace('{{eigene_nutzung_label}}', eigeneNutzungLabel)
      .replace('{{erwartung_organisation}}', String(formData.erwartungOrganisation))
      .replace('{{erwartung_organisation_label}}', erwartungOrgLabel)
      .replace('{{q1}}', String(formData.q1))
      .replace('{{q2}}', String(formData.q2))
      .replace('{{q3}}', String(formData.q3))
      .replace('{{q4}}', String(formData.q4))
      .replace('{{q5}}', String(formData.q5))
      .replace('{{q6}}', String(formData.q6))
      .replace('{{q7}}', String(formData.q7))
      .replace('{{q8}}', String(formData.q8))
      .replace('{{q9}}', String(formData.q9))
      .replace('{{q10}}', String(formData.q10))
      .replace('{{q11}}', String(formData.q11))
      .replace('{{q12}}', String(formData.q12))
      .replace('{{erkenntnisse_austausch}}', formData.erkenntnisseAustausch || '(nicht angegeben)')
      .replace('{{situationsbeschreibung}}', formData.situationsbeschreibung || '(nicht angegeben)')
      .replace('{{zentrale_herausforderung}}', formData.zentraleHerausforderung || '(nicht angegeben)')
      .replace('{{entwicklungsziel}}', formData.entwicklungsziel || '(nicht angegeben)');

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setSelectedMode(pendingMode);
    setPromptOutput(prompt);
    setShowResponsibilityModal(false);
    setPendingMode(null);
    setCopyButtonState('copied');
    setTimeout(() => setCopyButtonState('default'), 3000);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy prompt (for re-copying from step 6)
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptOutput);
      setCopyButtonState('copied');
      setTimeout(() => setCopyButtonState('default'), 3000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = promptOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyButtonState('copied');
      setTimeout(() => setCopyButtonState('default'), 3000);
    }
  };

  // Download prompt
  const downloadPrompt = () => {
    const blob = new Blob([promptOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Leading_AI_Change_Prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset all
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowResetModal(false);
    setPromptOutput('');
    setSelectedMode(null);
  };

  // Get slider display for self-check sliders
  const getSelfCheckSliderDisplay = (value: number) => {
    let color: string, label: string;
    if (value <= 3) {
      color = '#EF4444';
      label = 'Ausbaufähig';
    } else if (value <= 6) {
      color = '#F59E0B';
      label = 'Im Aufbau';
    } else {
      color = '#10B981';
      label = 'Gut aufgestellt';
    }
    return { color, label };
  };

  // Get slider background style
  const getSliderBackground = (value: number, max: number, color: string) => {
    const percent = ((value - (max === 5 ? 1 : 0)) / (max === 5 ? 4 : max)) * 100;
    return `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, #E2E8F0 ${percent}%, #E2E8F0 100%)`;
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '1rem'
      }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Image
              src="/logo.png"
              alt="Chili and Change"
              width={150}
              height={50}
              style={{ margin: '0 auto' }}
              priority
            />
          </div>
          <h1 className="card-title" style={{ fontSize: '1.5rem' }}>Führungscockpit</h1>
          <p style={{ color: 'var(--text-medium)', marginBottom: '1rem' }}>Leading AI Change</p>
          <p className="card-subtitle">Bitte gib das Zugangspasswort ein</p>

          <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
            <input
              type="password"
              className="input-text"
              placeholder="Passwort"
              value={passwordInput}
              onChange={e => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              style={{
                textAlign: 'center',
                borderColor: passwordError ? '#EF4444' : undefined
              }}
              autoFocus
            />
            {passwordError && (
              <p style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Falsches Passwort
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Zugang
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo-placeholder">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="Chili and Change"
              width={120}
              height={40}
              className="logo"
              onError={() => setLogoError(true)}
              priority
            />
          ) : (
            <span>Chili and Change</span>
          )}
        </div>
        <div className="progress-container">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`progress-step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
              onClick={() => {
                if (step <= currentStep) {
                  setCurrentStep(step);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{ cursor: step <= currentStep ? 'pointer' : 'default' }}
              title={step <= currentStep ? `Zu Schritt ${step}` : ''}
            />
          ))}
          <span className="progress-text">Schritt {currentStep} von 6</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <section className="step-section active">
            <div className="card">
              <div className="welcome-icon">🌶️</div>
              <h1 className="card-title">Willkommen in deinem Führungscockpit</h1>
              <p className="card-subtitle">Dein persönlicher Begleiter für das Zirkeltraining &quot;Leading AI Change&quot;</p>

              <div className="help-box" style={{ marginBottom: '1.5rem' }}>
                <div className="help-box-title">🎯 Lernziele dieser Session</div>
                <ul>
                  <li>Die eigene Rolle im KI-Wandel reflektieren</li>
                  <li>Eine konkrete Führungsherausforderung identifizieren</li>
                  <li>Ein Führungssignal für den nächsten Schritt entwickeln</li>
                </ul>
              </div>

              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span><strong>Selbstcheck:</strong> Reflektiere deine Ausgangslage und Führungsrolle</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span><strong>Dokumentation:</strong> Halte deine Erkenntnisse aus dem Zirkeltraining fest</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span><strong>KI-Assistent:</strong> Generiere deinen persönlichen Führungsbegleiter für die Zeit nach dem Training</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="headline">Deine Headline (optional)</label>
                <p className="form-hint">Falls du eine Zeitungs-Schlagzeile aus dem Check-in hast, trage sie hier ein.</p>
                <input
                  type="text"
                  id="headline"
                  className="input-text"
                  placeholder="z.B. 'Führungskraft entdeckt KI als Verbündeten'"
                  value={formData.headline}
                  onChange={e => updateField('headline', e.target.value)}
                />
              </div>

              <div className="btn-container">
                <div></div>
                <button className="btn btn-primary" onClick={nextStep}>Los geht&apos;s →</button>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Verortung */}
        {currentStep === 2 && (
          <section className="step-section active">
            <div className="card">
              <h2 className="card-title">Verortung</h2>
              <p className="card-subtitle">Wo stehst du und deine Organisation beim Thema KI?</p>

              <div className="slider-container">
                <label className="slider-label">Eigene KI-Nutzung im Arbeitsalltag</label>
                <div className="slider-wrapper verortung-slider">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.eigeneNutzung}
                    className="slider"
                    onChange={e => updateField('eigeneNutzung', parseInt(e.target.value))}
                    style={{ background: getSliderBackground(formData.eigeneNutzung, 5, '#FE1230') }}
                  />
                  <span className="slider-value verortung-value">
                    <strong>{formData.eigeneNutzung}</strong> – {verortungLabels.eigeneNutzung[formData.eigeneNutzung as keyof typeof verortungLabels.eigeneNutzung]}
                  </span>
                </div>
                <div className="slider-scale">
                  <span>1 – Nutze ich gar nicht</span>
                  <span>5 – Gestaltend</span>
                </div>
              </div>

              <div className="slider-container">
                <label className="slider-label">Wahrgenommene Erwartung / Zug aus der Organisation</label>
                <div className="slider-wrapper verortung-slider">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.erwartungOrganisation}
                    className="slider"
                    onChange={e => updateField('erwartungOrganisation', parseInt(e.target.value))}
                    style={{ background: getSliderBackground(formData.erwartungOrganisation, 5, '#FE1230') }}
                  />
                  <span className="slider-value verortung-value">
                    <strong>{formData.erwartungOrganisation}</strong> – {verortungLabels.erwartungOrganisation[formData.erwartungOrganisation as keyof typeof verortungLabels.erwartungOrganisation]}
                  </span>
                </div>
                <div className="slider-scale">
                  <span>1 – Kaum Thema</span>
                  <span>5 – Strategischer Fokus</span>
                </div>
              </div>

              <div className="btn-container">
                <button className="btn btn-secondary" onClick={prevStep}>← Zurück</button>
                <div>
                  <button className="btn-skip" onClick={nextStep}>Überspringen</button>
                  <button className="btn btn-primary" onClick={nextStep}>Weiter →</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Selbstcheck */}
        {currentStep === 3 && (
          <section className="step-section active">
            <div className="card">
              <h2 className="card-title">Selbstcheck: Meine Führungsrolle</h2>
              <p className="card-subtitle">Bewerte dich selbst auf einer Skala von 0 bis 10.</p>

              <div className="help-box">
                <div className="help-box-title">💡 Hinweis</div>
                <p>10 = Gut aufgestellt · 0 = Potenzial zur Verbesserung</p>
              </div>

              {/* ICH-Ebene */}
              <div className="category-header">ICH-Ebene</div>

              {[
                { id: 'q1', label: '1. Mir fällt es selbst leicht, mit Veränderungen (meiner Rolle) umzugehen, mich anzupassen und weiterzuentwickeln.' },
                { id: 'q2', label: '2. Ich baue (Grundlagen-)Kompetenzen im Bereich der Künstlichen Intelligenz auf oder verfüge bereits über diese.' },
                { id: 'q3', label: '3. Ich nehme mir Zeit für die eigene Weiterentwicklung und Selbstreflexion.' },
              ].map(({ id, label }) => {
                const value = formData[id as keyof FormData] as number;
                const display = getSelfCheckSliderDisplay(value);
                return (
                  <div key={id} className="slider-container">
                    <label className="slider-label">{label}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        className="slider"
                        onChange={e => updateField(id as keyof FormData, parseInt(e.target.value))}
                        style={{ background: getSliderBackground(value, 10, display.color) }}
                      />
                      <span className="slider-value" style={{ color: display.color }}>
                        {value} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: display.color }}>· {display.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* ICH → TEAM */}
              <div className="category-header">ICH → TEAM</div>

              {[
                { id: 'q4', label: '4. Ich weiß genau, wie ich mein Team für das Thema Künstliche Intelligenz motivieren und begeistern kann.' },
                { id: 'q5', label: '5. Ich kenne die Ängste, Vorbehalte und offenen Fragen, die in meinem Team hinsichtlich Künstlicher Intelligenz bestehen und weiß mit diesen proaktiv umzugehen.' },
                { id: 'q6', label: '6. Ich fördere Eigenverantwortung und Empowerment in meinem Team, statt Kontrolle auszuüben.' },
              ].map(({ id, label }) => {
                const value = formData[id as keyof FormData] as number;
                const display = getSelfCheckSliderDisplay(value);
                return (
                  <div key={id} className="slider-container">
                    <label className="slider-label">{label}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        className="slider"
                        onChange={e => updateField(id as keyof FormData, parseInt(e.target.value))}
                        style={{ background: getSliderBackground(value, 10, display.color) }}
                      />
                      <span className="slider-value" style={{ color: display.color }}>
                        {value} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: display.color }}>· {display.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* STRUKTUREN & RAHMENBEDINGUNGEN */}
              <div className="category-header">STRUKTUREN & RAHMENBEDINGUNGEN</div>

              {[
                { id: 'q7', label: '7. Mein Team hat Zeit, sich mit den neuen Möglichkeiten von KI auseinanderzusetzen und relevantes Wissen anzueignen.' },
                { id: 'q8', label: '8. Wir haben in unserem Team Routinen oder Strukturen etabliert, die den Austausch von Wissen und Best Practices ermöglichen.' },
                { id: 'q9', label: '9. Ich schaffe Räume, in denen Neues ausprobiert und gelernt werden kann.' },
              ].map(({ id, label }) => {
                const value = formData[id as keyof FormData] as number;
                const display = getSelfCheckSliderDisplay(value);
                return (
                  <div key={id} className="slider-container">
                    <label className="slider-label">{label}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        className="slider"
                        onChange={e => updateField(id as keyof FormData, parseInt(e.target.value))}
                        style={{ background: getSliderBackground(value, 10, display.color) }}
                      />
                      <span className="slider-value" style={{ color: display.color }}>
                        {value} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: display.color }}>· {display.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* WISSEN & ANWENDUNG */}
              <div className="category-header">WISSEN & ANWENDUNG</div>

              {[
                { id: 'q10', label: '10. Ich kenne mögliche Use Cases Künstlicher Intelligenz für mein Unternehmen oder Team.' },
                { id: 'q11', label: '11. Mir ist klar, welche der Aufgaben in meinem Team potentiell von einer KI übernommen werden können – oder eine KI mein Team unterstützen kann.' },
                { id: 'q12', label: '12. Mir ist bewusst, welche ethischen und gesetzlichen Richtlinien für mein Unternehmen/Team im Kontext des Einsatzes Künstlicher Intelligenz relevant sind.' },
              ].map(({ id, label }) => {
                const value = formData[id as keyof FormData] as number;
                const display = getSelfCheckSliderDisplay(value);
                return (
                  <div key={id} className="slider-container">
                    <label className="slider-label">{label}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        className="slider"
                        onChange={e => updateField(id as keyof FormData, parseInt(e.target.value))}
                        style={{ background: getSliderBackground(value, 10, display.color) }}
                      />
                      <span className="slider-value" style={{ color: display.color }}>
                        {value} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: display.color }}>· {display.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="btn-container">
                <button className="btn btn-secondary" onClick={prevStep}>← Zurück</button>
                <button className="btn btn-primary" onClick={nextStep}>Weiter →</button>
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Erkenntnisse */}
        {currentStep === 4 && (
          <section className="step-section active">
            <div className="card">
              <h2 className="card-title">Erkenntnisse aus dem Austausch</h2>
              <p className="card-subtitle">Was nimmst du aus dem Gespräch mit deiner Kleingruppe mit?</p>

              <div className="form-group">
                <label className="form-label" htmlFor="erkenntnisseAustausch">Notiere 2-3 Erkenntnisse:</label>
                <textarea
                  id="erkenntnisseAustausch"
                  className="textarea"
                  placeholder="z.B. 'Ich bin nicht allein mit meiner Unsicherheit' oder 'Andere haben schon Use Cases gefunden, die ich ausprobieren könnte'"
                  value={formData.erkenntnisseAustausch}
                  onChange={e => updateField('erkenntnisseAustausch', e.target.value)}
                />
              </div>

              <div className="btn-container">
                <button className="btn btn-secondary" onClick={prevStep}>← Zurück</button>
                <button className="btn btn-primary" onClick={nextStep}>Weiter →</button>
              </div>
            </div>
          </section>
        )}

        {/* Step 5: Entwicklungssituation */}
        {currentStep === 5 && (
          <section className="step-section active">
            <div className="card">
              <h2 className="card-title">Entwicklungssituation im Team</h2>
              <p className="card-subtitle">Beschreibe eine konkrete Situation in deinem Team, die du angehen möchtest.</p>

              <div className="help-box">
                <div className="help-box-title">💡 Leitfragen</div>
                <ul>
                  <li>Was beobachtest du?</li>
                  <li>Was ist die Herausforderung?</li>
                  <li>Was brauchst du als Führungskraft?</li>
                </ul>
              </div>

              <div className="warning-box">
                ⚠️ <strong>Wichtig:</strong> Bitte keine Namen nennen. Beschreibe die Situation, nicht die Person.
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="situationsbeschreibung">Entwicklungssituation</label>
                <p className="form-hint">Was beobachtest du in deinem Team?</p>
                <textarea
                  id="situationsbeschreibung"
                  className="textarea"
                  style={{ minHeight: '100px' }}
                  placeholder="z.B. 'Ein Teil des Teams ist neugierig auf KI, andere sind skeptisch...'"
                  value={formData.situationsbeschreibung}
                  onChange={e => updateField('situationsbeschreibung', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zentraleHerausforderung">Zentrale Herausforderung</label>
                <p className="form-hint">Was ist der Knackpunkt? Was macht es schwierig?</p>
                <textarea
                  id="zentraleHerausforderung"
                  className="textarea"
                  style={{ minHeight: '100px' }}
                  placeholder="z.B. 'Es fehlt an Zeit und klaren Use Cases für den Einstieg...'"
                  value={formData.zentraleHerausforderung}
                  onChange={e => updateField('zentraleHerausforderung', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="entwicklungsziel">Entwicklungsziel</label>
                <p className="form-hint">Wo soll es hingehen? Was wäre ein gutes Ergebnis?</p>
                <textarea
                  id="entwicklungsziel"
                  className="textarea"
                  style={{ minHeight: '100px' }}
                  placeholder="z.B. 'Das Team probiert gemeinsam erste KI-Tools aus und tauscht sich regelmäßig aus...'"
                  value={formData.entwicklungsziel}
                  onChange={e => updateField('entwicklungsziel', e.target.value)}
                />
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                  Wähle deinen Modus
                </h3>
                <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Wie möchtest du mit deinen Reflexionen weiterarbeiten?
                </p>

                <div className="mode-selection">
                  <button
                    className="mode-card mode-card-secondary"
                    onClick={() => handleModeSelect('kompakt')}
                  >
                    <span className="mode-icon">🏢</span>
                    <span className="mode-title">Kompakt</span>
                    <span className="mode-description">
                      Optimiert für einfachere KI-Systeme
                    </span>
                    <span className="mode-hint">Kurz, klar, auf den Punkt.</span>
                    <span className="mode-engine">Ab GPT-3.5 · Copilot · Gemini Flash</span>
                  </button>

                  <button
                    className="mode-card"
                    onClick={() => handleModeSelect('impuls')}
                  >
                    <span className="mode-icon">⚡</span>
                    <span className="mode-title">Impuls-Modus</span>
                    <span className="mode-description">
                      Schnelle Orientierung – direkt, handlungsorientiert
                    </span>
                    <span className="mode-hint">Gut, wenn du direkt ins Tun kommen willst.</span>
                    <span className="mode-engine">GPT-4 · Claude 3 Sonnet · Gemini Pro</span>
                  </button>

                  <button
                    className="mode-card"
                    onClick={() => handleModeSelect('coach')}
                  >
                    <span className="mode-icon">🪞</span>
                    <span className="mode-title">Coach-Modus</span>
                    <span className="mode-description">
                      Reflexion & Vertiefung – fragend, systemisch
                    </span>
                    <span className="mode-hint">Gut, wenn du sortieren und tiefer verstehen willst.</span>
                    <span className="mode-engine">GPT-4 · Claude 3 · Gemini Pro</span>
                  </button>

                  <button
                    className="mode-card mode-card-secondary"
                    onClick={() => handleModeSelect('rohdaten')}
                  >
                    <span className="mode-icon">📊</span>
                    <span className="mode-title">Meine Rohdaten</span>
                    <span className="mode-description">
                      Nur die Daten – für eigene Nutzung
                    </span>
                    <span className="mode-hint">Für eigene Notizen, Gespräche oder freie KI-Nutzung.</span>
                    <span className="mode-engine">Beliebig · ohne KI nutzbar</span>
                  </button>
                </div>
              </div>

              <div className="btn-container" style={{ marginTop: '1.5rem' }}>
                <button className="btn btn-secondary" onClick={prevStep}>← Zurück</button>
                <div></div>
              </div>
            </div>
          </section>
        )}

        {/* Step 6: Prompt Output */}
        {currentStep === 6 && (
          <section className="step-section active">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem' }}>
                  {selectedMode === 'coach' && '🪞'}
                  {selectedMode === 'impuls' && '⚡'}
                  {selectedMode === 'rohdaten' && '📊'}
                  {selectedMode === 'kompakt' && '🏢'}
                </span>
                <h2 className="card-title" style={{ marginBottom: 0 }}>
                  {selectedMode === 'coach' && 'Coach-Modus'}
                  {selectedMode === 'impuls' && 'Impuls-Modus'}
                  {selectedMode === 'rohdaten' && 'Meine Rohdaten'}
                  {selectedMode === 'kompakt' && 'Kompakt-Modus'}
                </h2>
              </div>
              <p className="card-subtitle">
                {selectedMode === 'rohdaten'
                  ? 'Deine strukturierten Reflexionsdaten – zum Speichern oder Weiterverwenden.'
                  : selectedMode === 'kompakt'
                  ? 'Optimiert für einfachere KI-Systeme wie Copilot oder GPT-3.5.'
                  : 'Kopiere diesen Prompt und füge ihn in deinen KI-Assistenten ein.'}
              </p>

              {selectedMode !== 'rohdaten' && (
                <div className="help-box">
                  <div className="help-box-title">💡 Tipp</div>
                  <p>Du kannst den Prompt vor dem Kopieren noch anpassen.</p>
                </div>
              )}

              <div className="warning-box" style={{ background: 'rgba(0, 97, 247, 0.05)', borderLeftColor: 'var(--ocean-blue)' }}>
                <strong>✋ Human-in-the-Loop Check</strong>
                <p style={{ margin: '0.5rem 0 0.75rem 0', fontSize: '0.85rem' }}>Bevor du {selectedMode === 'rohdaten' ? 'die Daten weitergibst' : 'den Prompt in einen KI-Assistenten eingibst'}, prüfe:</p>
                <ol style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Personen raus?</strong><br />Sind Namen, Kontaktdaten oder andere Infos drin, mit denen jemand identifizierbar ist? → Anonymisieren oder streichen.</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Würde ich das einem Fremden zeigen?</strong><br />Stehen hier Geschäftsgeheimnisse, Strategien oder vertrauliche Zahlen drin? → Raus damit.</li>
                  <li><strong>Sage ich später, dass KI beteiligt war?</strong><br />Wenn das Ergebnis weitergegeben wird: Sei transparent darüber, dass ein KI-Tool mitgewirkt hat.</li>
                </ol>
              </div>

              <textarea
                id="promptOutput"
                className="prompt-textarea"
                value={promptOutput}
                onChange={e => setPromptOutput(e.target.value)}
              />

              <div className="footer-actions">
                <button
                  className="btn btn-success"
                  onClick={copyPrompt}
                  style={copyButtonState === 'copied' ? { background: '#10B981' } : {}}
                >
                  {copyButtonState === 'default' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  <span>{copyButtonState === 'default' ? 'Prompt kopieren' : 'Kopiert!'}</span>
                </button>
                <button className="btn btn-outline" onClick={downloadPrompt}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Als .txt herunterladen
                </button>
              </div>

              <div className="btn-container">
                <button className="btn btn-secondary" onClick={prevStep}>← Zurück zum Bearbeiten</button>
                <div></div>
              </div>

              <div className="reset-container">
                <button className="btn-reset" onClick={() => setShowResetModal(true)}>Alle Eingaben zurücksetzen</button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Feedback zu diesem Tool? <a href="mailto:nico@chili-and-change.de?subject=Feedback%20Führungscockpit" style={{ color: 'var(--ocean-blue)' }}>Schreib uns!</a>
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Chili and Change</h4>
            <a href="https://www.chili-and-change.de" target="_blank" rel="noopener noreferrer">Webseite</a>
            <span style={{ margin: '0 0.5rem', color: 'var(--text-light)' }}>·</span>
            <a href="https://t9dd5820b.emailsys1a.net/204/693/1ffdc28d7b/subscribe/form.html?_g=1762792068" target="_blank" rel="noopener noreferrer">Newsletter</a>
            <span style={{ margin: '0 0.5rem', color: 'var(--text-light)' }}>·</span>
            <a href="https://chili-and-change.de/impressum/" target="_blank" rel="noopener noreferrer">Impressum</a>
          </div>
          <div className="footer-col">
            <h4>🇪🇺 EU AI Act</h4>
            <a href="http://data.europa.eu/eli/reg/2024/1689" target="_blank" rel="noopener noreferrer">Zur aktuellen Fassung</a>
          </div>
          <div className="footer-col">
            <h4>Haftungsausschluss</h4>
            <p>Dieses Tool dient als Reflexionshilfe. Für die Richtigkeit der KI-generierten Inhalte wird keine Haftung übernommen.</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Chili and Change. Alle Rechte vorbehalten.
        </div>
      </footer>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>Datenschutz: Alle Daten bleiben lokal in deinem Browser gespeichert – keine Serverübertragung.</span>
      </div>

      {/* Saved Indicator */}
      <div className={`saved-indicator ${showSaved ? 'show' : ''}`}>✓ Gespeichert</div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && setShowResetModal(false)}>
          <div className="modal">
            <h3 className="modal-title">Wirklich zurücksetzen?</h3>
            <p className="modal-text">Alle deine Eingaben werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="modal-buttons">
              <button className="btn btn-outline" onClick={() => setShowResetModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={resetAll}>Ja, zurücksetzen</button>
            </div>
          </div>
        </div>
      )}

      {/* Responsibility Modal - appears BEFORE copying */}
      {showResponsibilityModal && (
        <div className="modal-overlay show">
          <div className="modal" style={{ maxWidth: '520px', textAlign: 'left' }}>
            <h3 className="modal-title" style={{ color: 'var(--chili-red)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Bevor du loslegst
            </h3>
            <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                Ab hier liegt die Verantwortung bei dir.
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-medium)', lineHeight: '1.8' }}>
                <li>KI-Ergebnisse sind nie zu 100% vorhersehbar</li>
                <li>Die Qualität hängt davon ab, wie du weiterarbeitest – nachfragst, präzisierst, kritisch prüfst</li>
                <li>Nutze die Outputs als Denkanstoß, nicht als fertige Lösung</li>
                <li>Gib keine sensiblen personenbezogenen Daten ein</li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                Dieses Gespräch wird nicht gespeichert, protokolliert oder für andere Zwecke verwendet.
              </p>
            </div>
            <div className="modal-buttons" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => { setShowResponsibilityModal(false); setPendingMode(null); }}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={confirmAndGenerate}>
                ✓ Verstanden – Prompt kopieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
