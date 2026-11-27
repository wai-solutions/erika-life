/* Erika Life — "Talk to us" chat button and request form (every page)
   Sends each request by email through FormSubmit (formsubmit.co), no backend needed.
   To change who receives requests, edit TO and CC below. */
(function(){
  if(window.__erikaChat)return;window.__erikaChat=true;
  var TO='inas.bakeer@wai-s.com';
  var CC='erika.bouncefit@gmail.com';
  var ENDPOINT='https://formsubmit.co/ajax/'+TO;
  var CATS=['Book a class','Buy boots','Partnership & collaboration','Sponsorship','Events & corporate','Other'];

  var css=''+
  '.ec-btn{position:fixed;right:clamp(14px,2.4vw,28px);bottom:clamp(14px,2.4vw,28px);z-index:80;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:var(--rose,#CC3370);color:#fff;display:grid;place-items:center;box-shadow:0 12px 30px rgba(42,18,34,.32);transition:transform .25s cubic-bezier(.3,1.6,.5,1),background .25s}'+
  '.ec-btn:hover{transform:translateY(-3px) scale(1.05);background:#B52A61}.ec-btn:focus-visible{outline:3px solid #F1CFE0;outline-offset:3px}'+
  '.ec-btn svg{width:28px;height:28px}.ec-btn .x{display:none}.ec-open .ec-btn .x{display:block}.ec-open .ec-btn .b{display:none}'+
  '.ec-btn::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--rose,#CC3370);animation:ecping 2.4s ease-out 2s 3;opacity:0}'+
  '@keyframes ecping{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.6);opacity:0}}'+
  '.ec-tip{position:fixed;right:clamp(84px,calc(2.4vw + 72px),100px);bottom:clamp(26px,calc(2.4vw + 12px),40px);z-index:80;background:#fff;color:#2A1222;font:500 14px var(--sans,"DM Sans",system-ui,sans-serif);padding:9px 14px;border-radius:14px;box-shadow:0 8px 24px rgba(42,18,34,.16);opacity:0;transform:translateX(8px);transition:opacity .3s,transform .3s;pointer-events:none;white-space:nowrap}'+
  '.ec-tip.on{opacity:1;transform:none}.ec-open .ec-tip{opacity:0}'+
  '.ec-panel{position:fixed;right:clamp(14px,2.4vw,28px);bottom:calc(clamp(14px,2.4vw,28px) + 74px);z-index:85;width:min(390px,calc(100vw - 28px));max-height:calc(100svh - 120px);overflow:auto;overscroll-behavior:contain;background:#FBF7F4;color:#2A1222;border-radius:26px;box-shadow:0 30px 70px rgba(42,18,34,.35);font:400 15px/1.5 var(--sans,"DM Sans",system-ui,sans-serif);opacity:0;visibility:hidden;transform:translateY(16px) scale(.98);transform-origin:100% 100%;transition:opacity .25s,transform .3s cubic-bezier(.2,.9,.3,1),visibility 0s .3s}'+
  '.ec-open .ec-panel{opacity:1;visibility:visible;transform:none;transition:opacity .25s,transform .3s cubic-bezier(.2,.9,.3,1)}'+
  '.ec-head{background:#2A1222;color:#FBF7F4;padding:20px 22px 18px;border-radius:26px 26px 0 0}'+
  '.ec-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px;color:#FBF7F4}.ec-logo .bl{width:34px;height:34px;color:#E5639A}.ec-logo .wm{width:74px;height:32px;color:#FBF7F4}.ec-logo span{font:400 15px var(--sans,"DM Sans",system-ui,sans-serif);opacity:.9;white-space:nowrap}'+
  '.ec-head h2{font:italic 400 24px/1.2 var(--serif,"Playfair Display",Georgia,serif);margin:0}.ec-head p{margin:6px 0 0;opacity:.8;font-size:14px}'+
  '.ec-form{padding:18px 22px 22px;display:grid;gap:12px}'+
  '.ec-form label{display:grid;gap:5px;font-weight:500;font-size:14px}.ec-form label i{font-style:normal;font-weight:400;opacity:.65}.ec-form label span b{color:#CC3370;font-weight:500}'+
  '.ec-form input,.ec-form select,.ec-form textarea{font:inherit;color:inherit;background:#fff;border:1.5px solid #E8D9DF;border-radius:14px;padding:11px 13px;width:100%;box-sizing:border-box;min-height:46px}'+
  '.ec-form textarea{min-height:96px;resize:vertical}'+
  '.ec-form input:focus,.ec-form select:focus,.ec-form textarea:focus{outline:none;border-color:#CC3370;box-shadow:0 0 0 3px rgba(204,51,112,.15)}'+
  '.ec-form .bad{border-color:#C0392B}'+
  '.ec-err{color:#B02A37;font-size:13px;min-height:0}'+
  '.ec-send{border:0;border-radius:999px;background:#CC3370;color:#fff;font:500 16px var(--sans,"DM Sans",system-ui,sans-serif);min-height:50px;cursor:pointer;transition:background .2s}'+
  '.ec-send:hover{background:#B52A61}.ec-send[disabled]{opacity:.6;cursor:wait}'+
  '.ec-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}'+
  '.ec-done{padding:34px 26px 32px;text-align:center;display:none}.ec-sent .ec-form{display:none}.ec-sent .ec-done{display:block}'+
  '.ec-done .ok{width:64px;height:64px;border-radius:50%;background:#F1CFE0;color:#CC3370;display:grid;place-items:center;margin:0 auto 16px}'+
  '.ec-done h3{font:italic 400 26px/1.2 var(--serif,"Playfair Display",Georgia,serif);margin:0 0 8px}.ec-done p{margin:0 0 20px}'+
  '.ec-done button{border:1.5px solid #2A1222;background:none;color:#2A1222;border-radius:999px;padding:10px 22px;font:500 15px var(--sans,"DM Sans",system-ui,sans-serif);cursor:pointer}'+
  '@media(max-width:560px){.ec-btn{width:56px;height:56px}.ec-panel{right:10px;left:10px;width:auto;bottom:80px;max-height:calc(100svh - 96px)}.ec-tip{display:none}}'+
  '@media(prefers-reduced-motion:reduce){.ec-btn::after{animation:none}.ec-panel,.ec-btn{transition:none}}';

  function build(){
    if(document.querySelector('.ec-btn'))return;
    var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    var w=document.createElement('div');w.className='ec';
    var opts='<option value="" disabled selected>Choose a topic</option>'+CATS.map(function(c){return '<option>'+c+'</option>'}).join('');
    var pre=(location.pathname.indexOf('boots')>-1)?'Buy boots':(location.pathname.indexOf('booking')>-1?'Book a class':'');
    w.innerHTML=''+
      '<div class="ec-tip" aria-hidden="true">Questions? Talk to us</div>'+
      '<button class="ec-btn" type="button" aria-label="Talk to us" aria-expanded="false" aria-controls="ecPanel">'+
        '<svg class="b" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.8 3 2.7 6.6 2.7 11.1c0 2.4 1.2 4.6 3.1 6.1l-.7 3.4c-.1.5.4.9.9.6l3.6-2c.8.2 1.6.3 2.4.3 5.2 0 9.3-3.6 9.3-8.2S17.2 3 12 3Zm-4.3 9.4a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4.3 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4.3 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z"/></svg>'+
        '<svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'+
      '</button>'+
      '<div class="ec-panel" id="ecPanel" role="dialog" aria-modal="false" aria-labelledby="ecTitle" data-lenis-prevent>'+
        '<div class="ec-head"><div class="ec-logo" aria-hidden="true"><svg class="bl"><use href="#bloom"/></svg><svg class="wm"><use href="#wm"/></svg><span>Life | Bounce Experiences</span></div><h2 id="ecTitle">Talk to us</h2><p>Classes, boots, partnerships or sponsorship. Send us a note.</p></div>'+
        '<form class="ec-form" novalidate>'+
          '<label><span>Name <b>*</b></span><input name="name" autocomplete="name" required maxlength="80"></label>'+
          '<label><span>Email <b>*</b></span><input name="email" type="email" autocomplete="email" required maxlength="120"></label>'+
          '<label><span>Phone number <i>(if you prefer WhatsApp communication)</i></span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+20 10 0000 0000" maxlength="25"></label>'+
          '<label><span>Topic <b>*</b></span><select name="category" required>'+opts+'</select></label>'+
          '<label><span>Message <b>*</b></span><textarea name="message" required maxlength="2000" placeholder="Tell us how we can help"></textarea></label>'+
          '<div class="ec-hp" aria-hidden="true"><input name="_honey" tabindex="-1" autocomplete="off"></div>'+
          '<div class="ec-err" role="alert"></div>'+
          '<button class="ec-send" type="submit">Send to Erika</button>'+
        '</form>'+
        '<div class="ec-done" aria-live="polite">'+
          '<div class="ok"><svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'+
          '<h3>Thank you!</h3><p>Your request is with us. We will get back to you within 48 hours.</p>'+
          '<button type="button" class="ec-new">Send another request</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(w);

    var btn=w.querySelector('.ec-btn'),panel=w.querySelector('.ec-panel'),form=w.querySelector('.ec-form'),err=w.querySelector('.ec-err'),send=w.querySelector('.ec-send'),tip=w.querySelector('.ec-tip');
    if(pre)form.category.value=pre;
    function toggle(open){
      if(open===undefined)open=!w.classList.contains('ec-open');
      w.classList.toggle('ec-open',open);btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close':'Talk to us');
      if(open)setTimeout(function(){(form.querySelector('.bad')||form.name).focus({preventScroll:true})},250);
    }
    window.erikaChat=toggle;
    btn.addEventListener('click',function(){toggle()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&w.classList.contains('ec-open')){toggle(false);btn.focus()}});
    document.addEventListener('click',function(e){if(w.classList.contains('ec-open')&&!w.contains(e.target))toggle(false)});
    setTimeout(function(){tip.classList.add('on');setTimeout(function(){tip.classList.remove('on')},5000)},4500);
    w.querySelector('.ec-new').addEventListener('click',function(){w.classList.remove('ec-sent');form.reset();if(pre)form.category.value=pre;form.name.focus()});
    form.addEventListener('input',function(e){e.target.classList.remove('bad');err.textContent=''});

    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=form,bad=[],v=function(n){return (f[n].value||'').trim()};
      if(v('name').length<2)bad.push(['name','your name']);
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')))bad.push(['email','a valid email']);
      if(v('phone')&&v('phone').replace(/\D/g,'').length<8)bad.push(['phone','a valid phone number']);
      if(!v('category'))bad.push(['category','a topic']);
      if(v('message').length<3)bad.push(['message','your message']);
      f.querySelectorAll('.bad').forEach(function(x){x.classList.remove('bad')});
      if(bad.length){bad.forEach(function(b){f[b[0]].classList.add('bad')});err.textContent='Please add '+bad.map(function(b){return b[1]}).join(', ')+'.';f[bad[0][0]].focus();return}
      if(v('_honey'))return;
      send.disabled=true;send.textContent='Sending...';err.textContent='';
      var data={
        Name:v('name'),Email:v('email'),Phone:v('phone')||'Not given',Topic:v('category'),Message:v('message'),Page:location.href,
        _subject:'Erika Life request: '+v('category')+' from '+v('name'),
        _replyto:v('email'),_cc:CC,_template:'table',_captcha:'false'
      };
      var src='';try{src=sessionStorage.getItem('erikaSrc')||''}catch(x){}
      data.Source=src||'Direct';
      /* 1. email (FormSubmit)  2. save to Erika's Google Sheet (if connected) */
      var mail=fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||String(j.success)==='false')throw new Error(j.message||'send failed');return true})});
      var API=window.ERIKA_API||'';
      var save=API?fetch(API,{method:'POST',body:JSON.stringify({type:'request',topic:data.Topic,name:data.Name,email:data.Email,phone:v('phone'),message:data.Message,source:data.Source,page:location.pathname})})
        .then(function(r){return r.json()}).then(function(j){if(!j.ok)throw 0;return true}):Promise.reject(0);
      Promise.allSettled([mail,save]).then(function(rs){if(rs.some(function(x){return x.status==='fulfilled'}))return true;throw 0})
        .then(function(){w.classList.add('ec-sent');form.reset();try{window.gtag&&gtag('event','generate_lead',{topic:data.Topic})}catch(x){}})
        .catch(function(){err.textContent='Sorry, your request did not go through. Please try again in a moment.'})
        .then(function(){send.disabled=false;send.textContent='Send to Erika'});
    });
  }
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build);
})();
