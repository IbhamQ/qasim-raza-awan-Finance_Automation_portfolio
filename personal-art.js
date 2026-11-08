// Progressive motion only: content remains visible if animation or scripting is unavailable.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const nodes=[...document.querySelectorAll('.studio-project,.direct-demo,.company-tile,.about')];
 nodes.forEach(n=>n.classList.add('art-reveal'));
 if('IntersectionObserver'in window&&!reduce.matches){
  const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('art-animate');reveal.unobserve(e.target);}},{threshold:.08});nodes.forEach(n=>reveal.observe(n));
 }
 const bench=document.querySelector('.hero-workbench');
 if(bench&&'IntersectionObserver'in window){let visible=true;const pause=()=>bench.classList.toggle('art-paused',!visible||document.hidden);const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;pause();});observer.observe(bench);document.addEventListener('visibilitychange',pause);}
})();
