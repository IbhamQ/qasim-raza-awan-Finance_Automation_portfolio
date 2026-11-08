// A single DOM/CSS 3D composition: identical framing on GPU and non-WebGL browsers.
for (const host of document.querySelectorAll('[data-workspace]')) {
 const view=host.querySelector('.mesh-viewport');
 const financeMarkup=`<div class="integrated-scene" role="img" aria-label="Animated dimensional spreadsheet connects through a control engine to a reconciled ledger. Synthetic example records.">
 <svg class="flow-conduits" viewBox="0 0 700 350" aria-hidden="true"><path class="conduit" d="M175 150H330V210H550V160M330 210V285H550V230"/><path class="flow-trace" d="M175 150H330V210H550V160M330 210V285H550V230"/></svg>
 <div class="scene-sheet"><div class="sheet-chrome"><i></i><i></i><i></i><span>RECONCILIATION / SOURCE</span></div><div class="sheet-formula">ƒx <span>= ROUND(Booked − Billed, 2)</span></div><div class="sheet-grid"><b>REF</b><b>BOOKED</b><b>BILLED</b><span>INV-1042</span><span>1,200.00</span><span>1,200.00</span><span>INV-1043</span><span>750.00</span><span>725.00</span><span>INV-1044</span><span>480.00</span><span>480.00</span><b>TOTAL</b><b>2,430.00</b><b>2,405.00</b></div><div class="sheet-sweep"></div></div>
 <div class="control-stack"><div class="stack-layer layer-bottom"></div><div class="stack-layer layer-mid"></div><div class="stack-layer layer-top"><span>ƒ</span></div><small>VALIDATE / MATCH</small></div>
 <div class="scene-ledger"><div class="ledger-title">CONTROL REGISTER <span>LIVE EXAMPLE</span></div><div><span>1042</span><b>0.00</b><em>✓ MATCH</em></div><div><span>1043</span><b>25.00</b><em class="review">REVIEW</em></div><div><span>1044</span><b>0.00</b><em>✓ MATCH</em></div><div class="ledger-bars"><i></i><i></i><i></i><i></i><i></i><i></i><span>TRACEABLE OUTPUT</span></div></div>
 <span class="flow-caption source-caption">01 / SOURCE RECORDS</span><span class="flow-caption output-caption">03 / EXPLAINED BALANCES</span></div>`;
 const customerMarkup=`<div class="integrated-scene journey-scene" role="img" aria-label="Scripted example of an incoming call passing through enquiry capture, availability checks, confirmed booking and team handover."><div class="journey-heading"><span>INCOMING CALL → COMPLETED BOOKING</span><small>SCRIPTED EXAMPLE</small></div><div class="journey-track">${[['01','Answer','Incoming call'],['02','Capture','Name / request'],['03','Check','Calendar slot'],['04','Book','Caller confirms'],['05','Notify','CRM / team']].map((step,i)=>`<div class="journey-node" style="--phase:${i}"><span>${step[0]}</span><strong>${step[1]}</strong><small>${step[2]}</small></div>`).join('')}</div><div class="journey-detail"><div><span class="journey-label">THE REQUEST</span><p>“Can I book a consultation for Tuesday afternoon?”</p></div><div><span class="journey-label">THE CONNECTED WORK</span><p>Check availability → confirm details → save the booking → send a summary.</p></div></div><div class="journey-footer"><span>HUMAN HANDOVER WHEN NEEDED</span><span>CALENDAR + CRM + NOTIFICATIONS</span></div></div>`;
 // Custom orthographic geometry, not copied ThreeUI source. All figures are synthetic.
 function analyticsMarkup(){
  const project=(x,y,z=0)=>[260+(x-y)*.866,150+(x+y)*.45-z];
  const points=verts=>verts.map(v=>project(...v).map(n=>n.toFixed(1)).join(',')).join(' ');
  const polygon=(verts,cl)=>'<polygon class="'+cl+'" points="'+points(verts)+'"/>';
  const line=(a,b)=>{const p=project(...a),q=project(...b);return '<path d="M'+p.join(' ')+'L'+q.join(' ')+'"/>';};
  let floor='';for(let x=0;x<=220;x+=22)floor+=line([x,0],[x,120]);for(let y=0;y<=120;y+=20)floor+=line([0,y],[220,y]);
  let bars='';const actual=[105,113,100];
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){
   const x=28+i*64,y=25+j*40,h=(j?actual[i]:100)*.8,w=22,d=22;
   bars+='<g class="chart-column '+(j?'actual-column':'budget-column')+'" style="--column:'+i+'">';
   bars+=polygon([[x,y,0],[x+w,y,0],[x+w,y,h],[x,y,h]],'bar-front');
   bars+=polygon([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,h],[x+w,y,h]],'bar-side');
   bars+=polygon([[x,y,h],[x+w,y,h],[x+w,y+d,h],[x,y+d,h]],'bar-top');bars+='</g>';
  }
  let labels='';['JAN','FEB','MAR'].forEach((text,i)=>{const p=project(38+i*64,135,0);labels+='<text x="'+p[0]+'" y="'+p[1]+'">'+text+'</text>';});
  return `<div class="integrated-scene analytics-scene" role="img" aria-label="Dimensional budget and actual chart: January 105,000, February 113,000 and March 100,000, against 100,000 monthly budget. Synthetic demonstration data."><svg viewBox="0 0 680 350" aria-hidden="true"><text class="chart-kicker" x="24" y="28">FINANCIAL REPORTING / Q1</text><text class="chart-meta" x="24" y="49">SYNTHETIC EXAMPLE</text><g class="chart-floor">${floor}</g>${bars}<g class="month-labels">${labels}</g><g class="chart-source"><text x="26" y="100">SOURCE</text><path d="M26 113h95m-95 14h71m-71 14h86m-86 14h62"/><path class="source-route" d="M125 145h40v50h40"/></g><g class="chart-register"><rect x="468" y="90" width="186" height="173" rx="3"/><text class="register-heading" x="482" y="113">BUDGET / ACTUAL</text><path d="M480 127h162m-162 35h162m-162 35h162"/><text x="482" y="148">JAN</text><text x="558" y="148">+5,000</text><text x="482" y="183">FEB</text><text x="558" y="183">+13,000</text><text x="482" y="218">MAR</text><text x="558" y="218">0</text><text class="register-total" x="482" y="247">Q1: +18,000</text></g><g class="chart-legend"><rect x="28" y="310" width="7" height="7" class="budget-key"/><text x="42" y="317">BUDGET</text><rect x="125" y="310" width="7" height="7" class="actual-key"/><text x="139" y="317">ACTUAL</text><text x="467" y="317">SOURCE → MODEL → REVIEW</text></g></svg></div>`;
 }
 const personalFinanceMarkup=analyticsMarkup();

 function fit(){const node=view.querySelector('.integrated-scene');if(!node)return;const scale=Math.min(view.clientWidth/740,view.clientHeight/400,1.15);node.style.transform='translate(-50%, -50%) scale('+scale+')';}
 function show(mode){view.innerHTML=mode==='customer'?customerMarkup:(document.documentElement.dataset.brand==='personal'?personalFinanceMarkup:financeMarkup);host.dataset.mode=mode;fit();}
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
