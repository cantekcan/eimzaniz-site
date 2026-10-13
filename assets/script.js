(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// header
const hdr=$('#hdr'),burger=$('#burger'),menu=$('#menu');
const onScroll=()=>hdr.classList.toggle('solid',scrollY>30);onScroll();addEventListener('scroll',onScroll,{passive:true});
burger.addEventListener('click',()=>burger.setAttribute('aria-expanded',String(menu.classList.toggle('open'))));
$$('a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}));

// scroll spy
const links=$$('a',menu),map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('on'));const l=map.get(e.target.id);if(l)l.classList.add('on')}}),{rootMargin:'-45% 0px -50% 0px'});
map.forEach((_,id)=>{const s=document.getElementById(id);if(s)spy.observe(s)});

// reveal
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>rv.observe(el));

// tabs (generic)
function tabs(tabSel,panelSel){
  const ts=$$(tabSel);
  ts.forEach(t=>t.addEventListener('click',()=>{
    ts.forEach(x=>{x.setAttribute('aria-selected',String(x===t));const p=document.getElementById(x.getAttribute('aria-controls'));p.classList.toggle('on',x===t);p.hidden=x!==t});
  }));
  ts.forEach((t,i)=>t.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=ts[(i+(e.key==='ArrowRight'?1:ts.length-1))%ts.length];n.focus();n.click()}
  }));
}
tabs('.tab');tabs('.pt button');

// open/closed badge (Europe/Istanbul, Mon-Fri 10:00-18:30)
(()=>{
  try{
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()).map(x=>[x.type,x.value]));
    const mins=(+p.hour%24)*60+ +p.minute,wd=['Mon','Tue','Wed','Thu','Fri'].includes(p.weekday);
    const open=wd&&mins>=600&&mins<1110;
    if($('#dot')){$('#dot').classList.toggle('open',open);
    $('#openTxt').textContent=open?'Şu an açığız · Ataşehir ofisi · 18:30\'a kadar':'Ataşehir ofisi · Hafta içi 10:00–18:30';}
  }catch(e){}
})();

// WhatsApp wizard
const wiz=$('#wiz'),send=$('#send');if(wiz){
function build(){
  const v=n=>(wiz.querySelector(`[name=${n}]:checked`)||{}).value;
  const nerede=$$('[name=nerede]:checked',wiz).map(x=>x.value);
  const ad=wiz.ad.value.trim();
  let t=`Merhaba${ad?', ben '+ad:''}. ${v('kim')==='bireysel'?'Bireysel olarak':v('kim')==='şirket / kurum'?'Şirket / kurum adına':'Mali müşavir / avukat olarak'} ${v('islem')} hakkında bilgi almak istiyorum.`;
  if(nerede.length)t+=` Kullanım alanı: ${nerede.join(', ')}.`;
  send.href='https://wa.me/905334606818?text='+encodeURIComponent(t);
}
wiz.addEventListener('input',build);wiz.addEventListener('submit',e=>e.preventDefault());build();}

// dialogs
$$('[data-dlg]').forEach(b=>b.addEventListener('click',()=>{const d=document.getElementById(b.dataset.dlg);d.showModal?d.showModal():d.setAttribute('open','')}));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
})();
