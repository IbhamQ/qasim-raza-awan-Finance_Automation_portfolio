// A single DOM/CSS 3D composition: identical framing on GPU and non-WebGL browsers.
for (const host of document.querySelectorAll('[data-workspace]')) {
 const view=host.querySelector('.mesh-viewport');
 const financeMarkup=`<div class="integrated-scene" role="img" aria-label="Animated dimensional spreadsheet connects through a control engine to a reconciled ledger. Synthetic example records.">
 <svg class="flow-conduits" viewBox="0 0 700 350" aria-hidden="true"><path class="conduit" d="M175 150H330V210H550V160M330 210V285H550V230"/><path class="flow-trace" d="M175 150H330V210H550V160M330 210V285H550V230"/></svg>
 <div class="scene-sheet"><div class="sheet-chrome"><i></i><i></i><i></i><span>RECONCILIATION / SOURCE</span></div><div class="sheet-formula">ƒx <span>= ROUND(Booked − Billed, 2)</span></div><div class="sheet-grid"><b>REF</b><b>BOOKED</b><b>BILLED</b><span>INV-1042</span><span>1,200.00</span><span>1,200.00</span><span>INV-1043</span><span>750.00</span><span>725.00</span><span>INV-1044</span><span>480.00</span><span>480.00</span><b>TOTAL</b><b>2,430.00</b><b>2,405.00</b></div><div class="sheet-sweep"></div></div>
 <div class="control-stack"><div class="stack-layer layer-bottom"></div><div class="stack-layer layer-mid"></div><div class="stack-layer layer-top"><span>ƒ</span></div><small>VALIDATE / MATCH</small></div>
 <div class="scene-ledger"><div class="ledger-title">CONTROL REGISTER <span>LIVE EXAMPLE</span></div><div><span>1042</span><b>0.00</b><em>✓ MATCH</em></div><div><span>1043</span><b>25.00</b><em class="review">REVIEW</em></div><div><span>1044</span><b>0.00</b><em>✓ MATCH</em></div><div class="ledger-bars"><i></i><i></i><i></i><i></i><i></i><i></i><span>TRACEABLE OUTPUT</span></div></div>
 <span class="flow-caption source-caption">01 / SOURCE RECORDS</span><span class="flow-caption output-caption">03 / EXPLAINED BALANCES</span></div>`;
 const customerMarkup=`<div class="integrated-scene scene-customer" role="img" aria-label="Scripted example: a caller requests an appointment, availability is checked and a booking is prepared.">
 <svg class="flow-conduits" viewBox="0 0 700 350" aria-hidden="true"><path class="conduit" d="M175 150H330V210H550V160M330 210V285H550V230"/><path class="flow-trace" d="M175 150H330V210H550V160M330 210V285H550V230"/></svg>
 <div class="scene-sheet"><div class="conversation-title">INCOMING CALL / SCRIPTED EXAMPLE</div><div class="call-message"><small>CALLER</small>Can I book a consultation for Tuesday afternoon?</div><div class="call-message reply"><small>BOOKING ASSISTANT</small>There are two available times. Would 2 pm work for you?</div><div class="scene-step">Details captured</div></div>
 <div class="control-stack"><div class="stack-layer layer-bottom"></div><div class="stack-layer layer-mid"></div><div class="stack-layer layer-top"><span>↗</span></div><small>CHECK / ROUTE / CONFIRM</small></div>
 <div class="scene-ledger"><div class="ledger-title">BOOKING WORKFLOW</div><div><span>AVAILABILITY</span><em>CHECK SLOT</em></div><div><span>CONTACT</span><em>SAVE DETAILS</em></div><div><span>CALENDAR</span><em>CONFIRM</em></div><div class="scene-step">Summary → CRM / team</div></div>
 <span class="flow-caption source-caption">01 / CALL OR MESSAGE</span><span class="flow-caption output-caption">03 / BOOKING & HANDOVER</span></div>`;
 function fit(){const node=view.querySelector('.integrated-scene');if(!node)return;const scale=Math.min(view.clientWidth/740,view.clientHeight/400,1.15);node.style.transform='translate(-50%, -50%) scale('+scale+')';}
 function show(mode){view.innerHTML=mode==='customer'?customerMarkup:financeMarkup;host.dataset.mode=mode;fit();}
 show(document.documentElement.dataset.brand==='company'?'customer':'finance');
 const tabs=[...host.querySelectorAll('[data-scene]')];
 function select(tab){tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===tab));b.tabIndex=b===tab?0:-1;});view.setAttribute('aria-labelledby',tab.id);show(tab.dataset.scene);}
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(b));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[n]);tabs[n].focus();});});
 document.querySelectorAll('[data-route]').forEach(a=>a.addEventListener('click',()=>{const tab=tabs.find(b=>b.dataset.scene===a.dataset.route);if(tab)select(tab);}));
 const resize=new ResizeObserver(fit);resize.observe(view);
 let inView=true;const visibility=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;pause();});visibility.observe(view);
 function pause(){host.classList.toggle('scene-paused',!inView||document.hidden);}document.addEventListener('visibilitychange',pause);
 window.addEventListener('pagehide',event=>{if(!event.persisted){resize.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',pause);}},{once:true});
 view.dataset.ready='true';

 const deck=host.querySelector('.software-deck');
 if(deck){deck.setAttribute('aria-label','Connected software examples');for(const img of deck.querySelectorAll('img')){const name=img.parentElement.textContent.trim();img.alt=name;}}
}
