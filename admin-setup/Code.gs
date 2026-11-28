/**
 * Erika Life — bookings backend (Google Apps Script)
 * Paste this whole file into Extensions > Apps Script of Erika's Google Sheet.
 * Then: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 *
 * 1. Change ADMIN_KEY below to a private password only Erika knows.
 * 2. Keep BOOT_STOCK in line with the real pairs per class.
 * Sheets made automatically: Bookings, Boot orders, Requests (chat form), Expenses (finance).
 */
const ADMIN_KEY = 'CHANGE-ME-erika-private-key';
const BOOT_STOCK = { S: 2, M: 8, L: 1 };
const SHEET_NAME = 'Bookings';
const ORDERS_SHEET = 'Boot orders';
const ORDER_HEAD = ['id', 'created', 'edition', 'colour', 'size', 'qty', 'total', 'deposit', 'name', 'whatsapp', 'notes', 'paid', 'status'];
/* Erika's Google Sheet "Erika Life Data" (works as a standalone or sheet-bound script) */
const SHEET_ID = '1QnaFLnJkIqGbq2kU6MsuyCaQvB1J0ugS5IU_7VIs2eM';
function ss_() { return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID); }
const REQ_SHEET = 'Requests';
const REQ_HEAD = ['id', 'created', 'topic', 'name', 'email', 'phone', 'message', 'source', 'page', 'status'];
const HEAD = ['id', 'created', 'studio', 'date', 'time', 'classKey', 'boots', 'name', 'whatsapp', 'first', 'notes', 'price', 'paid', 'status', 'email', 'member'];

/* Finance: expenses (added from the admin panel). Revenue comes from paid bookings + boot payments. */
const EXP_SHEET = 'Expenses';
const EXP_HEAD = ['id', 'date', 'category', 'item', 'amount', 'currency', 'rate', 'egp', 'notes', 'status'];
function expSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(EXP_SHEET);
  if (!sh) {
    sh = ss.insertSheet(EXP_SHEET); sh.appendRow(EXP_HEAD); sh.setFrozenRows(1); sh.getRange('A:J').setNumberFormat('@');
    [['E0001', '2026-11-01', 'Tools & software', 'Claude Pro (Nov, incl. VAT)', '22.80', 'USD', '52', '1185.60', 'Project + website. Website share ~14 of 30 days', 'active'],
     ['E0002', '2026-11-14', 'Tools & software', 'ChatGPT Plus (Nov, incl. VAT)', '22.80', 'USD', '52', '1185.60', 'Logo, identity, website photos', 'active'],
     ['E0003', '2026-11-26', 'Website', 'Domain erikalife.com (1 year, Squarespace)', '22.00', 'USD', '52', '1144.00', 'Renews Nov 2027', 'active']]
      .forEach(function (r) { sh.appendRow(r); });
  }
  return sh;
}
function expenses_() {
  const vals = expSheet_().getDataRange().getDisplayValues();
  vals.shift();
  return vals.map(function (r, i) { const o = { _row: i + 2 }; EXP_HEAD.forEach(function (h, k) { o[h] = r[k]; }); return o; });
}
function expAdd_(b) {
  if (b.key !== ADMIN_KEY) return json_({ ok: false, error: 'key' });
  const num = function (v) { const n = parseFloat(String(v).replace(/[^\d.]/g, '')); return isNaN(n) ? 0 : n; };
  const amount = num(b.amount), cur = clean_(b.currency, 5) === 'USD' ? 'USD' : 'EGP';
  const rate = cur === 'EGP' ? 1 : (num(b.rate) || 52);
  if (!amount) return json_({ ok: false, error: 'amount' });
  const id = 'E' + Utilities.getUuid().slice(0, 5).toUpperCase();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyy-MM-dd');
  expSheet_().appendRow([id, date, clean_(b.category, 40), clean_(b.item, 120), amount.toFixed(2), cur, String(rate), (amount * rate).toFixed(2), clean_(b.notes, 300), 'active']);
  return json_({ ok: true, id: id });
}
function expUpdate_(b) {
  const r = expenses_().filter(function (x) { return x.id === b.id; })[0];
  if (!r) return json_({ ok: false, error: 'notfound' });
  if (b.status) expSheet_().getRange(r._row, EXP_HEAD.indexOf('status') + 1).setValue(clean_(b.status, 20));
  return json_({ ok: true });
}

function sheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange('A:P').setNumberFormat('@'); // keep everything as text
  }
  if (sh.getLastColumn() < HEAD.length) { // older sheet: add the new columns (email, member)
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
    sh.getRange('O:P').setNumberFormat('@');
  }
  return sh;
}

function orderSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(ORDERS_SHEET);
  if (!sh) { sh = ss.insertSheet(ORDERS_SHEET); sh.appendRow(ORDER_HEAD); sh.setFrozenRows(1); sh.getRange('A:M').setNumberFormat('@'); }
  return sh;
}

function reqSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(REQ_SHEET);
  if (!sh) { sh = ss.insertSheet(REQ_SHEET); sh.appendRow(REQ_HEAD); sh.setFrozenRows(1); sh.getRange('A:J').setNumberFormat('@'); }
  return sh;
}

function requests_() {
  const vals = reqSheet_().getDataRange().getDisplayValues();
  vals.shift();
  return vals.map(function (r, i) { const o = { _row: i + 2 }; REQ_HEAD.forEach(function (h, k) { o[h] = r[k]; }); return o; });
}

function orders_() {
  const vals = orderSheet_().getDataRange().getDisplayValues();
  vals.shift();
  return vals.map(function (r, i) { const o = { _row: i + 2 }; ORDER_HEAD.forEach(function (h, k) { o[h] = r[k]; }); return o; });
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
  return json_({ ok: true, v: 2, stock: BOOT_STOCK, rows: rows.map(function (r) { delete r._row; return r; }), orders: orders_().map(function (r) { delete r._row; return r; }), requests: requests_().map(function (r) { delete r._row; return r; }), expenses: expenses_().map(function (r) { delete r._row; return r; }) });
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
      if (b.kind === 'expense') return expUpdate_(b);
      const isOrder = b.kind === 'order', isReq = b.kind === 'request';
      const list = isReq ? requests_() : (isOrder ? orders_() : rows);
      const head = isReq ? REQ_HEAD : (isOrder ? ORDER_HEAD : HEAD);
      const target = isReq ? reqSheet_() : (isOrder ? orderSheet_() : sh);
      const r = list.filter(function (x) { return x.id === b.id; })[0];
      if (!r) return json_({ ok: false, error: 'notfound' });
      if (b.paid !== undefined && head.indexOf('paid') > -1) target.getRange(r._row, head.indexOf('paid') + 1).setValue(b.paid === true ? 'yes' : (b.paid === false ? 'no' : clean_(b.paid, 10)));
      if (b.status) target.getRange(r._row, head.indexOf('status') + 1).setValue(clean_(b.status, 20));
      return json_({ ok: true });
    }
    if (b.action === 'addExpense') return expAdd_(b);
    if (b.action === 'confirm') return confirm_(b, rows, sh);
    if (b.type === 'request') {
      const rid = 'R' + Utilities.getUuid().slice(0, 5).toUpperCase();
      const at = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyy-MM-dd HH:mm');
      reqSheet_().appendRow([rid, at, clean_(b.topic, 40), clean_(b.name, 80), clean_(b.email, 120), clean_(b.phone, 30), clean_(b.message, 2000), clean_(b.source, 120), clean_(b.page, 200), 'new']);
      return json_({ ok: true, id: rid });
    }
    if (b.type === 'order') {
      const oid = 'B' + Utilities.getUuid().slice(0, 5).toUpperCase();
      const when = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyy-MM-dd HH:mm');
      orderSheet_().appendRow([oid, when, clean_(b.edition, 40), clean_(b.colour, 40), clean_(b.size, 5), clean_(b.qty, 3), clean_(b.total, 12), clean_(b.deposit, 12),
        clean_(b.name, 80), clean_(b.whatsapp, 30), clean_(b.notes, 500), 'no', 'ordered']);
      return json_({ ok: true, id: oid });
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
      clean_(b.name, 80), clean_(b.whatsapp, 30), clean_(b.first, 40), clean_(b.notes, 500), clean_(b.price, 20), 'no', 'booked',
      clean_(b.email, 120), clean_(b.member, 40)]);
    return json_({ ok: true, id: id });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Payment confirmed: mark paid + send the designed confirmation email ---------- */
