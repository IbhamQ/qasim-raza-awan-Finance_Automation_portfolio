import {animate,onScroll} from 'animejs';
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 animate('.hero-copy > *',{translateY:[12,0],opacity:[0,1],duration:700,delay:(_,i)=>70*i,ease:'out(3)'});
 animate('.hero-reports',{translateY:[20,0],opacity:[0,1],duration:1000,ease:'out(3)'});
 document.querySelectorAll('.analytics-card,.project,.company-tile,.skill').forEach(el=>{animate(el,{translateY:[14,0],opacity:[.4,1],duration:600,ease:'out(3)',autoplay:onScroll({target:el,enter:'bottom-=30 top',repeat:false})})});
}
