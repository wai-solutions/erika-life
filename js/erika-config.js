/* Erika Life — site settings */
/* Paste the Google Apps Script web app URL here after setup (see admin-setup/SETUP.md) */
window.ERIKA_API = 'https://script.google.com/macros/s/AKfycbxJjai9y-lZYJWp8ca3M1IiCWRtUenx6HE0VKCXkQATp0F1o7LxVDf-IMhFiQU8DxhO/exec';
/* InstaPay number for boots orders (50% deposit) */
window.ERIKA_PAY_BOOTS = '000 000 0000';
/* Erika's WhatsApp number, international format without + or spaces (Egypt: 20 then the number without the first 0, e.g. 201001234567) */
window.ERIKA_WHATSAPP = '201010078287';

/* ---------- Class payments (change here, the whole site follows) ---------- */
/* InstaPay payment link for class bookings */
window.ERIKA_INSTAPAY_LINK = 'https://ipn.eg/S/inasbakeer/instapay/4CM3ky';
/* WhatsApp number that receives the InstaPay screenshot (same format as above) */
window.ERIKA_PAY_WHATSAPP = '201010078287';
/* WhatsApp community invite link (WhatsApp > Communities > Invite via link). Leave '' until it exists:
   the "Join our community" buttons then open a WhatsApp chat asking to be added. */
window.ERIKA_COMMUNITY = '';

/* ---------- Next class (one-day event) ---------- */
/* Spots = boots pairs per size (also set in Code.gs BOOT_STOCK). key must stay the same after people book. */
window.ERIKA_EVENT = {
  key: 'Heliopolis Sporting Club|2026-12-01|19',
  studio: 'Heliopolis Sporting Club',
  date: '2026-12-01',
  time: '19',
  timeLabel: '7–8 PM',
  dayLabel: 'Tuesday 1 December 2026',
  startUTC: Date.UTC(2026, 11, 1, 17, 0, 0), /* 7 PM Cairo (UTC+2) */
  membersOnly: 'Heliopolis Sporting Club members only',
  map: 'https://maps.app.goo.gl/rBn8nqgbo6acWSmJ9',
  price: 500,
  was: 850,
  offer: 'December 2026 special, limited time'
};