const MAP_LINK = 'https://maps.app.goo.gl/rBn8nqgbo6acWSmJ9';
function confirm_(b, rows, sh) {
  if (b.key !== ADMIN_KEY) return json_({ ok: false, error: 'key' });
  const r = rows.filter(function (x) { return x.id === b.id; })[0];
  if (!r) return json_({ ok: false, error: 'notfound' });
  sh.getRange(r._row, HEAD.indexOf('paid') + 1).setValue('yes');
  sh.getRange(r._row, HEAD.indexOf('status') + 1).setValue('confirmed');
  let email = r.email || '';
  if (!email) { const m = String(r.notes).match(/[^\s@·]+@[^\s@·]+\.[^\s@·]+/); email = m ? m[0] : ''; }
  if (!email) return json_({ ok: true, emailed: false, error: 'noemail' });
  try {
    MailApp.sendEmail({
      to: email,
      name: 'Erika Life',
      replyTo: 'erika.bouncefit@gmail.com',
      subject: 'You are in! Your Erika Life class is confirmed',
      htmlBody: confirmHtml_(r, clean_(b.community, 300)),
      body: confirmText_(r, clean_(b.community, 300))
    });
    return json_({ ok: true, emailed: true, to: email });
  } catch (err) {
    return json_({ ok: true, emailed: false, error: 'mail' });
  }
}
function niceDate_(iso) {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d) ? iso : Utilities.formatDate(d, 'Africa/Cairo', 'EEEE d MMMM yyyy');
}
function niceTime_(t) { const h = parseInt(t, 10); return isNaN(h) ? t : ((h % 12) || 12) + ':00 ' + (h >= 12 ? 'PM' : 'AM'); }
function esc_(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function confirmText_(r, community) {
  return 'Hi ' + r.name + ',\n\nYour payment is received and your spot is confirmed.\n\n' +
    'Place: ' + r.studio + '\nDay: ' + niceDate_(r.date) + '\nTime: ' + niceTime_(r.time) + ' (60 minutes)\nBoots: Size ' + r.boots + '\nBooking ref: ' + r.id + '\n' +
    'Location: ' + MAP_LINK + '\n\nBring comfortable sportswear, socks and water. Please arrive 15 minutes early to fit your boots.\n' +
    (community ? '\nJoin our community: ' + community + '\n' : '') +
    '\nNeed to cancel? Reply to this email at least 2 hours before the class for a full refund.\n\nLand soft. Rise strong. Bloom.\nErika Life';
}
function confirmHtml_(r, community) {
  const rose = '#CC3370', plum = '#2A1222', cream = '#FBF7F4', blush = '#FCF3F6', mute = '#7A6470';
  const row = function (k, v) { return '<tr><td style="padding:10px 0;color:' + mute + ';font-size:14px;border-bottom:1px dashed #E9DCE2;width:38%">' + k + '</td><td style="padding:10px 0;font-size:15px;font-weight:600;border-bottom:1px dashed #E9DCE2;text-align:right">' + esc_(v) + '</td></tr>'; };
  const btn = function (href, label, bg, fg, border) { return '<a href="' + esc_(href) + '" style="display:inline-block;background:' + bg + ';color:' + fg + ';text-decoration:none;font-weight:600;font-size:15px;padding:14px 26px;border-radius:999px;margin:6px 4px;' + (border ? 'border:1.5px solid ' + border + ';' : '') + '">' + label + '</a>'; };
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:' + cream + ';font-family:Helvetica,Arial,sans-serif;color:#2B1A24">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + cream + ';padding:24px 12px"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:24px;overflow:hidden">' +
    '<tr><td style="background:' + plum + ';padding:34px 32px 30px;text-align:center;color:#fff">' +
      '<img src="https://erikalife.com/img/logo/ERIKA-rounded-icon.png" width="56" height="56" alt="Erika Life" style="display:block;margin:0 auto 14px;border-radius:50%">' +
      '<div style="font-size:13px;color:#FBD0E0;margin-bottom:8px">Erika Life | Bounce Experiences</div>' +
      '<div style="font-family:Georgia,serif;font-size:34px;line-height:1.15">You are <i style="color:#F48FB1">in</i>, ' + esc_(r.name) + '!</div>' +
      '<div style="font-size:15px;color:rgba(255,255,255,.85);margin-top:10px">Your payment is received and your spot is confirmed.</div>' +
    '</td></tr>' +
    '<tr><td style="padding:28px 32px 8px">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
        row('Place', r.studio) + row('Day', niceDate_(r.date)) + row('Time', niceTime_(r.time) + ' · 60 minutes') + row('Your boots', 'Size ' + r.boots) + row('Booking ref', r.id) +
      '</table></td></tr>' +
    '<tr><td style="padding:18px 32px 6px;text-align:center">' + btn(MAP_LINK, 'Open the location', rose, '#fff') + '</td></tr>' +
    '<tr><td style="padding:16px 32px"><div style="background:' + blush + ';border-radius:16px;padding:18px 20px;font-size:14px;line-height:1.7">' +
      '<b style="color:' + rose + '">Before you bounce</b><br>Comfortable sportswear, socks and a bottle of water.<br>Arrive 15 minutes early, we fit your boots together.<br>Bring your club membership card.' +
    '</div></td></tr>' +
    (community ? '<tr><td style="padding:8px 32px 4px;text-align:center"><div style="font-family:Georgia,serif;font-size:22px;margin-bottom:6px">Join our community</div><div style="font-size:14px;color:' + mute + ';margin-bottom:8px">Guess where and when we bounce next. Follow our steps.</div>' + btn(community, 'Join on WhatsApp', '#fff', plum, plum) + '</td></tr>' : '') +
    '<tr><td style="padding:22px 32px 30px;text-align:center;font-size:13px;color:' + mute + ';line-height:1.6">Need to cancel? Reply to this email at least 2 hours before the class for a full refund.<br><br>' +
      '<span style="font-family:Georgia,serif;font-size:17px;color:' + plum + '">Land soft. Rise strong. Bloom.</span><br><a href="https://erikalife.com" style="color:' + rose + '">erikalife.com</a></td></tr>' +
    '</table></td></tr></table></body></html>';
}
