import type { QuizQuestion } from './types';

/**
 * Kvalificerande frågor som ställs en skärm i taget innan kontaktformuläret.
 *
 * Varje svar har en bokstavstangent, så frågan kan besvaras med tangentbordet.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'occupation',
    title: 'Vad beskriver dig bäst?',
    description: 'Vi frågar för att kunna hjälpa dig att nå dina mål på bästa sätt.',
    options: [
      { key: 'A', value: 'job-9-5', label: 'Jag har ett 8–17-jobb' },
      { key: 'B', value: 'business-owner', label: 'Jag driver eget företag' },
      { key: 'C', value: 'student', label: 'Jag är student' },
      { key: 'D', value: 'unemployed', label: 'Jag är arbetslös' },
    ],
  },
  {
    id: 'current-income',
    title: 'Hur mycket tjänar du i månaden just nu?',
    description: 'Det visar oss vilken startpunkt i systemet som passar dig.',
    options: [
      { key: 'A', value: 'lt-2k', label: 'Under 2 000 $' },
      { key: 'B', value: '2k-5k', label: '2 000–5 000 $' },
      { key: 'C', value: '5k-10k', label: '5 000–10 000 $' },
      { key: 'D', value: '10k-25k', label: '10 000–25 000 $' },
      { key: 'E', value: 'gt-25k', label: 'Över 25 000 $' },
    ],
  },
  {
    id: 'goal',
    title: 'Vad vill du uppnå de kommande 12 månaderna?',
    description: 'Så att vi kan visa dig vägen som passar det resultat du faktiskt vill ha.',
    options: [
      { key: 'A', value: 'side-income', label: 'De första 1 000–5 000 $ i månaden vid sidan av' },
      { key: 'B', value: 'replace-income', label: 'Ersätta min heltidsinkomst' },
      { key: 'C', value: 'scale-past-10k', label: 'Skala förbi 10 000 $ i månaden' },
      { key: 'D', value: 'sellable-business', label: 'Bygga ett företag jag kan sälja' },
      { key: 'E', value: 'financial-freedom', label: 'Full ekonomisk frihet' },
    ],
  },
  {
    id: 'investment',
    title: 'Hur mycket kan du investera i dig själv och de verktyg som krävs?',
    description:
      'Gäller AI-verktyg, mjukvara och coachning — vi rekommenderar bara sådant som passar din nivå.',
    options: [
      { key: 'A', value: 'lt-500', label: 'Under 500 $' },
      { key: 'B', value: '500-1k', label: '500–1 000 $' },
      { key: 'C', value: '1k-3k', label: '1 000–3 000 $' },
      { key: 'D', value: '3k-5k', label: '3 000–5 000 $' },
      { key: 'E', value: 'gt-5k', label: 'Över 5 000 $' },
    ],
  },
] as const;
