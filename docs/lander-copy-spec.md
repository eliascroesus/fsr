# Lander — complete copy & layout spec

Every piece of text on the page, in the order it appears, with its placement and
type treatment. Values were read from the rendered page via computed styles, not
transcribed by hand.

- **Language:** Swedish (`<html lang="sv">`)
- **Offer:** high ticket closing. Visitor takes a 4-question test, leaves their
  details, then books a call. A free 1-hour course is the incentive.
- **Route:** `/workshop-v-test` · **Page title:** `FSR`
- **Layout:** single column, everything centred, max content width 1024px
  (`max-w-5xl`), 24px top padding at every width.

---

## Design tokens

| Token | Value | Used for |
| --- | --- | --- |
| Accent | `#4fd12f` | underline rules, dots, selected borders, gradient bottom |
| Accent light | `#a8f76b` | small-caps labels, pill text, gradient top |
| Page ground | `#000000` | body |
| Card ink | `#0f1113` | cards, pills |
| Field ink | `#0a0c0d` | inputs |
| Selected tint | `#1e2a12` | active step, chosen option |
| Border | `#2f343a` | all card and input borders |
| Body text | `#ffffff` at 100 / 75 / 60 / 45 / 40% | hierarchy below headings |
| CTA gradient | `rgb(74,180,56)` → `rgb(95,214,62)` → `rgb(168,247,107)`, left→right | primary buttons (black text) |

**Typeface:** Geist (all weights), letter-spacing `normal` everywhere except
small-caps labels.

**Fluid type:** the headline and subhead scale continuously with viewport width
via `clamp()`. Sizes below are given as **desktop (1200px) / mobile (390px)**.

---

## 1. Status pills — top of page

Two joined pills, centred, 24px from the top of the page.

| Text | Size | Weight | Colour | Notes |
| --- | --- | --- | --- | --- |
| `NY` | 12 / 10px | 900 | `#ffffff` | uppercase, tracking `0.14em`, preceded by a pulsing 6px `#98dd29` dot |
| `High Ticket Closing` | 12 / 10px | 900 | `#ceff62` | uppercase, tracking `0.14em`, on `#1e2a12` |

---

## 2. Headline — H1

Centred, balanced wrapping. **52.4 / 27.3px**, weight **800**, line-height
**1.06** (55.5px at desktop), letter-spacing **0**.

> Vi lär dig **High Ticket Closing** och placerar dig som closer på ett
> **erbjudande på 10 000 $**… *annars jobbar vi med dig gratis tills du är det*

Three emphasis treatments inside one heading:

| Fragment | Treatment |
| --- | --- |
| `High Ticket Closing` | white text, `#4fd12f` underline — 0.072em thick, 0.16em below baseline |
| `erbjudande på 10 000 $` | vertical gradient `#a8f76b` (top) → `#4fd12f` (bottom), clipped to the glyphs; glow: `drop-shadow(0 0 8px rgba(79,209,47,.32)) drop-shadow(0 0 24px rgba(79,209,47,.18))` |
| `annars jobbar vi med dig gratis tills du är det` | italic (synthesised oblique — Geist has no italic axis) |

`10 000 $` uses non-breaking spaces so the figure never splits across lines.

---

## 3. Sub-headline

Centred, max width 576px, **16.5 / 13.2px**, line-height 1.5. Four fragments on
one line, three weights:

| Fragment | Weight | Colour |
| --- | --- | --- |
| `Ingen egen produkt.` | 700 | white 75% |
| `Inga annonser.` | 700 | white 75% |
| `Jobba hemifrån.` | 700 | white 75% |
| `Ingen säljerfarenhet krävs.` | 500, italic | white 60% |
| `På samtalet visar vi exakt var just du ska börja.` | 400 | white 45% |

---

## 4. Social proof pill

Centred pill, three overlapping 32px avatars on the left.

| Text | Size | Weight | Colour |
| --- | --- | --- | --- |
| `178 nybörjare anmälde sig den här veckan` | 14 / 12px | 700 | `#a8f76b` |

---

## 5. Video block

16:9 frame, full content width (max 768px). Starts ~416px down on desktop,
~457px on mobile — deliberately inside the first screen so a visitor sees there
is a video without scrolling.

The Cinema8 player (`<cinema8-player media-id="oJKx7gbO">`) fills the frame and
owns its own play and unmute controls. Nothing is layered on top — an overlay
there only swallowed the click.

---

## 6. Step indicator

Three equal cells in one rounded bar. Number badge above a label.

