# Lead data → Google Sheets

Every lead who submits **Dina uppgifter** lands on one row of

<https://docs.google.com/spreadsheets/d/1-T-TZ3XOQotxS8TdDGdvzxDCh8tumDgNEX--kozsXEE/edit>

carrying everything at once: the four test answers, their name, e-mail, phone
and SMS opt-in, plus where they came from. Nothing is written before that —
somebody who answers the questions and leaves without giving their details is
not recorded, so the sheet holds contactable leads rather than anonymous
half-finished tests.

No Google credentials live in the site. The page posts to its own `/api/lead`,
and that route forwards server-side to an Apps Script webhook, so the webhook
URL never reaches the browser.

```
browser → POST /api/lead → Apps Script web app → the sheet
```

## 1. Put the script on the sheet

1. Open the sheet, then **Extensions ▸ Apps Script**.
2. Replace everything in `Code.gs` with `scripts/fsr-sheet.gs` from this repo.
   The sheet id is already filled in, and it writes to the first tab.
3. Replace `PASTE_THE_SAME_TOKEN_HERE` near the top with a long random string.
   Generate one with:

   ```bash
   openssl rand -hex 24
   ```

   Keep it — step 3 needs the same value.
4. **Save**.
5. Pick **`testWrite`** from the function dropdown — the editor defaults to
   `doPost`, which only does anything when the deployed web app receives a
   request — and press **Run**. Approve the permission prompt. The sheet should
   gain a header row and one test row; delete that row afterwards. If this
   works, the hard part is done.

## 2. Deploy it as a web app

1. **Deploy ▸ New deployment ▸** gear icon **▸ Web app**.
2. *Execute as*: **Me**. *Who has access*: **Anyone**.
3. **Deploy**, then copy the **Web app URL** — `https://script.google.com/macros/s/AKfy…/exec`.

"Anyone" means anyone who knows that URL can POST to it, which is why the
script rejects any request that does not carry the token.

> Re-deploy after every edit to the script — **Deploy ▸ Manage deployments ▸**
> pencil **▸ Version: New version**. Saving alone does not change what the live
> URL runs.

## 3. Point the site at it

Two variables, neither prefixed `NEXT_PUBLIC_`, so neither is bundled into the
browser:

| Variable | Value |
| --- | --- |
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from step 2 |
| `SHEETS_WEBHOOK_TOKEN` | the same random string you put in the script |

In Netlify: **Site configuration ▸ Environment variables ▸ Add a variable**,
then **trigger a redeploy** — environment changes do not apply to the build
that is already live. Locally, put them in `.env.local`.

With `SHEETS_WEBHOOK_URL` unset the route accepts the request and does nothing,
so the funnel works untouched in development and in preview deploys.

## 4. Check it

Run the funnel on the live site: four questions, then fill in the details form
and press the button. One row should appear. If it does not:

- Open the `/exec` URL in a browser. It should return
  `{"ok":true,"service":"fsr-lead-sink"}`. Anything else means the deployment is
  not live, or you edited without re-deploying.
- Apps Script ▸ **Executions** lists every call and its error.
- Netlify ▸ **Logs ▸ Functions** shows what `/api/lead` logged. It prints
  `[lead] could not reach the sheet` or `[lead] sheet rejected the row` with the
  response body.
- A `forbidden` response means the two token values do not match.

## Columns

Written into the first tab, created automatically on the first row:

| Column | Source |
| --- | --- |
| `Tidsstämpel` | when they submitted |
| `Namn`, `E-post`, `Telefon`, `SMS-påminnelser` | the details form |
| `Sysselsättning` | question 1 |
| `Inkomst i dag` | question 2 |
| `Mål om 6 månader` | question 3 |
| `Investeringsnivå` | question 4 |
| `utm_source` … `utm_term` | the landing URL's query string |
| `Landningssida`, `Hänvisning`, `Enhet` | page URL, referrer, browser |
| `Lead-ID` | dedupes a double submit onto one row |

Answers are stored as the label the visitor read, not the internal value, so the
sheet stays readable when the copy changes.

To add a column, add the key to `fields` in `src/app/api/lead/route.ts`. The
script appends any header it has not seen before, so the sheet needs no editing
first. Re-ordering or renaming the sheet's own headers is safe — rows are
matched to columns by header text.

## What this does not capture

- **Whether they actually booked.** The booking step is Google Calendar's own
  embed in a cross-origin iframe; the page cannot see inside it. Booked calls
  live in the Google Calendar the schedule belongs to.
- **Anyone who does not finish the details form**, by design.
- **Rate limiting.** `/api/lead` is public, like any public form. Field lengths
  and body size are capped, but a determined script could still add junk rows.
  Put Netlify rate limiting in front of it if that happens.
