import type { QuizQuestion } from './types';

/**
 * Qualifying questions, asked one screen at a time before the details form.
 *
 * Each option carries a letter key so it can be picked from the keyboard, the
 * way the reference form does.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'occupation',
    title: 'Which of the following describes you best?',
    description: 'The reason we are asking is so we can best help you accomplish your goals.',
    options: [
      { key: 'A', value: 'job-9-5', label: 'I work at a 9-5 job' },
      { key: 'B', value: 'business-owner', label: "I'm a business owner" },
      { key: 'C', value: 'student', label: "I'm a student" },
      { key: 'D', value: 'unemployed', label: "I'm unemployed" },
    ],
  },
  {
    id: 'current-income',
    title: 'How much are you currently earning per month?',
    description: 'This tells us which starting point of the system actually applies to you.',
    options: [
      { key: 'A', value: 'lt-2k', label: 'Less than $2,000' },
      { key: 'B', value: '2k-5k', label: '$2,000 – $5,000' },
      { key: 'C', value: '5k-10k', label: '$5,000 – $10,000' },
      { key: 'D', value: '10k-25k', label: '$10,000 – $25,000' },
      { key: 'E', value: 'gt-25k', label: '$25,000+' },
    ],
  },
  {
    id: 'goal',
    title: 'What are you looking to achieve in the next 12 months?',
    description: 'So we can show you the path that fits the outcome you actually want.',
    options: [
      { key: 'A', value: 'side-income', label: 'A first $1,000 – $5,000 per month on the side' },
      { key: 'B', value: 'replace-income', label: 'Replace my full-time income' },
      { key: 'C', value: 'scale-past-10k', label: 'Scale past $10,000 per month' },
      { key: 'D', value: 'sellable-business', label: 'Build a business I could sell' },
      { key: 'E', value: 'financial-freedom', label: 'Complete financial freedom' },
    ],
  },
  {
    id: 'investment',
    title: 'How much do you have available to invest in yourself and the tools to make it happen?',
    description: 'Covers AI tools, software and coaching — we only recommend what fits your range.',
    options: [
      { key: 'A', value: 'lt-500', label: 'Under $500' },
      { key: 'B', value: '500-1k', label: '$500 – $1,000' },
      { key: 'C', value: '1k-3k', label: '$1,000 – $3,000' },
      { key: 'D', value: '3k-5k', label: '$3,000 – $5,000' },
      { key: 'E', value: 'gt-5k', label: '$5,000+' },
    ],
  },
] as const;
