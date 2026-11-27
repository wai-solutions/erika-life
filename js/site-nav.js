/* Erika Life — one header, one menu and one footer for every page */
(function(){
  var file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  var HOME=(file==='index.html'||file==='');
  var WM='<span class="ek" role="img" aria-label="Erika"><svg aria-hidden="true"><use href="#wm"/></svg></span>';
  /* the journey, in the same order as the home page */
  var J=[['meet','Meet '+WM],['spirit','Feel the bounce'],['levels','Non-stop progress'],['mani','Three beats'],['classes','Next class'],['faq','Questions'],['nature','Back to nature'],['join','Daily life']];
  var href=function(id){return HOME?'#'+id:'index.html#'+id};
  var go=HOME?' data-go':'';
  var IG='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>';
  var TT='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.7-.3-3.9-1.1v6.1c0 3.9-3.2 6.1-6.3 5.9-2.9-.2-5.1-2.6-5-5.5.1-3.3 3-5.8 6.4-5.3v3.2c-1.6-.4-3.2.6-3.3 2.1-.1 1.4 1 2.5 2.3 2.5 1.4 0 2.5-1 2.5-2.7V3h3.4z"/></svg>';
  var FB='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1z"/></svg>';
  var SOC='<a href="https://www.instagram.com/erikaszenes/" target="_blank" rel="noopener" aria-label="Erika on Instagram">'+IG+'</a><a href="https://www.tiktok.com/@erikaszenes.bouncefit" target="_blank" rel="noopener" aria-label="Erika on TikTok">'+TT+'</a><a href="https://www.facebook.com/ErikaSzenes" target="_blank" rel="noopener" aria-label="Erika on Facebook">'+FB+'</a>';
  var cur=function(f){return f===file?' aria-current="page"':''};

  var css=''+
  '.sn{position:fixed;top:0;left:0;right:0;z-index:80;display:flex;align-items:center;gap:12px;padding:12px max(4vw,16px);background:rgba(251,247,244,.97);box-shadow:0 1px 0 rgba(42,18,34,.08);color:#2A1222;font-family:"DM Sans",system-ui,sans-serif;transition:background .4s,color .4s,box-shadow .4s}'+
  '.sn a{color:inherit;text-decoration:none}'+
  '.sn .ek,.sf .ek,.snm .ek{display:inline-block;aspect-ratio:1388/590;vertical-align:middle}.sn .ek svg,.sf .ek svg,.snm .ek svg{width:100%;height:100%;display:block}'+
  '.sn-brand{display:flex;align-items:center;gap:8px;flex:none;margin-right:auto}'+
  '.sn-brand>svg{width:44px;height:44px;color:#CC3370;transition:color .4s}'+
  '.sn-brand .ek{height:38px;color:#CC3370;transition:color .4s}'+
  '.sn-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border-radius:999px;font-size:15px;font-weight:500;white-space:nowrap;flex:none;transition:background .25s,color .25s,opacity .3s}'+
  '.sn-boots{border:1.5px solid currentColor}.sn-boots:hover{background:rgba(204,51,112,.1)}'+
  '.sn-book{background:#CC3370;color:#fff!important}.sn-book:hover{background:#A3214F}'+
  '.sn-menu{display:flex;align-items:center;gap:10px;background:none;border:0;color:inherit;font:500 15px "DM Sans",system-ui,sans-serif;min-height:44px;cursor:pointer;padding:0 4px 0 8px}'+
  '.sn-menu i{display:grid;gap:5px;width:22px}.sn-menu i::before,.sn-menu i::after{content:"";height:2px;background:currentColor;border-radius:2px;transition:transform .35s}'+
  '.sn.open{background:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none;color:#FBF7F4}'+
  '.sn.open .sn-brand>svg,.sn.open .sn-brand .ek{color:#E5639A}'+
  '.sn.open .sn-menu i::before{transform:translateY(3.5px) rotate(45deg)}.sn.open .sn-menu i::after{transform:translateY(-3.5px) rotate(-45deg)}'+
  '.sn.open .sn-btn{opacity:0;pointer-events:none}'+
  /* full-screen menu */
  '.snm{position:fixed;inset:0;z-index:79;background:#2A1222;color:#FBF7F4;overflow-y:auto;opacity:0;visibility:hidden;transition:opacity .45s,visibility 0s .45s;font-family:"DM Sans",system-ui,sans-serif}'+
  '.snm.open{opacity:1;visibility:visible;transition:opacity .45s}'+
  '.snm::after{content:"";position:fixed;right:-14vw;bottom:-16vh;width:70vmin;height:70vmin;border-radius:50%;background:radial-gradient(circle,rgba(204,51,112,.35),rgba(204,51,112,0) 70%);pointer-events:none}'+
  '.snm a{color:inherit;text-decoration:none}'+
  '.snm-in{position:relative;z-index:1;min-height:100%;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(30px,6vw,90px);align-items:center;padding:110px max(7vw,24px) 50px}'+
  '.snm-k{font:500 12px "DM Sans",system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.55;margin:0 0 14px}'+
  '.snm ol{list-style:none;margin:0;padding:0;counter-reset:j}'+
  '.snm ol a{display:flex;align-items:baseline;gap:16px;padding:5px 0;font:400 clamp(28px,3.6vw,48px)/1.12 "Playfair Display",Georgia,serif;transition:color .2s,transform .3s}'+
  '.snm ol a::before{counter-increment:j;content:"0" counter(j);font:500 13px "DM Sans",system-ui,sans-serif;letter-spacing:.08em;opacity:.5;min-width:22px}'+
  '.snm ol a:hover{color:#E5639A;transform:translateX(6px)}'+
  '.snm ol .ek{height:1.2em;vertical-align:-.3em}'+
  '.snm-side{border-left:1px solid rgba(251,247,244,.14);padding-left:clamp(24px,4vw,56px)}'+
  '.snm-side h2{font:italic 400 clamp(30px,3.4vw,44px)/1.1 "Playfair Display",Georgia,serif;margin:0 0 20px;color:#FBF7F4}'+
  '.snm-side h2 em{color:#E5639A}'+
  '.snm-acts{display:flex;flex-direction:column;gap:12px;max-width:320px}'+
  '.snm-acts a{display:flex;align-items:center;justify-content:center;min-height:54px;border-radius:999px;font-size:17px;font-weight:500}'+
  '.snm-acts .a1{background:#CC3370;color:#fff}.snm-acts .a1:hover{background:#E5639A}'+
  '.snm-acts .a2{border:1.5px solid rgba(251,247,244,.6)}.snm-acts .a2:hover{background:rgba(251,247,244,.08)}'+
  '.snm-acts a[aria-current]{box-shadow:0 0 0 3px #E5639A}'+
  '.snm-home{display:inline-block;margin-top:18px;font-size:15px;opacity:.7}'+
  '.snm-soc{margin-top:34px}'+
  '.soc{display:flex;gap:12px}'+
  '.soc a{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;border:1.5px solid currentColor;transition:background .25s,color .25s,border-color .25s,transform .3s cubic-bezier(.3,1.8,.5,1)}'+
  '.soc a:hover{background:#CC3370;border-color:#CC3370;color:#fff;transform:translateY(-3px)}'+
  '.soc svg{width:22px;height:22px}'+
  'body.sn-lock{overflow:hidden}'+
  '@media(max-width:860px){.snm-in{grid-template-columns:minmax(0,1fr);align-items:start;gap:30px;padding-top:96px}.snm-side{border-left:0;padding-left:0;border-top:1px solid rgba(251,247,244,.14);padding-top:26px}.snm ol a{font-size:clamp(26px,7vw,36px);padding:3px 0}.snm-acts{max-width:none}}'+
  '@media(max-width:700px){.sn-boots{display:none}}'+
  '@media(max-width:480px){.sn-book{display:none}.sn-brand>svg{width:38px;height:38px}.sn-brand .ek{height:32px}}'+
  /* footer */
  '.sf{background:#2A1222;color:#FBF7F4;font-family:"DM Sans",system-ui,sans-serif;padding:clamp(56px,8vw,96px) max(7vw,24px) 34px}'+
  '.sf a{color:inherit;text-decoration:none}'+
  '.sf-g{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr);gap:clamp(30px,5vw,70px)}'+
  '.sf-brand{display:inline-flex;align-items:center;gap:10px;color:#E5639A}.sf-brand>svg{width:52px;height:52px}.sf-brand .ek{height:46px}'+
  '.sf-tag{margin:16px 0 0;max-width:32em;line-height:1.7;opacity:.85;font-size:15px}'+
  '.sf h3{font:500 12px "DM Sans",system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.55;margin:6px 0 14px;color:inherit}'+
  '.sf ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}'+
  '.sf ol a{font-size:15px;opacity:.85}.sf ol a:hover{opacity:1;color:#E5639A}'+
  '.sf .ek{height:1.5em;vertical-align:-.45em}'+
  '.sf-acts{display:grid;gap:10px;max-width:240px}'+
  '.sf-acts a{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:999px;font-size:15px;font-weight:500}'+
  '.sf-acts .a1{background:#CC3370;color:#fff}.sf-acts .a1:hover{background:#E5639A}'+
  '.sf-acts .a2{border:1.5px solid rgba(251,247,244,.55)}.sf-acts .a2:hover{background:rgba(251,247,244,.08)}'+
  '.sf-c{margin-top:clamp(40px,6vw,70px);padding-top:22px;border-top:1px solid rgba(251,247,244,.14);display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font-size:14px;opacity:.7}'+
  '@media(max-width:860px){.sf-g{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.sf-g>div:first-child{grid-column:1/-1}}'+
  '@media(max-width:480px){.sf-g{grid-template-columns:minmax(0,1fr)}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var journey=J.map(function(j){return '<li><a href="'+href(j[0])+'"'+go+'><span>'+j[1]+'</span></a></li>'}).join('');

  /* ---- header + menu ---- */
  var slot=document.querySelector('[data-site-nav]');
  if(slot){
    var h=document.createElement('header');h.className='sn';h.id='siteNav';
    h.innerHTML='<a class="sn-brand" href="'+(HOME?'#top':'index.html')+'"'+go+' aria-label="Erika Life, home"><svg aria-hidden="true"><use href="#bloom"/></svg><span class="ek" aria-hidden="true"><svg><use href="#wm"/></svg></span></a>'+
      '<a class="sn-btn sn-boots" href="boots.html"'+cur('boots.html')+'>Get your boots</a>'+
      '<a class="sn-btn sn-book" href="booking.html"'+cur('booking.html')+'>Book your class</a>'+
      '<button class="sn-menu" id="snMenu" type="button" aria-expanded="false" aria-controls="snMenuPanel"><i aria-hidden="true"></i><span>Menu</span></button>';
    var m=document.createElement('div');m.className='snm';m.id='snMenuPanel';m.setAttribute('role','dialog');m.setAttribute('aria-label','Menu');
    m.innerHTML='<div class="snm-in">'+
      '<nav aria-label="The journey"><p class="snm-k">The journey</p><ol>'+journey+'</ol></nav>'+
      '<div class="snm-side"><h2>Ready to <em>bounce?</em></h2>'+
        '<div class="snm-acts"><a class="a1" href="booking.html"'+cur('booking.html')+'>Book your class</a><a class="a2" href="boots.html"'+cur('boots.html')+'>Get your boots</a></div>'+
        (HOME?'':'<a class="snm-home" href="index.html">← Back to home</a>')+
        '<div class="snm-soc"><p class="snm-k">Follow Erika</p><div class="soc">'+SOC+'</div></div>'+
      '</div></div>';
    slot.replaceWith(h);h.after(m);
    var B=h.querySelector('#snMenu');
    var set=function(o){if(m.classList.contains('open')===o)return;m.classList.toggle('open',o);h.classList.toggle('open',o);document.body.classList.toggle('sn-lock',o);B.setAttribute('aria-expanded',o);B.querySelector('span').textContent=o?'Close':'Menu';
      try{window.dispatchEvent(new CustomEvent('sitenav',{detail:{open:o}}))}catch(e){}
      if(o&&window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(m.querySelectorAll('ol li,.snm-side>*'),{y:-40,opacity:0},{y:0,opacity:1,duration:.7,ease:'back.out(1.8)',stagger:.04,overwrite:true})};
    window.SiteNav={open:function(){set(true)},close:function(){set(false)}};
    B.addEventListener('click',function(){set(!m.classList.contains('open'))});
    m.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open')){set(false);B.focus()}});
  }

  /* ---- footer ---- */
  function renderFooter(){
  var fslot=document.querySelector('[data-site-footer]');
  if(fslot){
    var f=document.createElement('footer');f.className='sf';
    f.innerHTML='<div class="sf-g">'+
      '<div><a class="sf-brand" href="'+(HOME?'#top':'index.html')+'"'+go+' aria-label="Erika Life, home"><svg aria-hidden="true"><use href="#bloom"/></svg><span class="ek" aria-hidden="true" style="height:46px"><svg><use href="#wm"/></svg></span></a>'+
        '<p class="sf-tag">'+WM+' Life | Bounce Experiences | Bouncing classes with boots.<br>From Hungary to Egypt, from Egypt to worldwide.<br>Where joy meets power. Where souls go back to nature.</p></div>'+
      '<nav aria-label="Footer journey"><h3>The journey</h3><ol>'+journey+'</ol></nav>'+
      '<div><h3>Ready to bounce?</h3><div class="sf-acts"><a class="a1" href="booking.html">Book your class</a><a class="a2" href="boots.html">Get your boots</a></div>'+
        '<h3 style="margin-top:30px">Follow Erika</h3><div class="soc">'+SOC+'</div></div>'+
      '</div>'+
      '<div class="sf-c"><span>© 2026 '+WM+' Life</span><span>Rebound boots classes in Egypt</span></div>';
    fslot.replaceWith(f);
  }
  }
  if(document.querySelector('[data-site-footer]'))renderFooter();else document.addEventListener('DOMContentLoaded',renderFooter);

  /* brand symbols: borrow from the home page if this page doesn't carry them */
  if(!document.getElementById('bloom')||!document.getElementById('wm')){
    fetch('index.html').then(function(r){return r.text()}).then(function(t){
      var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');s.style.position='absolute';
      var out='';['bloom','wm'].forEach(function(id){if(!document.getElementById(id)){var mm=t.match(new RegExp('<symbol id="'+id+'"[\\s\\S]*?<\\/symbol>'));if(mm)out+=mm[0]}});
      s.innerHTML=out;document.body.appendChild(s);
    }).catch(function(){});
  }
})();

/* visitor source, analytics, settings and chat on every public page */
(function(){
  if(/admin/.test(location.pathname))return;
  /* where this visitor came from (kept for this visit, sent with chat requests) */
  try{if(!sessionStorage.getItem('erikaSrc')){var q=new URLSearchParams(location.search),r=document.referrer,src='Direct';
    if(q.get('utm_source'))src=q.get('utm_source')+(q.get('utm_medium')?' / '+q.get('utm_medium'):'')+(q.get('utm_campaign')?' / '+q.get('utm_campaign'):'');
    else if(q.get('fbclid'))src='Facebook / Instagram';
    else if(r&&r.indexOf(location.host)<0){try{src=new URL(r).hostname.replace(/^www\./,'')}catch(e){src=r}}
    sessionStorage.setItem('erikaSrc',src)}}catch(e){}
  /* Google Analytics 4 (Erika's account) */
  var GA=window.ERIKA_GA||'G-79N4N8M1ZV';
  if(/^G-[A-Z0-9]{6,}$/.test(GA)){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA);
    var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(g)}
  function add(src){var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
  if(window.ERIKA_API===undefined)add('js/erika-config.js?v=2');
  add('js/erika-chat.js?v=7');
})();
