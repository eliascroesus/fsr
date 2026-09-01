export interface LeadDetails {
  fullName: string;
  email: string;
  phone: string;
  declinedPhone: boolean;
}

export type TicketTier = 'general' | 'vip';

export interface TicketOption {
  id: TicketTier;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  perks: string[];
  badge?: string;
}
