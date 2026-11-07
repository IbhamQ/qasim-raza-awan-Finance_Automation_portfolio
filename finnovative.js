(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const menu=document.getElementById('menu-toggle'),nav=document.getElementById('main-navigation');
 const closeMenu=()=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');};
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))closeMenu();});
 if('IntersectionObserver'in window&&!reduce.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}});},{threshold:.08});document.querySelectorAll('.section>.eyebrow,.section>h2,.service-card,.company-tile,.curated-card,.skill,.about,.contact').forEach(el=>{el.classList.add('reveal');observer.observe(el);});document.body.classList.add('motion-ready');}
})();
