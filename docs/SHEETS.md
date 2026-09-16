# Lead data → Google Sheets

Every visitor who finishes the test lands on one row of a Google Sheet, and the
row fills in as they go: the test answers arrive when they finish question 4,
their name, e-mail and phone when they submit the details form. Someone who
answers the test and then abandons the form still leaves a row, so drop-off is
visible rather than silent.

No Google credentials live in the site. The page posts to its own
`/api/lead`, and that route forwards server-side to an Apps Script webhook
bound to the sheet, so the webhook URL never reaches the browser.

```
browser → POST /api/lead → Apps Script web app → the sheet
```

## 1. Create the sheet

1. New Google Sheet. Name it whatever you like — the script writes to a tab
   called **Leads** and creates it if missing.
2. **Extensions ▸ Apps Script**.
3. Replace the contents of `Code.gs` with `scripts/fsr-sheet.gs` from this repo.
4. At the top of the script, replace `PASTE_THE_SAME_TOKEN_HERE` with a long
   random string. Generate one with:

   ```bash
   openssl rand -hex 24
   ```

   Keep it — step 3 needs the same value.
5. **Save**.

## 2. Deploy it as a web app

1. **Deploy ▸ New deployment ▸** gear icon **▸ Web app**.
2. *Execute as*: **Me**. *Who has access*: **Anyone**.
3. **Deploy**, approve the permission prompt, and copy the **Web app URL**. It
   looks like `https://script.google.com/macros/s/AKfy…/exec`.

"Anyone" means anyone who knows the URL can POST to it, which is why the script
rejects any request that does not carry the token.

> Re-deploy after every edit to the script — **Deploy ▸ Manage deployments ▸**
> pencil **▸ Version: New version**. Editing alone does not change what the live
> URL runs.

## 3. Point the site at it

Two server-side variables. Neither is `NEXT_PUBLIC_`, so neither is bundled
into the browser:

| Variable | Value |
| --- | --- |
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from step 2 |
| `SHEETS_WEBHOOK_TOKEN` | the same random string you put in the script |

In Netlify: **Site configuration ▸ Environment variables ▸ Add a variable**,
then redeploy. Locally, put them in `.env.local`.

With `SHEETS_WEBHOOK_URL` unset the route accepts the request and does nothing,
so the funnel works untouched in development and in preview deploys.

## 4. Check it

Open the live page, answer the four questions, submit the form. Two rows should
*not* appear — one row should appear and then fill out. If nothing shows up:

- Open the `/exec` URL in a browser. It should return
  `{"ok":true,"service":"fsr-lead-sink"}`. Anything else means the deployment is
  not live.
- In Apps Script, **Executions** lists every call and its error.
- In Netlify, **Logs ▸ Functions** shows what `/api/lead` logged. It prints
  `[lead] could not reach the sheet` or `[lead] sheet rejected the row` with the
  response body.
- A `forbidden` response means the two token values do not match.

## Columns

| Column | Filled when |
| --- | --- |
| `Lead-ID` | first event — ties the two events to one row |
| `Först sedd`, `Senast uppdaterad` | automatically |
| `Status` | `Snabbtest klart` → `Uppgifter ifyllda — bokning visad` |
| `Namn`, `E-post`, `Telefon`, `SMS-påminnelser` | details form |
| `Sysselsättning`, `Inkomst i dag`, `Mål om 6 månader`, `Investeringsnivå` | test |
| `utm_source` … `utm_term` | from the landing URL's query string |
| `Landningssida`, `Hänvisning`, `Enhet` | first event |

Answers are stored as the label the visitor read, not the internal value, so the
sheet stays readable when the copy changes.

To add a column, add the key to `fields` in `src/app/api/lead/route.ts`. The
script appends any header it has not seen before, so the sheet does not need
editing first.

## What this does not capture

- **Whether they actually booked.** The booking step is Google Calendar's own
  embed in a cross-origin iframe; the page cannot see what happens inside it.
  Booked calls live in the Google Calendar the schedule belongs to.
- **Partial tests.** The row is created when question 4 is answered. Someone who
  answers two questions and leaves is not recorded. Move the `trackLead` call in
  `workshop-opt-in.tsx` into the quiz's per-answer handler if you want that.
- **Rate limiting.** `/api/lead` is public and unauthenticated, like any public
  form. Field lengths and body size are capped, but a determined script could
  still add junk rows. Put Netlify rate limiting in front of it if that happens.
