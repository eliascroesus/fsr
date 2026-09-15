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
      { key: 'A', value: 'job', label: 'Jag har ett jobb' },
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
      { key: 'A', value: 'sek-0', label: '0 kr' },
      { key: 'B', value: 'sek-0-5k', label: '0–5 000 kr' },
      { key: 'C', value: 'sek-5k-10k', label: '5 000–10 000 kr' },
      { key: 'D', value: 'sek-20k-plus', label: '20 000 kr+' },
    ],
  },
  {
    id: 'goal',
    title: 'Var vill du vara om 6 månader?',
    description: 'Svara på vad du faktiskt siktar på — inte på vad du tror är rimligt.',
    options: [
      { key: 'A', value: 'first-10k', label: 'Mina första 10 000 kr i månaden' },
      { key: 'B', value: 'at-25k', label: '25 000 kr i månaden' },
      { key: 'C', value: 'past-50k', label: 'Passera 50 000 kr i månaden' },
      { key: 'D', value: 'past-100k', label: 'Passera 100 000 kr i månaden' },
    ],
  },
  {
    id: 'investment',
    title:
      'Föreställ dig att det är om 3 månader och du redan stänger affärer — hur mycket är du beredd att investera för att komma dit?',
    description:
      'Det gäller utbildning, verktyg och coachning. Välj bara ett belopp du faktiskt har tillgång till i dag.',
    options: [
      { key: 'A', value: 'lt-5k', label: 'Under 5 000 kr' },
      { key: 'B', value: '5k-15k', label: '5 000–15 000 kr' },
      { key: 'C', value: '15k-30k', label: '15 000–30 000 kr' },
      { key: 'D', value: '30k-50k', label: '30 000–50 000 kr' },
      { key: 'E', value: 'gt-50k', label: '50 000 kr+' },
    ],
  },
] as const;
