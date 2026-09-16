/**
 * FSR lead sink — paste into Extensions ▸ Apps Script on the target sheet,
 * then deploy as a Web app (see docs/SHEETS.md).
 *
 * One row per lead. The first event creates the row, later events fill in the
 * columns they know about, so a visitor who answers the test and then drops out
 * at the form stays visible as a partial row instead of vanishing.
 */

/** Must match SHEETS_WEBHOOK_TOKEN in the site's environment. */
var TOKEN = 'PASTE_THE_SAME_TOKEN_HERE';

var SHEET_NAME = 'Leads';

/** Column order for a fresh sheet. Unknown keys are appended as new columns. */
var HEADERS = [
  'Lead-ID',
  'Först sedd',
  'Senast uppdaterad',
  'Status',
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
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (TOKEN && body.token !== TOKEN) {
      return json({ ok: false, error: 'forbidden' });
    }
    if (!body.leadId) {
      return json({ ok: false, error: 'missing leadId' });
    }

    // Two events can land at once; without the lock they race and write two
    // rows for the same lead.
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

/** Lets you confirm the deployment is live by opening the URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'fsr-lead-sink' });
}

function upsert(leadId, fields) {
  var sheet = getSheet();
  var headers = getHeaders(sheet, fields);
  var now = new Date();

  var ids = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues()
    : [];

  var rowIndex = 0;
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === leadId) {
      rowIndex = i + 2;
      break;
    }
  }

  if (!rowIndex) {
    rowIndex = sheet.getLastRow() + 1;
    var fresh = new Array(headers.length).fill('');
    fresh[headers.indexOf('Lead-ID')] = leadId;
    fresh[headers.indexOf('Först sedd')] = now;
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([fresh]);
  }

  var row = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  row[headers.indexOf('Senast uppdaterad')] = now;

  // Only overwrite with something; an event that does not know a value must
  // not blank out what an earlier one wrote.
  Object.keys(fields).forEach(function (key) {
    var column = headers.indexOf(key);
    if (column !== -1 && fields[key] !== '' && fields[key] != null) {
      row[column] = fields[key];
    }
  });

  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
}

function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
}

/** Writes the header row on a fresh sheet and adds columns for unseen keys. */
function getHeaders(sheet, fields) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return HEADERS.slice();
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var added = Object.keys(fields).filter(function (key) {
    return headers.indexOf(key) === -1;
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
