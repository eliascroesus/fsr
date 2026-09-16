import { NextResponse } from 'next/server';

import { QUIZ_QUESTIONS } from '@/components/workshop/quiz-questions';

/** Forwards to the sheet; never prerendered. */
export const dynamic = 'force-dynamic';

const WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.SHEETS_WEBHOOK_TOKEN;

/** The endpoint is public, so everything that reaches the sheet is bounded. */
const MAX_BODY_BYTES = 8_000;
const MAX_FIELD_LENGTH = 300;

const EVENTS = ['details_submitted'] as const;
type Event = (typeof EVENTS)[number];

/** Question id -> the column its answer belongs in. */
const ANSWER_COLUMNS: Record<string, string> = {
  occupation: 'Sysselsättning',
  'current-income': 'Inkomst i dag',
  goal: 'Mål om 6 månader',
  investment: 'Investeringsnivå',
};

const clean = (value: unknown): string =>
  typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';

/** Stores the option's label, not its value — the sheet is read by people. */
function answerLabel(questionId: string, value: string): string {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  return question?.options.find((o) => o.value === value)?.label ?? value;
}

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    // Unconfigured is not an error the visitor should ever see; the funnel
    // works without the sheet.
    return NextResponse.json({ ok: true, forwarded: false }, { status: 202 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload too large' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const event = body.event as Event;
  if (!EVENTS.includes(event)) {
    return NextResponse.json({ ok: false, error: 'unknown event' }, { status: 400 });
  }

  const id = clean(body.leadId);
  if (!id) {
    return NextResponse.json({ ok: false, error: 'missing leadId' }, { status: 400 });
  }

  const context = (body.context ?? {}) as Record<string, unknown>;
  const utm = (context.utm ?? {}) as Record<string, unknown>;
  const lead = (body.lead ?? {}) as Record<string, unknown>;
  const answers = (body.answers ?? {}) as Record<string, unknown>;

  /*
   * Keys are the sheet's column headers. Empty values are dropped rather than
   * sent, so a later event never blanks out what an earlier one wrote.
   */
  const fields: Record<string, string> = {
    Tidsstämpel: clean(body.occurredAt),
    Namn: clean(lead.fullName),
    'E-post': clean(lead.email),
    Telefon: clean(lead.phone),
    'SMS-påminnelser': lead.declinedPhone === undefined ? '' : lead.declinedPhone ? 'Nej' : 'Ja',
    Landningssida: clean(context.pageUrl),
    Hänvisning: clean(context.referrer),
    Enhet: clean(context.userAgent),
    utm_source: clean(utm.utm_source),
    utm_medium: clean(utm.utm_medium),
    utm_campaign: clean(utm.utm_campaign),
    utm_content: clean(utm.utm_content),
    utm_term: clean(utm.utm_term),
  };

  for (const [questionId, column] of Object.entries(ANSWER_COLUMNS)) {
    const value = clean(answers[questionId]);
    if (value) fields[column] = answerLabel(questionId, value);
  }

  for (const key of Object.keys(fields)) {
    if (!fields[key]) delete fields[key];
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(WEBHOOK_TOKEN ? { 'X-FSR-Token': WEBHOOK_TOKEN } : {}),
      },
      body: JSON.stringify({ leadId: id, token: WEBHOOK_TOKEN ?? '', fields }),
      // Apps Script answers in well under a second; do not hold a lambda open.
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error('[lead] sheet rejected the row', response.status, await response.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error('[lead] could not reach the sheet', error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, forwarded: true });
}
