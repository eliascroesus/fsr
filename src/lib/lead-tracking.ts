/**
 * Client half of the lead pipeline.
 *
 * One write per lead, when the details form is submitted — the test answers
 * ride along with it. The id is stable for the tab so a double submit updates
 * the row it already wrote instead of adding a second one.
 */
export type LeadEvent = 'details_submitted';

const LEAD_ID_KEY = 'fsr.leadId';

/** `crypto.randomUUID` needs a secure context, which file:// previews are not. */
function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Stable for the tab. sessionStorage rather than localStorage: a visitor who
 * comes back tomorrow is a new lead, not an edit to yesterday's row.
 */
export function leadId(): string {
  try {
    const existing = sessionStorage.getItem(LEAD_ID_KEY);
    if (existing) return existing;
    const id = newId();
    sessionStorage.setItem(LEAD_ID_KEY, id);
    return id;
  } catch {
    // Private mode, or storage blocked. The row still gets written; it just
    // cannot be updated by a later event.
    return newId();
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function pageContext() {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return {
    pageUrl: window.location.href,
    referrer: document.referrer || '',
    userAgent: navigator.userAgent,
    utm,
  };
}

export interface LeadEventBody {
  leadId: string;
  event: LeadEvent;
  occurredAt: string;
  answers?: Record<string, string>;
  lead?: {
    fullName: string;
    email: string;
    phone: string;
    declinedPhone: boolean;
  };
  context?: ReturnType<typeof pageContext>;
}

/**
 * Fire and forget — the funnel must never wait on, or break because of, the
 * spreadsheet. `keepalive` lets the last event survive the page unloading.
 */
export function trackLead(event: LeadEvent, data: Omit<LeadEventBody, 'leadId' | 'event' | 'occurredAt' | 'context'>) {
  if (typeof window === 'undefined') return;

  const body: LeadEventBody = {
    leadId: leadId(),
    event,
    occurredAt: new Date().toISOString(),
    context: pageContext(),
    ...data,
  };

  try {
    void fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never surface a tracking failure to the visitor.
  }
}
