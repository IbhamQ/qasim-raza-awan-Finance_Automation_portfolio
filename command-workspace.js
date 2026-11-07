// A single DOM/CSS 3D composition: identical framing on GPU and non-WebGL browsers.
for (const host of document.querySelectorAll('[data-workspace]')) {
 const view=host.querySelector('.mesh-viewport');
 view.innerHTML=`<div class="integrated-scene" role="img" aria-label="Animated dimensional spreadsheet connects through a control engine to a reconciled ledger. Synthetic example records.">
 <svg class="flow-conduits" viewBox="0 0 700 350" aria-hidden="true"><path class="conduit" d="M175 150H330V210H550V160M330 210V285H550V230"/><path class="flow-trace" d="M175 150H330V210H550V160M330 210V285H550V230"/></svg>
 <div class="scene-sheet"><div class="sheet-chrome"><i></i><i></i><i></i><span>RECONCILIATION / SOURCE</span></div><div class="sheet-formula">ƒx <span>= ROUND(Booked − Billed, 2)</span></div><div class="sheet-grid"><b>REF</b><b>BOOKED</b><b>BILLED</b><span>INV-1042</span><span>1,200.00</span><span>1,200.00</span><span>INV-1043</span><span>750.00</span><span>725.00</span><span>INV-1044</span><span>480.00</span><span>480.00</span><b>TOTAL</b><b>2,430.00</b><b>2,405.00</b></div><div class="sheet-sweep"></div></div>
 <div class="control-stack"><div class="stack-layer layer-bottom"></div><div class="stack-layer layer-mid"></div><div class="stack-layer layer-top"><span>ƒ</span></div><small>VALIDATE / MATCH</small></div>
 <div class="scene-ledger"><div class="ledger-title">CONTROL REGISTER <span>LIVE EXAMPLE</span></div><div><span>1042</span><b>0.00</b><em>✓ MATCH</em></div><div><span>1043</span><b>25.00</b><em class="review">REVIEW</em></div><div><span>1044</span><b>0.00</b><em>✓ MATCH</em></div><div class="ledger-bars"><i></i><i></i><i></i><i></i><i></i><i></i><span>TRACEABLE OUTPUT</span></div></div>
 <span class="flow-caption source-caption">01 / SOURCE RECORDS</span><span class="flow-caption output-caption">03 / EXPLAINED BALANCES</span></div>`;
 view.dataset.ready='true';
 host.querySelector('.scene-load-status').textContent='Animated workflow · synthetic example records';
 const deck=host.querySelector('.software-deck');
 if(deck){deck.setAttribute('aria-label','Connected software examples');for(const img of deck.querySelectorAll('img')){const name=img.parentElement.textContent.trim();img.alt=name;}}
}
