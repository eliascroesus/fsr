import type { QuizQuestion } from './types';

/**
 * Kvalificerende spørgsmål, stillet ét skærmbillede ad gangen før
 * kontaktformularen.
 *
 * Hvert svar har en bogstavtast, så spørgsmålet kan besvares med tastaturet.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'occupation',
    title: 'Hvad beskriver dig bedst?',
    description: 'Vi spørger, så vi bedst muligt kan hjælpe dig med at nå dine mål.',
    options: [
      { key: 'A', value: 'job-9-5', label: 'Jeg har et 8-16 job' },
      { key: 'B', value: 'business-owner', label: 'Jeg er selvstændig' },
      { key: 'C', value: 'student', label: 'Jeg er studerende' },
      { key: 'D', value: 'unemployed', label: 'Jeg er arbejdsløs' },
    ],
  },
  {
    id: 'current-income',
    title: 'Hvor meget tjener du om måneden lige nu?',
    description: 'Det fortæller os, hvilket udgangspunkt i systemet der passer til dig.',
    options: [
      { key: 'A', value: 'lt-2k', label: 'Under $2.000' },
      { key: 'B', value: '2k-5k', label: '$2.000 – $5.000' },
      { key: 'C', value: '5k-10k', label: '$5.000 – $10.000' },
      { key: 'D', value: '10k-25k', label: '$10.000 – $25.000' },
      { key: 'E', value: 'gt-25k', label: '$25.000+' },
    ],
  },
  {
    id: 'goal',
    title: 'Hvad vil du gerne opnå de næste 12 måneder?',
    description: 'Så vi kan vise dig vejen, der passer til det resultat, du rent faktisk vil have.',
    options: [
      { key: 'A', value: 'side-income', label: 'De første $1.000 – $5.000 om måneden ved siden af' },
      { key: 'B', value: 'replace-income', label: 'Erstatte min fuldtidsindkomst' },
      { key: 'C', value: 'scale-past-10k', label: 'Skalere forbi $10.000 om måneden' },
      { key: 'D', value: 'sellable-business', label: 'Bygge en virksomhed, jeg kan sælge' },
      { key: 'E', value: 'financial-freedom', label: 'Fuldstændig økonomisk frihed' },
    ],
  },
  {
    id: 'investment',
    title: 'Hvor meget kan du investere i dig selv og de værktøjer, der skal til?',
    description:
      'Dækker AI-værktøjer, software og coaching — vi anbefaler kun noget, der passer til dit niveau.',
    options: [
      { key: 'A', value: 'lt-500', label: 'Under $500' },
      { key: 'B', value: '500-1k', label: '$500 – $1.000' },
      { key: 'C', value: '1k-3k', label: '$1.000 – $3.000' },
      { key: 'D', value: '3k-5k', label: '$3.000 – $5.000' },
      { key: 'E', value: 'gt-5k', label: '$5.000+' },
    ],
  },
] as const;
