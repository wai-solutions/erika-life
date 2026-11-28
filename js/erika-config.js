/* Erika Life — site settings */
/* Paste the Google Apps Script web app URL here after setup (see admin-setup/SETUP.md) */
window.ERIKA_API = 'https://script.google.com/macros/s/AKfycbxJjai9y-lZYJWp8ca3M1IiCWRtUenx6HE0VKCXkQATp0F1o7LxVDf-IMhFiQU8DxhO/exec';
/* InstaPay number for boots orders (50% deposit) */
window.ERIKA_PAY_BOOTS = '000 000 0000';
/* Erika's WhatsApp number, international format without + or spaces (Egypt: 20 then the number without the first 0, e.g. 201001234567) */
window.ERIKA_WHATSAPP = '201010078287';

/* ---------- Payments (change here, the whole site follows) ---------- */
/* InstaPay payment link for bounce experience bookings */
window.ERIKA_INSTAPAY_LINK = 'https://ipn.eg/S/inasbakeer/instapay/4CM3ky';
/* WhatsApp number that receives the InstaPay screenshot (same format as above) */
window.ERIKA_PAY_WHATSAPP = '201010078287';
/* WhatsApp community invite link (WhatsApp > Communities > Invite via link). Leave '' until it exists:
   the "Join our community" buttons then open a WhatsApp chat asking to be added. */
window.ERIKA_COMMUNITY = '';
/* Message people send when they ask to join (used while ERIKA_COMMUNITY is empty) */
window.ERIKA_COMMUNITY_MSG = 'Hi Erika \u{1F338} Please add me to your community. I want to follow your next bounce experience classes. \u2728';
window.erikaCommunityLink = function () {
  return window.ERIKA_COMMUNITY || ('https://api.whatsapp.com/send?phone=' + String(window.ERIKA_WHATSAPP || '').replace(/\D/g, '') + '&text=' + encodeURIComponent(window.ERIKA_COMMUNITY_MSG));
};

/* ---------- Bounce experiences (one-day classes) ----------
   Add one line per experience. It appears in the calendar, the news bar and the booking page.
   id: short unique name, never change it after people book.  time: start hour, 24h ("19" = 7 PM).
   audience: who can join (leave '' if open to everyone). membersOnly: true adds a membership number field (off for now).
   Spots = boots pairs per size (BOOT_STOCK in admin-setup/Code.gs: S 2, M 8, L 1 = 11). */
window.ERIKA_EVENTS = [
  { id: 'hsc-2026-12-01', place: 'Heliopolis Sporting Club', area: 'Heliopolis, Cairo', date: '2026-12-01', time: '19', minutes: 60,
    audience: 'Heliopolis Club members only', membersOnly: false, map: 'https://maps.app.goo.gl/rBn8nqgbo6acWSmJ9', price: 500, was: 850 }
];
window.ERIKA_OFFER = 'December 2026 special, limited time';

/* ---------- derived values (no need to edit) ---------- */
(function () {
  var DAYF = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  window.ERIKA_EVENTS.forEach(function (e) {
    var p = e.date.split('-').map(Number), h = parseInt(e.time, 10), d = new Date(p[0], p[1] - 1, p[2]);
    e.studio = e.place;
    e.key = e.place + '|' + e.date + '|' + e.time;
    e.startUTC = Date.UTC(p[0], p[1] - 1, p[2], h - 2, 0, 0); /* Cairo, UTC+2 */
    e.endUTC = e.startUTC + (e.minutes || 60) * 60000;
    e.dayLabel = DAYF[d.getDay()] + ' ' + p[2] + ' ' + MONF[p[1] - 1] + ' ' + p[0];
    e.shortDay = DAYF[d.getDay()].slice(0, 3) + ' ' + p[2] + ' ' + MONF[p[1] - 1].slice(0, 3);
    e.startLabel = ((h % 12) || 12) + ':00 ' + (h >= 12 ? 'PM' : 'AM');
    e.timeLabel = ((h % 12) || 12) + '–' + (((h + 1) % 12) || 12) + (h + 1 >= 12 ? ' PM' : ' AM');
    e.membersOnly = !!e.membersOnly;
  });
  window.ERIKA_EVENTS.sort(function (a, b) { return a.startUTC - b.startUTC; });
  var now = Date.now();
  /* next bounce experience = first one that has not ended yet (or the last one) */
  window.ERIKA_EVENT = window.ERIKA_EVENTS.filter(function (e) { return e.endUTC > now; })[0] || window.ERIKA_EVENTS[window.ERIKA_EVENTS.length - 1] || null;
})();
