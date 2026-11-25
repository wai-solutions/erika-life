/* Erika Life — shared site menu for inner pages (same links as the home page) */
(function(){
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  var links=[
    ['index.html#meet','Meet <span class="ek" role="img" aria-label="Erika"><svg aria-hidden="true"><use href="#wm"/></svg></span>'],
    ['index.html#spirit','Her spirit'],
    ['index.html#nature','Back to nature'],
    ['index.html#levels','Levels'],
    ['index.html#classes','Classes'],
    ['index.html#faq','Questions'],
    ['boots.html','Boots']
  ];
  var css=''+
  '.sn{position:fixed;top:0;left:0;right:0;z-index:80;display:flex;align-items:center;gap:18px;padding:12px max(4vw,16px);background:rgba(251,247,244,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 1px 0 rgba(42,18,34,.08);color:#2A1222;font-family:"DM Sans",system-ui,sans-serif}'+
  '.sn a{color:inherit}'+
  '.sn-brand{display:flex;align-items:center;gap:8px;text-decoration:none;flex:none}'+
  '.sn-brand>svg{width:44px;height:44px;color:#CC3370}'+
  '.sn-brand .ek{display:inline-block;height:38px;aspect-ratio:1388/590;color:#CC3370}.sn-brand .ek svg{width:100%;height:100%}'+
  '.sn-links{display:flex;align-items:center;gap:2px;margin-left:auto}'+
  '.sn-links a{text-decoration:none;font-size:15px;padding:10px 12px;border-radius:999px;white-space:nowrap;transition:background .2s}'+
  '.sn-links a:hover,.sn-links a[aria-current]{background:rgba(204,51,112,.12)}'+
  '.sn-links .ek{display:inline-block;height:1.5em;aspect-ratio:1388/590;vertical-align:-.45em}.sn-links .ek svg{width:100%;height:100%}'+
  '.sn-links .sn-home,.sn-links .sn-mbook,.sn-links .sn-soc{display:none}'+
  '.sn-book{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border-radius:999px;background:#CC3370;color:#fff!important;text-decoration:none;font-size:15px;font-weight:500;white-space:nowrap;flex:none}'+
  '.sn-book:hover{background:#A3214F}'+
  '.sn-menu{display:none;margin-left:auto;background:none;border:0;color:inherit;font:500 15px "DM Sans",system-ui,sans-serif;min-height:44px;cursor:pointer;align-items:center;gap:10px;padding:0 6px}'+
  '.sn-menu i{display:grid;gap:5px;width:22px}.sn-menu i::before,.sn-menu i::after{content:"";height:2px;background:currentColor;border-radius:2px;transition:transform .35s}'+
  'body.sn-lock{overflow:hidden}'+
  '@media(max-width:1180px){'+
   '.sn-menu{display:flex}'+
   '.sn.open{background:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none;color:#FBF7F4}'+
   '.sn.open .sn-brand>svg,.sn.open .sn-brand .ek{color:#E5639A}'+
   '.sn.open .sn-menu i::before{transform:translateY(3.5px) rotate(45deg)}.sn.open .sn-menu i::after{transform:translateY(-3.5px) rotate(-45deg)}'+
   '.sn.open>.sn-book{opacity:0;pointer-events:none}'+
   '.sn-links{position:fixed;inset:0;z-index:-1;margin:0;flex-direction:column;justify-content:center;align-items:flex-start;gap:2px;padding:100px max(7vw,24px) 40px;background:#2A1222;color:#FBF7F4;overflow-y:auto;opacity:0;visibility:hidden;transition:opacity .4s,visibility 0s .4s}'+
   '.sn-links.open{opacity:1;visibility:visible;transition:opacity .4s}'+
   '.sn-links a{font:400 clamp(30px,6.4vw,52px)/1.15 "Playfair Display",Georgia,serif;padding:5px 0;border-radius:0}'+
   '.sn-links a:hover,.sn-links a[aria-current]{background:none;color:#E5639A}'+
   '.sn-links .sn-home{display:block}'+
   '.sn-links .sn-mbook{display:inline-flex;margin-top:26px;font:500 17px "DM Sans",system-ui,sans-serif;padding:0 30px;min-height:50px;align-items:center;border-radius:999px;background:#CC3370;color:#fff}'+
   '.sn-links .sn-soc{display:flex;gap:22px;margin-top:24px}.sn-links .sn-soc a{font:15px "DM Sans",system-ui,sans-serif;opacity:.8}'+
  '}'+
  '@media(max-width:520px){.sn>.sn-book{display:none}.sn-brand>svg{width:38px;height:38px}.sn-brand .ek{height:32px}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var cur=function(h){return h===page?' aria-current="page"':''};
  var html='<a class="sn-brand" href="index.html" aria-label="Erika Life, home"><svg aria-hidden="true"><use href="#bloom"/></svg><span class="ek" aria-hidden="true"><svg><use href="#wm"/></svg></span></a>'+
    '<nav class="sn-links" id="snLinks" aria-label="Main">'+
    '<a class="sn-home" href="index.html">Home</a>'+
    links.map(function(l){return '<a href="'+l[0]+'"'+cur(l[0])+'>'+l[1]+'</a>'}).join('')+
    '<a class="sn-mbook" href="booking.html"'+cur('booking.html')+'>Book your class</a>'+
    '<div class="sn-soc"><a href="https://www.instagram.com/erikaszenes/" target="_blank" rel="noopener">Instagram</a><a href="https://www.tiktok.com/@erikaszenes.bouncefit" target="_blank" rel="noopener">TikTok</a><a href="https://www.facebook.com/ErikaSzenes" target="_blank" rel="noopener">Facebook</a></div>'+
    '</nav>'+
    '<button class="sn-menu" id="snMenu" type="button" aria-expanded="false" aria-controls="snLinks"><i aria-hidden="true"></i><span>Menu</span></button>'+
    '<a class="sn-book" href="booking.html">Book your class</a>';
  var h=document.createElement('header');h.className='sn';h.id='siteNav';h.innerHTML=html;
  var slot=document.querySelector('[data-site-nav]');
  if(slot)slot.replaceWith(h);else document.body.insertBefore(h,document.body.firstChild);

  /* brand symbols: borrow from the home page if this page doesn't carry them */
  if(!document.getElementById('bloom')||!document.getElementById('wm')){
    fetch('index.html').then(function(r){return r.text()}).then(function(t){
      var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');s.style.position='absolute';
      var out='';['bloom','wm'].forEach(function(id){if(!document.getElementById(id)){var m=t.match(new RegExp('<symbol id="'+id+'"[\\s\\S]*?<\\/symbol>'));if(m)out+=m[0]}});
      s.innerHTML=out;document.body.appendChild(s);
    }).catch(function(){});
  }

  var L=document.getElementById('snLinks'),B=document.getElementById('snMenu');
  function set(o){L.classList.toggle('open',o);h.classList.toggle('open',o);document.body.classList.toggle('sn-lock',o);B.setAttribute('aria-expanded',o);B.querySelector('span').textContent=o?'Close':'Menu'}
  B.addEventListener('click',function(){set(!L.classList.contains('open'))});
  L.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&L.classList.contains('open')){set(false);B.focus()}});
})();
