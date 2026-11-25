/**
 * Erika Life — bookings backend (Google Apps Script)
 * Paste this whole file into Extensions > Apps Script of Erika's Google Sheet.
 * Then: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 *
 * 1. Change ADMIN_KEY below to a private password only Erika knows.
 * 2. Keep BOOT_STOCK in line with the real pairs per class.
 */
const ADMIN_KEY = 'CHANGE-ME-erika-private-key';
const BOOT_STOCK = { S: 2, M: 8, L: 1 };
const SHEET_NAME = 'Bookings';
const HEAD = ['id', 'created', 'studio', 'date', 'time', 'classKey', 'boots', 'name', 'whatsapp', 'first', 'notes', 'price', 'paid', 'status'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange('A:N').setNumberFormat('@'); // keep everything as text
  }
  return sh;
}

function rows_() {
  const vals = sheet_().getDataRange().getDisplayValues();
  vals.shift();
  return vals.map(function (r, i) {
    const o = { _row: i + 2 };
    HEAD.forEach(function (h, k) { o[h] = r[k]; });
    return o;
  });
}

function used_(rows, classKey, size) {
  return rows.filter(function (r) { return r.classKey === classKey && r.boots === size && r.status !== 'cancelled'; }).length;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max) { return String(v == null ? '' : v).slice(0, max || 200); }

/* Public: booked boots per class (no personal data). Admin: full list with ?key= */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const rows = rows_();
  if (p.action === 'counts') {
    const c = {};
    rows.forEach(function (r) {
      if (r.status === 'cancelled' || !BOOT_STOCK[r.boots]) return;
      c[r.classKey] = c[r.classKey] || {};
      c[r.classKey][r.boots] = (c[r.classKey][r.boots] || 0) + 1;
    });
    return json_({ ok: true, stock: BOOT_STOCK, counts: c });
  }
  if (p.key !== ADMIN_KEY) return json_({ ok: false, error: 'key' });
  return json_({ ok: true, stock: BOOT_STOCK, rows: rows.map(function (r) { delete r._row; return r; }) });
}

/* Booking from the website, or admin updates (paid / cancelled) */
function doPost(e) {
  const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_();
    const rows = rows_();
    if (b.action === 'update') {
      if (b.key !== ADMIN_KEY) return json_({ ok: false, error: 'key' });
      const r = rows.filter(function (x) { return x.id === b.id; })[0];
      if (!r) return json_({ ok: false, error: 'notfound' });
      if (b.paid !== undefined) sh.getRange(r._row, HEAD.indexOf('paid') + 1).setValue(b.paid ? 'yes' : 'no');
      if (b.status) sh.getRange(r._row, HEAD.indexOf('status') + 1).setValue(clean_(b.status, 20));
      return json_({ ok: true });
    }
    // new booking
    const classKey = clean_(b.studio, 40) + '|' + clean_(b.date, 10) + '|' + clean_(b.time, 5);
    const boots = clean_(b.boots, 5);
    if (BOOT_STOCK[boots] && used_(rows, classKey, boots) >= BOOT_STOCK[boots]) {
      return json_({ ok: false, error: 'soldout' });
    }
    const id = Utilities.getUuid().slice(0, 6).toUpperCase();
    const created = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyy-MM-dd HH:mm');
    sh.appendRow([id, created, clean_(b.studio, 40), clean_(b.date, 10), clean_(b.time, 5), classKey, boots,
      clean_(b.name, 80), clean_(b.whatsapp, 30), clean_(b.first, 40), clean_(b.notes, 500), clean_(b.price, 20), 'no', 'booked']);
    return json_({ ok: true, id: id });
  } finally {
    lock.releaseLock();
  }
}
