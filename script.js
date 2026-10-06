'use strict';
(() => {
 const $ = id => document.getElementById(id);
 const screens={INTRO:$('intro'),GAME:$('game'),WIN:$('win')};
 const sticker=$('sticker'), target=$('target'), feedback=$('feedback');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let state='INTRO', drag=null, timers=[], frame=0;
 const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id;};
 function cleanup(){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(frame);$('money-rain').replaceChildren();$('transition').hidden=true;}
 function release(){if(drag&&sticker.hasPointerCapture(drag.id))sticker.releasePointerCapture(drag.id);drag=null;sticker.classList.remove('dragging');sticker.removeAttribute('style');target.classList.remove('near');}
 function show(next){state=next;document.body.dataset.state=next;for(const [key,el]of Object.entries(screens))el.hidden=key!==next;}
 function reset(next='INTRO'){cleanup();release();target.classList.remove('completed');sticker.disabled=false;sticker.style.visibility='';$('product-state').textContent='BEZ BRANDU';$('drop-hint').textContent='Stačí přiblížit. Brand se přichytí sám.';feedback.textContent='Jedna samolepka. První krok k miliardě.';show(next);window.scrollTo(0,0);if(next==='GAME')$('game-title').focus({preventScroll:true});else $('start').focus({preventScroll:true});}
 function start(){if(state!=='INTRO')return;state='TRANSITION';$('transition').hidden=false;later(()=>reset('GAME'),reduced.matches?0:700);}
 function inTarget(x,y){const r=target.getBoundingClientRect();return x>=r.left-30&&x<=r.right+30&&y>=r.top-30&&y<=r.bottom+30;}
 function position(e){if(!drag)return;const x=Math.max(0,Math.min(innerWidth-drag.width,e.clientX-drag.ox));const y=Math.max(0,Math.min(innerHeight-drag.height,e.clientY-drag.oy));sticker.style.left=x+'px';sticker.style.top=y+'px';drag.near=inTarget(x+drag.width/2,y+drag.height/2)||inTarget(e.clientX,e.clientY);target.classList.toggle('near',drag.near);}
 sticker.addEventListener('pointerdown',e=>{if(state!=='GAME'||drag||e.isPrimary===false||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();const r=sticker.getBoundingClientRect();drag={id:e.pointerId,width:r.width,height:r.height,ox:e.clientX-r.left,oy:e.clientY-r.top,near:false};sticker.style.width=r.width+'px';sticker.style.left=r.left+'px';sticker.style.top=r.top+'px';sticker.classList.add('dragging');sticker.setPointerCapture(e.pointerId);feedback.textContent='Přesuň samolepku na plechovku a pusť ji.';});
 sticker.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id){e.preventDefault();position(e);}});
 sticker.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;position(e);if(drag.near)complete();else{release();feedback.textContent='Ještě kousek! Zkus samolepku pustit přímo nad plechovkou.';}});
 const cancel=()=>{if(drag){release();feedback.textContent='Samolepka je zpátky. Zkus to znovu.';}};
 sticker.addEventListener('pointercancel',cancel);sticker.addEventListener('lostpointercapture',()=>{if(drag&&state==='GAME')cancel();});
 sticker.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&state==='GAME'){e.preventDefault();complete();}if(e.key==='Escape')cancel();});
 window.addEventListener('resize',cancel);window.addEventListener('blur',cancel);
 function complete(){if(state!=='GAME')return;state='SUCCESS';document.body.dataset.state='SUCCESS';feedback.textContent='VÝBORNĚ! PLECHOVKA JE HOTOVÁ.';$('product-state').textContent='KUBÍČEK ✓';$('drop-hint').textContent='KUBÍČEK TO ZAŘÍDIL.';sticker.disabled=true;
  if(drag){const r=target.getBoundingClientRect();sticker.style.transition=reduced.matches?'none':'left .22s ease, top .22s ease, opacity .22s ease, transform .22s ease';sticker.style.left=(r.left+r.width/2-drag.width/2)+'px';sticker.style.top=(r.top+r.height/2-drag.height/2)+'px';sticker.style.transform='scale(.5)';sticker.style.opacity='0';}
  later(()=>{release();sticker.style.visibility='hidden';target.classList.add('completed');},reduced.matches?0:220);
  later(win,reduced.matches?850:1500);
 }
 function win(){show('WIN');window.scrollTo(0,0);$('win-title').focus({preventScroll:true});$('fortune').textContent='1 000 000 000';if(reduced.matches)return;
  const started=performance.now();function count(now){if(state!=='WIN')return;const t=Math.min((now-started)/1150,1);$('fortune').textContent=Math.round((1-Math.pow(1-t,3))*1e9).toLocaleString('cs-CZ');if(t<1)frame=requestAnimationFrame(count);}frame=requestAnimationFrame(count);
  const rain=$('money-rain');for(let i=0;i<22;i++){const bill=document.createElement('span');bill.className='banknote';bill.textContent=['+1 MIL.','+5 MIL.','+100 MIL.','KUBÍČEK / Kč'][i%4];bill.style.setProperty('--x',Math.random()*96+'%');bill.style.setProperty('--duration',2.7+Math.random()*1.2+'s');bill.style.setProperty('--delay',Math.random()*1.3+'s');bill.style.setProperty('--drift',(Math.random()-.5)*240+'px');bill.style.setProperty('--spin',(Math.random()-.5)*160+'deg');rain.append(bill);}later(()=>rain.replaceChildren(),5500);
 }
 $('start').addEventListener('click',start);$('restart').addEventListener('click',()=>reset('GAME'));$('home').addEventListener('click',()=>reset());document.querySelector('.wordmark').addEventListener('click',e=>{e.preventDefault();reset();});
})();
