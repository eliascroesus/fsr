export interface LeadDetails {
  fullName: string;
  email: string;
  phone: string;
  declinedPhone: boolean;
}

export interface QuizOption {
  /** Keyboard shortcut shown in the option's key badge. */
  key: string;
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  options: readonly QuizOption[];
}

/** Question id -> chosen option value. */
export type QuizAnswers = Record<string, string>;
