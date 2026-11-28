/* Erika Life — bounce experiences calendar
   Put <div data-bounce-cal></div> on a page (add data-mode="select" on the booking page, data-theme="dark" on dark bands).
   Reads window.ERIKA_EVENTS from js/erika-config.js. Event days open their booking page. */
(function () {
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var css = '' +
    '.bc{--bc-ink:#2A1222;--bc-mute:#7A6470;--bc-line:rgba(42,18,34,.12);--bc-card:#fff;--bc-day:#F8E6EE;--bc-acc:#CC3370;--bc-acc2:#A3214F;font-family:"DM Sans",system-ui,sans-serif;color:var(--bc-ink);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:18px;align-items:start}' +
    '.bc[data-theme=dark]{--bc-ink:#FBF7F4;--bc-mute:rgba(251,247,244,.68);--bc-line:rgba(251,247,244,.16);--bc-card:rgba(251,247,244,.06);--bc-day:rgba(229,99,154,.22);--bc-acc:#E5639A;--bc-acc2:#F48FB1}' +
    '.bc-box{background:var(--bc-card);border:1px solid var(--bc-line);border-radius:22px;padding:16px 16px 12px}' +
    '.bc-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}' +
    '.bc-head b{font:400 22px "Playfair Display",Georgia,serif;margin-right:auto}' +
    '.bc-head button{width:38px;height:38px;border-radius:50%;border:1px solid var(--bc-line);background:none;color:inherit;font-size:20px;line-height:1;cursor:pointer}' +
    '.bc-head button:disabled{opacity:.3;cursor:default}' +
    '.bc-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;text-align:center}' +
    '.bc-wd{font-size:12px;color:var(--bc-mute);padding:4px 0}' +
    '.bc-d{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:12px;font-size:14px;color:var(--bc-mute);border:1px solid transparent;background:none;padding:0;min-height:0;font-family:inherit}' +
    '.bc-d.today{border-color:var(--bc-line)}' +
    '.bc-d.ev{background:var(--bc-day);color:var(--bc-ink);font-weight:700;cursor:pointer;position:relative;transition:transform .3s cubic-bezier(.3,1.8,.5,1)}' +
    '.bc-d.ev:hover{transform:translateY(-2px);border-color:var(--bc-acc)}' +
    '.bc-d.ev i{width:6px;height:6px;border-radius:50%;background:var(--bc-acc);margin-top:3px}' +
    '.bc-d.ev.sel{background:var(--bc-acc);color:#fff}.bc-d.ev.sel i{background:#fff}' +
    '.bc-d.ev.past{opacity:.45}' +
    '.bc-d.ev:focus-visible{outline:2px solid var(--bc-acc);outline-offset:2px}' +
    '.bc-note{font-size:13px;color:var(--bc-mute);margin:10px 2px 0}' +
    '.bc-list{display:grid;gap:10px}' +
    '.bc-item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 16px;align-items:center;background:var(--bc-card);border:1px solid var(--bc-line);border-radius:18px;padding:14px 16px;text-decoration:none;color:inherit;cursor:pointer;text-align:left;font:inherit;width:100%;transition:border-color .25s,transform .3s}' +
    '.bc-item:hover{border-color:var(--bc-acc);transform:translateY(-2px)}' +
    '.bc-item.sel{border-color:var(--bc-acc);box-shadow:0 0 0 1px var(--bc-acc)}' +
    '.bc-date{grid-row:span 3;width:58px;text-align:center;border-radius:14px;background:var(--bc-acc);color:#fff;padding:8px 0;line-height:1.1}' +
    '.bc-date small{display:block;font-size:12px}.bc-date b{display:block;font:400 26px "Playfair Display",Georgia,serif}' +
    '.bc-item .t{font:400 19px "Playfair Display",Georgia,serif}' +
    '.bc-item .m{font-size:14px;color:var(--bc-mute)}' +
    '.bc-item .s{font-size:14px;font-weight:700;color:var(--bc-acc2)}' +
    '.bc-item.done .bc-date{background:var(--bc-mute)}' +
    '.bc-soon{border:1.5px dashed var(--bc-line);border-radius:18px;padding:16px;color:var(--bc-mute);font-size:15px}' +
    '.bc-soon b{display:block;color:var(--bc-ink);font:400 19px "Playfair Display",Georgia,serif;margin-bottom:2px}' +
    '@media(max-width:760px){.bc{grid-template-columns:minmax(0,1fr)}}' +
    '@media(prefers-reduced-motion:reduce){.bc-d.ev,.bc-item{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var COUNTS = null;
  function loadCounts() {
    if (COUNTS) return COUNTS;
    var api = window.ERIKA_API;
    COUNTS = api ? fetch(api + '?action=counts').then(function (r) { return r.json(); }).then(function (j) { return j.ok ? j : null; }).catch(function () { return null; }) : Promise.resolve(null);
    return COUNTS;
  }
  window.erikaCounts = loadCounts;
  function spotsLeft(e, data) {
    var stock = (data && data.stock) || { S: 2, M: 8, L: 1 }, c = (data && data.counts && data.counts[e.key]) || {};
    return Object.keys(stock).reduce(function (a, k) { return a + Math.max(0, stock[k] - (c[k] || 0)); }, 0);
  }
  window.erikaSpotsLeft = spotsLeft;
  var iso = function (y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); };

  function mount(el) {
    var EV = (window.ERIKA_EVENTS || []).slice(), mode = el.getAttribute('data-mode') || 'link';
    var now = new Date(), next = window.ERIKA_EVENT;
    var start = next ? new Date(next.date + 'T00:00') : now;
    var cur = { y: start.getFullYear(), m: start.getMonth() };
    var minM = now.getFullYear() * 12 + now.getMonth();
    var lastE = EV.length ? new Date(EV[EV.length - 1].date + 'T00:00') : now;
    var maxM = Math.max(minM + 1, lastE.getFullYear() * 12 + lastE.getMonth());
    var sel = mode === 'select' ? (el.getAttribute('data-selected') || (next && next.id)) : null;
    var data = null;
    el.classList.add('bc');

    function status(e) {
      if (Date.now() >= e.endUTC) return { t: 'Done', done: true };
      if (Date.now() >= e.startUTC) return { t: 'Happening now', done: true };
      var l = spotsLeft(e, data);
      var stock = (data && data.stock) || { S: 2, M: 8, L: 1 }, tot = Object.keys(stock).reduce(function (a, k) { return a + (+stock[k]); }, 0);
      return l ? { t: l + ' of ' + tot + ' spots left' } : { t: 'Bounce experience completed', full: true };
    }
    function go(id) {
      if (mode === 'select') { sel = id; draw(); el.dispatchEvent(new CustomEvent('bounce:select', { bubbles: true, detail: { id: id } })); }
      else location.href = 'booking.html#' + id;
    }
    function draw() {
      var first = new Date(cur.y, cur.m, 1), days = new Date(cur.y, cur.m + 1, 0).getDate(), today = iso(now.getFullYear(), now.getMonth(), now.getDate());
      var inMonth = EV.filter(function (e) { var p = e.date.split('-'); return +p[0] === cur.y && +p[1] === cur.m + 1; });
      var cells = WD.map(function (w) { return '<span class="bc-wd">' + w + '</span>'; }).join('') + '<span></span>'.repeat(first.getDay());
      for (var d = 1; d <= days; d++) {
        var ds = iso(cur.y, cur.m, d), es = inMonth.filter(function (e) { return e.date === ds; });
        if (es.length) {
          var e = es[0], past = Date.now() >= e.endUTC;
          cells += '<button type="button" class="bc-d ev' + (past ? ' past' : '') + (sel === e.id ? ' sel' : '') + (ds === today ? ' today' : '') + '" data-ev="' + esc(e.id) + '" aria-label="' + esc(e.dayLabel + ', ' + e.place + ', ' + e.startLabel) + '">' + d + '<i aria-hidden="true"></i></button>';
        } else cells += '<span class="bc-d' + (ds === today ? ' today' : '') + '">' + d + '</span>';
      }
      var mi = cur.y * 12 + cur.m;
      var list = inMonth.map(function (e) {
        var s = status(e), p = e.date.split('-'), wd = WD[new Date(e.date + 'T00:00').getDay()];
        var tag = mode === 'select' ? 'button type="button"' : 'a href="booking.html#' + esc(e.id) + '"';
        return '<' + tag + ' class="bc-item' + (s.done ? ' done' : '') + (sel === e.id ? ' sel' : '') + '" data-ev="' + esc(e.id) + '">' +
          '<span class="bc-date"><small>' + wd + '</small><b>' + (+p[2]) + '</b><small>' + MON[+p[1] - 1].slice(0, 3) + '</small></span>' +
          '<span class="t">' + esc(e.place) + '</span>' +
          '<span class="m">' + esc(e.startLabel) + ' · ' + (e.minutes || 60) + ' min' + (e.audience ? ' · ' + esc(e.audience) : '') + '</span>' +
          '<span class="s">' + esc(s.t) + '</span>' +
          '</' + (mode === 'select' ? 'button' : 'a') + '>';
      }).join('');
      var soon = '<div class="bc-soon"><b>Next stop: a surprise</b>New places, new people, new experiences. Each bounce experience appears here as we announce it.</div>';
      el.innerHTML = '<div class="bc-box"><div class="bc-head"><b>' + MON[cur.m] + ' ' + cur.y + '</b>' +
        '<button type="button" data-m="-1" aria-label="Previous month"' + (mi <= minM ? ' disabled' : '') + '>&lsaquo;</button>' +
        '<button type="button" data-m="1" aria-label="Next month"' + (mi >= maxM ? ' disabled' : '') + '>&rsaquo;</button></div>' +
        '<div class="bc-grid">' + cells + '</div><p class="bc-note">Pink days are bounce experiences. Tap one to book.</p></div>' +
        '<div class="bc-list">' + list + soon + '</div>';
    }
    el.addEventListener('click', function (ev) {
      var m = ev.target.closest('[data-m]');
      if (m && !m.disabled) { var t = cur.y * 12 + cur.m + (+m.getAttribute('data-m')); cur = { y: Math.floor(t / 12), m: t % 12 }; draw(); return; }
      var b = ev.target.closest('[data-ev]');
      if (b && mode === 'select') { ev.preventDefault(); go(b.getAttribute('data-ev')); }
      else if (b && b.tagName === 'BUTTON') go(b.getAttribute('data-ev'));
    });
    el.erikaSelect = function (id) { sel = id; var e = EV.filter(function (x) { return x.id === id; })[0]; if (e) { var dd = new Date(e.date + 'T00:00'); cur = { y: dd.getFullYear(), m: dd.getMonth() }; } draw(); };
    draw();
    loadCounts().then(function (j) { data = j; draw(); });
  }
  function init() { document.querySelectorAll('[data-bounce-cal]').forEach(function (el) { if (!el.classList.contains('bc')) mount(el); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