| Cell | Label | Number | State |
| --- | --- | --- | --- |
| 1 | `Snabbtest` | 1 | active: `#4fd12f` badge, black number, white label, `#1e2a12` cell |
| 2 | `Dina uppgifter` | 2 | inactive: white 45% number, white 40% label |
| 3 | `Boka samtal` | 3 | inactive |

Labels: **14 / 9px**, weight 900, uppercase. Numbers: 14 / 10px, weight 900.

---

## 7. STEP 1 — The test

One question per screen. Choosing an option advances automatically after 280ms;
letter keys (A–E) also select. A `Tillbaka` link appears from question 2.

Progress bar (2px, `#98dd29`) sits flush along the card's top edge.

**Per-question chrome**

| Element | Text | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Counter badge | `1`–`4` | 12 / 10px | 900 | black on `#98dd29` |
| Counter label | `Fråga N av 4` | 12 / 10px | 900 | white 40%, uppercase, tracking `0.18em` |
| Question | see below | 24 / 18px | 800 | white |
| Required mark | `*` | 24 / 18px | 800 | `#98dd29` |
| Helper text | see below | 14 / 12px | 400 | white 55% |
| Option key | `A`–`E` | 12px | 900 | white 50% (selected: black on `#98dd29`) |
| Option label | see below | 16 / 14px | 600 | white |
| Back link | `Tillbaka` | 14 / 12px | 500 | white 45% |

### Question 1
**Vad beskriver dig bäst?**
*Vi frågar för att kunna hjälpa dig att nå dina mål på bästa sätt.*

- **A** — Jag har ett 8–17-jobb
- **B** — Jag driver eget företag
- **C** — Jag är student
- **D** — Jag är arbetslös

### Question 2
**Hur mycket tjänar du i månaden just nu?**
*Det visar oss vilken startpunkt i systemet som passar dig.*

- **A** — Under 2 000 $
- **B** — 2 000–5 000 $
- **C** — 5 000–10 000 $
- **D** — 10 000–25 000 $
- **E** — Över 25 000 $

### Question 3
**Vad vill du uppnå de kommande 12 månaderna?**
*Så att vi kan visa dig vägen som passar det resultat du faktiskt vill ha.*

- **A** — De första 1 000–5 000 $ i månaden vid sidan av
- **B** — Ersätta min heltidsinkomst
- **C** — Skala förbi 10 000 $ i månaden
- **D** — Bygga ett företag jag kan sälja
- **E** — Full ekonomisk frihet

### Question 4
**Hur mycket kan du investera i dig själv och de verktyg som krävs?**
*Gäller utbildning, verktyg och coachning — vi rekommenderar bara sådant som passar din nivå.*

- **A** — Under 500 $
- **B** — 500–1 000 $
- **C** — 1 000–3 000 $
- **D** — 3 000–5 000 $
- **E** — Över 5 000 $

---

## 8. STEP 2 — Details

| Element | Text | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Card heading | `VART SKICKAR VI DIN TILLGÅNG?` | 18 / 14px | 700 | white, tracking `0.2em` |
| Field 1 placeholder | `Ditt fullständiga namn här...` | 16px | 400 | grey 500 |
| Field 2 placeholder | `Din e-postadress här...*` | 16px | 400 | grey 500 — trailing mail icon |
| Field 3 | `Telefonnummer`, prefilled `+46` | 16px | 500 | Swedish flag in the country slot |
| Checkbox label | `🎁 Jag vill inte dela mitt telefonnummer och missar chansen att vinna en MacBook, iPhone eller 1 000 $` | 14 / 12px | 500 | white 75% |
| Consent | `Genom att ange ditt telefonnummer godkänner du att vi skickar sms om ditt samtal. Svara STOP när som helst för att avsluta.` | 10 / 9px | 400 | grey 500, centred |
| CTA line 1 | `BOKA ETT SAMTAL` | 20 / 16px | 800 | **black** on the green gradient |
| CTA line 2 | `FÅ GRATIS TILLGÅNG TILL VÅR 1-TIMMESKURS` | 14 / 12px | 600 | black, 90% opacity |
| Privacy | `🔒 Vi värnar om din integritet. Aldrig spam.` | 14px | 400 | grey 500, centred |

The checkbox is an **opt-out**: ticking it removes the phone requirement.

---

## 9. STEP 3 — Book a call

| Element | Text | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Check badge | ✓ in a 56px `#98dd29` circle | — | — | black glyph |
| Heading | `VÄLJ TID FÖR DITT SAMTAL` | 18 / 14px | 700 | white, tracking `0.2em` |
| Intro | `Du är med, {förnamn}. Välj en tid nedan så lägger vi upp en plan för dina första 90 dagar.` | 14 / 12px | 400 | white 60% |
| Calendar | Google Calendar appointment embed, white panel in a bordered frame, 600px tall (680px on mobile) | — | — | — |
| Fallback | `Laddar kalendern inte?` + link `Öppna bokningssidan ↗` | 12 / 11px | 400 / 600 | white 40% / `#ceff62` |

