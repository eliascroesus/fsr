/**
 * FSR lead sink — see docs/SHEETS.md.
 *
 * One row per lead, written when the details form is submitted. The test
 * answers travel with that submit, so nothing is recorded for a visitor who
 * answers the questions and then leaves without giving their details.
 */

/** The sheet this writes to — the id out of its URL. */
var SPREADSHEET_ID = '1-T-TZ3XOQotxS8TdDGdvzxDCh8tumDgNEX--kozsXEE';

/** Blank uses the first tab. Set a name to write to a different one. */
var SHEET_NAME = '';

/** Must match SHEETS_WEBHOOK_TOKEN in the site's environment. */
var TOKEN = 'PASTE_THE_SAME_TOKEN_HERE';

/** Column order for an empty sheet. Unknown keys are appended as new columns. */
var HEADERS = [
  'Tidsstämpel',
  'Namn',
  'E-post',
  'Telefon',
  'SMS-påminnelser',
  'Sysselsättning',
  'Inkomst i dag',
  'Mål om 6 månader',
  'Investeringsnivå',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'Landningssida',
  'Hänvisning',
  'Enhet',
  'Lead-ID',
];

function doPost(e) {
  // Pressing Run on this one in the editor calls it with no request. Say so,
  // rather than reporting a clean "Execution completed" having done nothing.
  if (!e || !e.postData) {
    throw new Error(
      'doPost only runs when the web app receives a request. To check the ' +
        'sheet from here, pick testWrite in the dropdown and press Run.',
    );
  }

  try {
    var body = JSON.parse(e.postData.contents);

    if (TOKEN && body.token !== TOKEN) {
      return json({ ok: false, error: 'forbidden' });
    }
    if (!body.leadId) {
      return json({ ok: false, error: 'missing leadId' });
    }

    // Guards against a double submit racing itself into two rows.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      upsert(body.leadId, body.fields || {});
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return json({ ok: true, service: 'fsr-lead-sink' });
}

/**
 * Writes one test row. Run it from the Apps Script editor to check the sheet
 * is reachable and the headers land before pointing the site at it.
 */
function testWrite() {
  upsert('test-' + Date.now(), {
    Tidsstämpel: new Date().toISOString(),
    Namn: 'Testperson',
    'E-post': 'test@example.com',
    Telefon: '+46701234567',
    'SMS-påminnelser': 'Ja',
    Sysselsättning: 'Jag har ett jobb',
    'Inkomst i dag': '0–5 000 kr',
    'Mål om 6 månader': 'Passera 50 000 kr i månaden',
    Investeringsnivå: '15 000–30 000 kr',
    utm_source: 'test',
  });
}

function upsert(leadId, fields) {
  var sheet = getSheet();
  var headers = getHeaders(sheet, fields);
  var idColumn = headers.indexOf('Lead-ID');

  var rowIndex = 0;
  if (idColumn !== -1 && sheet.getLastRow() > 1) {
    var ids = sheet.getRange(2, idColumn + 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] === leadId) {
        rowIndex = i + 2;
        break;
      }
    }
  }

  if (!rowIndex) {
    rowIndex = sheet.getLastRow() + 1;
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([new Array(headers.length).fill('')]);
  }

  var row = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  if (idColumn !== -1) row[idColumn] = leadId;

  Object.keys(fields).forEach(function (key) {
    var column = headers.indexOf(key);
    if (column !== -1 && fields[key] !== '' && fields[key] != null) {
      row[column] = fields[key];
    }
  });

  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
}

function getSheet() {
  var book = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!SHEET_NAME) return book.getSheets()[0];
  return book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
}

/** Writes the header row into an empty sheet, and adds columns for new keys. */
function getHeaders(sheet, fields) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return HEADERS.slice();
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var added = Object.keys(fields)
    .concat(['Lead-ID'])
    .filter(function (key, i, all) {
      return headers.indexOf(key) === -1 && all.indexOf(key) === i;
    });

  if (added.length) {
    sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]);
    sheet.getRange(1, headers.length + 1, 1, added.length).setFontWeight('bold');
    headers = headers.concat(added);
  }

  return headers;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
