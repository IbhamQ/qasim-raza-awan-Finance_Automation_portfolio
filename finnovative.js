(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const control=document.getElementById('motion-control');
 const scene=document.querySelector('.finance-scene');
 let paused=reduce.matches,frame=0;
 const update=()=>{document.body.classList.toggle('motion-paused',paused);if(control){control.textContent=paused?'Resume motion ↗':'Pause motion Ⅱ';control.setAttribute('aria-pressed',String(paused));}};
 control?.addEventListener('click',()=>{paused=!paused;update();});update();
 if(scene&&matchMedia('(pointer:fine)').matches){scene.addEventListener('pointermove',e=>{if(paused||reduce.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=scene.getBoundingClientRect();scene.style.setProperty('--scene-rx',((e.clientY-r.top)/r.height-.5)*-5+'deg');scene.style.setProperty('--scene-ry',((e.clientX-r.left)/r.width-.5)*8+'deg');});});scene.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);scene.style.setProperty('--scene-rx','0deg');scene.style.setProperty('--scene-ry','0deg');});}
 reduce.addEventListener('change',e=>{paused=e.matches;update();});
 const menu=document.getElementById('menu-toggle'),nav=document.getElementById('main-navigation');
 const closeMenu=()=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');};
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))closeMenu();});
 if('IntersectionObserver'in window&&!reduce.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}});},{threshold:.08});document.querySelectorAll('.section>.eyebrow,.section>h2,.service-card,.company-tile,.curated-card,.skill,.about,.contact').forEach(el=>{el.classList.add('reveal');observer.observe(el);});document.body.classList.add('motion-ready');}
})();