**Summary rows** — label 12px weight 900 uppercase `#ceff62`, value 14px weight 600 white:

| Label | Value |
| --- | --- |
| `Mål` | the option chosen in question 3 |
| `E-post` | their email |
| `Telefon` | their phone — row hidden if they opted out |

**Follow-up notes** (14 / 12px, weight 500, white 85%, each with an icon):

- `Din tillgång till 1-timmeskursen är på väg till {e-post} — kolla skräpposten om den inte dykt upp om ett par minuter.`
- `Vi skickar en påminnelse via sms innan ditt samtal. Svara STOP när som helst för att avsluta.` *(hidden if they opted out)*

---

## 10. Countdown

Sits **below** whichever step card is showing, so it holds one position through
the whole funnel. Counts down to the end of the visitor's own local day.

| Element | Text | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Label | `Möjligheten stänger om` | 14 / 12px | 900 | `#ceff62`, uppercase, tracking `0.22em` |
| Digits | two-digit, tabular | 36 / 30px | 700 | black on `#f3f4f6` tiles |
| Units | `timmar` · `minuter` · `sekunder` | 12 / 10px | 400 | grey 600, uppercase |

---

## 11. Bottom CTA

Full-width button, max 672px, centred, 48px below the funnel. Scrolls back up to
the test.

| Text | Size | Weight | Colour |
| --- | --- | --- | --- |
| `SE OM DU PASSAR – STARTA TESTET` | 20 / 16px | 800 | black on the green gradient |
| `4 FRÅGOR · 60 SEKUNDER · GRATIS 1-TIMMESKURS` | 14 / 12px | 600 | black, 90% opacity |

---

## 12. Footer

Centred, max width 896px, 48px logo at 50% opacity on top. All paragraphs
**12px, weight 400, `#a3a3a3`**.

1. `FSR och alla personer som är knutna till företaget tar inget ansvar för utfallet, resultatet eller framgången av tjänsterna, och garanterar inga specifika resultat. Hur det går beror bland annat på hur mycket tid du lägger ner och på hur du tillämpar den vägledning och det stöd du får. Innehållet och alla övriga funktioner är uteslutande i utbildningssyfte.`

2. `Vi kan inte lämna några garantier eller utfästelser, varken uttryckliga eller underförstådda, om resultat eller om att tjäna pengar på de metoder, den information och de strategier som ingår. Försäljning av högprisprodukter kräver eget arbete, och resultaten varierar från person till person.`

3. `Eventuella omdömen kommer från verkliga personer och beskriver deras egna individuella upplevelser. De ska inte uppfattas som typiska resultat och kommer inte att vara specifika för just dina förhållanden eller de åtgärder du väljer att vidta.`

4. `Den här sidan är inte en del av Googles webbplats, Google Inc, Facebook/Metas webbplats eller Meta, Inc. Sidan är inte heller på något sätt godkänd av Google eller Meta.`

**Links** (12px, `#a3a3a3`, hover `#4fd12f`), spaced 32px apart:
`Integritetspolicy` (`/integritetspolicy`) · `Användarvillkor` (`/anvandarvillkor`) ·
`Kontakta oss` (`mailto:support@fsr.se`) — the first two are placeholders until
the real pages exist.

**Copyright:** `© 2026 FSR. Med ensamrätt.`

---

## Reading order summary

```
┌──────────────────────────────────────┐
│  ● NY | HIGH TICKET CLOSING          │  pills, 24px from top
│                                      │
│  H1 — promise + guarantee            │  52/27px, 3 emphasis styles
│  sub — 4 fragments, 3 weights        │  16.5/13.2px
│  ◉◉◉ 178 nybörjare …                 │  social proof pill
│                                      │
│  ┌────── VIDEO 16:9 ──────┐          │  above the fold on mobile
│  └────────────────────────┘          │
│                                      │
│  [ 1 SNABBTEST | 2 UPPGIFTER | 3 BOKA ]  step indicator
│  ┌── active step card ───────┐       │  test → details → booking
│  └───────────────────────────┘       │
│  ┌── countdown ──────────────┐       │  fixed slot below the card
│  └───────────────────────────┘       │
│                                      │
│  [ SE OM DU PASSAR – STARTA TESTET ] │  bottom CTA
│  footer — 4 legal paragraphs         │
└──────────────────────────────────────┘
```
