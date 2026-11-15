/* All records belong to a fictional business. No external system writes. */
export const BUSINESS={name:'Harbor & Home',subtitle:'Property care, thoughtfully handled.',timezone:'Europe/London',snapshot:'16–20 November 2026',customer:{id:'CUS-001',name:'Maya Brooks',initials:'MB',email:'maya@example.test',property:'24 Example Lane, London · fictional address'},services:[{id:'inspection',name:'Homecare inspection',priceCents:9500,duration:60},{id:'maintenance',name:'Maintenance visit',priceCents:12500,duration:90},{id:'consultation',name:'Project consultation',priceCents:0,duration:30}],slots:[{id:'MON-1000',label:'Mon 16 Nov · 10:00',iso:'2026-11-16T10:00:00+00:00'},{id:'MON-1400',label:'Mon 16 Nov · 14:00',iso:'2026-11-16T14:00:00+00:00'},{id:'TUE-1100',label:'Tue 17 Nov · 11:00',iso:'2026-11-17T11:00:00+00:00'},{id:'WED-1400',label:'Wed 18 Nov · 14:00',iso:'2026-11-18T14:00:00+00:00'},{id:'THU-1000',label:'Thu 19 Nov · 10:00',iso:'2026-11-19T10:00:00+00:00'}],documents:[{id:'KB-01',title:'Services & pricing',text:'Homecare inspections cost £95 for 60 minutes. Maintenance visits cost £125 for 90 minutes. A 30-minute project consultation is free. These are fictional demonstration prices.'},{id:'KB-02',title:'Bookings & changes',text:'Sample appointments use London time. A visit can be changed or cancelled after you confirm the details. This demonstration updates a local sample register only. No real appointment is made.'},{id:'KB-03',title:'Invoices & payment queries',text:'The assistant can retrieve sample invoice balances and prepare an invoice-query ticket for review. It cannot collect payments, change invoice amounts, or mark an invoice paid.'},{id:'KB-04',title:'Support & human handoff',text:'Service enquiries can be captured as a sample ticket with a summary for a colleague. The fictional team operates Monday to Friday, 09:00–17:00 London time. This is not an emergency service.'}]};
export const ACTIONS=['availability','book','bookings','reschedule','cancel','invoices','ticket','handoff','knowledge','clarify'];
export const money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n/100);
export const serviceById=id=>BUSINESS.services.find(s=>s.id===id);
export const slotById=id=>BUSINESS.slots.find(s=>s.id===id);
const clean=(v,n=600)=>typeof v==='string'?v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').slice(0,n):'';
export function createState(){return {schemaVersion:1,revision:0,customerId:'CUS-001',nextBooking:1002,nextTicket:201,bookings:[{id:'HH-1001',customerId:'CUS-001',serviceId:'inspection',slotId:'WED-1400',status:'confirmed',createdVia:'sample'}],invoices:[{id:'INV-1042',customerId:'CUS-001',description:'October property maintenance',amountCents:12500,paidCents:12500,due:'2026-11-02'},{id:'INV-1048',customerId:'CUS-001',description:'November maintenance visit',amountCents:12500,paidCents:0,due:'2026-11-20'}],tickets:[],events:[],pending:null,receipts:[]};}
export function validateState(raw){
 if(!raw||raw.schemaVersion!==1||raw.customerId!=='CUS-001'||!Number.isInteger(raw.revision)||raw.revision<0||raw.revision>10000)throw Error('Invalid demo workspace. Reset the sample data.');
 for(const k of ['bookings','invoices','tickets','events','receipts'])if(!Array.isArray(raw[k])||raw[k].length>200)throw Error('Demo register limit reached. Reset the sample data.');
 if(!Number.isInteger(raw.nextBooking)||!Number.isInteger(raw.nextTicket)||raw.nextBooking<1002||raw.nextBooking>10000||raw.nextTicket<201||raw.nextTicket>10000)throw Error('Invalid sample sequence.');
 for(const b of raw.bookings)if(b.customerId!=='CUS-001'||!/^HH-\d{4}$/.test(b.id)||!serviceById(b.serviceId)||!slotById(b.slotId)||!['confirmed','cancelled'].includes(b.status))throw Error('Invalid or unauthorized sample booking.');
 if(JSON.stringify(raw.invoices)!==JSON.stringify(createState().invoices))throw Error('Sample invoice register was changed. Reset the data.');
 for(const t of raw.tickets)if(t.customerId!=='CUS-001'||!/^TKT-\d{3,5}$/.test(t.id)||typeof t.summary!=='string'||t.summary.length>600)throw Error('Invalid sample ticket.');
 if(new Set(raw.bookings.map(b=>b.id)).size!==raw.bookings.length)throw Error('Duplicate sample booking ID.');
 if(raw.pending){const p=raw.pending;if(!['book','reschedule','cancel','ticket','handoff'].includes(p.action)||!/^P-\d+$/.test(p.id)||p.baseRevision!==raw.revision)throw Error('Invalid pending action.');}
 return JSON.parse(JSON.stringify(raw));
}
function log(s,label,detail,channel,kind='read'){s.events=[...s.events,{id:`EV-${s.events.length+1}-${s.revision}`,label,detail:clean(detail),channel,kind,at:new Date().toISOString()}].slice(-60);}
function available(s,except){return BUSINESS.slots.filter(v=>!s.bookings.some(b=>b.id!==except&&b.status==='confirmed'&&b.slotId===v.id));}
function out(state,reply,extra={}){return {state,reply,cards:[],suggestions:[],citations:[],...extra};}
function stage(s,a,c,summary){s.pending={id:`P-${Date.now()}${Math.floor(Math.random()*100000)}`,baseRevision:s.revision,action:a.action,serviceId:a.serviceId||null,slotId:a.slotId||null,bookingId:a.bookingId||null,topic:clean(a.topic),channel:c,summary};log(s,'Confirmation requested',summary,c,'pending');return out(s,summary+' Review the details, then confirm the sample action.',{pending:s.pending});}
export function runAction(input,args,channel='chat'){
 const s=validateState(input);if(!['chat','voice','whatsapp'].includes(channel))throw Error('Unknown channel.');if(!args||!ACTIONS.includes(args.action))throw Error('Unsupported agent action.');
 if(args.action!=='clarify')log(s,'Customer context loaded','Maya Brooks · CUS-001 · fictional records',channel);
 const all=s.bookings.filter(b=>b.status==='confirmed');
 if(args.action==='availability'){const slots=available(s);log(s,'Availability checked',slots.length+' open slots · Europe/London',channel);return out(s,`There are ${slots.length} open sample appointments. Choose a service and time below. All times are London time.`,{cards:[{type:'slots',slots,serviceId:args.serviceId||'inspection'}],suggestions:['What does an inspection include?','Show my bookings']});}
 if(args.action==='book'){
  if(!serviceById(args.serviceId)||!slotById(args.slotId))return runAction(s,{action:'availability',serviceId:args.serviceId},channel);
  const duplicate=all.find(b=>b.serviceId===args.serviceId&&b.slotId===args.slotId);if(duplicate)return out(s,`${duplicate.id} already holds that service and time. No duplicate booking was created.`,{cards:[{type:'bookings',rows:[duplicate]}]});
  if(!available(s).some(v=>v.id===args.slotId))return out(s,'That sample slot is occupied. Please choose another time.',{cards:[{type:'slots',slots:available(s),serviceId:args.serviceId}]});
  return stage(s,args,channel,`Book ${serviceById(args.serviceId).name.toLowerCase()} for ${slotById(args.slotId).label}, London time (${money(serviceById(args.serviceId).priceCents)}).`);
 }
 if(args.action==='bookings'){log(s,'Booking register queried',all.length+' active sample booking(s)',channel);return out(s,all.length?`I found ${all.length} active sample booking${all.length>1?'s':''} for Maya.`:'There are no active sample bookings.',{cards:[{type:'bookings',rows:all}],suggestions:['Find an available appointment','Show my invoices']});}
 if(args.action==='reschedule'||args.action==='cancel'){
  let b=s.bookings.find(v=>v.id===args.bookingId&&v.status==='confirmed');if(!b&&args.bookingId)return out(s,'That active booking was not found in this customer’s sample register.');if(!b&&all.length===1)b=all[0];if(!b)return out(s,'Choose the booking you want to change.',{cards:[{type:'bookings',rows:all}]});args={...args,bookingId:b.id};
  if(args.action==='cancel')return stage(s,args,channel,`Cancel sample booking ${b.id}: ${serviceById(b.serviceId).name}, ${slotById(b.slotId).label}.`);
  if(!slotById(args.slotId))return out(s,`Choose a new time for ${b.id}.`,{cards:[{type:'slots',slots:available(s,b.id),serviceId:b.serviceId,bookingId:b.id}]});
  if(b.slotId===args.slotId)return out(s,'This booking already uses that time. No change was made.');if(!available(s,b.id).some(v=>v.id===args.slotId))return out(s,'That time is already occupied. Please choose another slot.');
  return stage(s,args,channel,`Move ${b.id} to ${slotById(args.slotId).label}, London time.`);
 }
 if(args.action==='invoices'){const due=s.invoices.reduce((a,i)=>a+i.amountCents-i.paidCents,0);log(s,'Invoice balances calculated',`2 records · outstanding ${money(due)} · no payment processing`,channel);return out(s,`Your sample outstanding balance is ${money(due)}. INV-1042 is paid; INV-1048 is due on 20 November 2026. I can prepare a query for the team if something needs checking.`,{cards:[{type:'invoices',rows:s.invoices}],citations:['KB-03'],suggestions:['Prepare a query about INV-1048','Show my bookings']});}
 if(args.action==='ticket'||args.action==='handoff'){const topic=clean(args.topic||'Please ask a colleague to review my enquiry.');return stage(s,{...args,topic},channel,`${args.action==='handoff'?'Prepare a colleague handoff':'Create a support ticket'} for Maya: ${topic}`);}
 if(args.action==='knowledge'){
  const q=(args.topic||'services').toLowerCase();const id=/invoice|pay|bill/.test(q)?'KB-03':/cancel|change|reschedul|booking|time/.test(q)?'KB-02':/team|hour|support|contact|human|emergenc/.test(q)?'KB-04':/service|inspection|maintenance|consult|price|cost|offer|include/.test(q)?'KB-01':null;
  if(!id)return out(s,'The sample knowledge base does not cover that. I can answer questions about services, prices, bookings, invoices and support, or prepare a human handoff.',{suggestions:['Show services and prices','Speak to a colleague']});
  const d=BUSINESS.documents.find(d=>d.id===id);log(s,'Knowledge source retrieved',d.id+' · '+d.title,channel);return out(s,d.text,{citations:[id],cards:id==='KB-01'?[{type:'services',rows:BUSINESS.services}]:[]});
 }
 return out(s,clean(args.topic||'I can check availability, manage sample bookings, look up invoices or prepare a support ticket. What would you like to try?',700),{suggestions:['Find an available appointment','Show my invoices','Show services and prices']});
}
export function confirmPending(input,id){
 const s=validateState(input),p=s.pending;if(!p||p.id!==id||p.baseRevision!==s.revision)throw Error('This proposal is no longer current. Please request the action again.');
 const key=`${p.id}:${p.action}:${p.bookingId||''}:${p.slotId||''}`;if(s.receipts.includes(key))throw Error('This sample action has already been applied.');let reply,extra={};
 if(p.action==='book'){if(!serviceById(p.serviceId)||!available(s).some(v=>v.id===p.slotId))throw Error('The sample slot is no longer available.');const b={id:`HH-${s.nextBooking++}`,customerId:'CUS-001',serviceId:p.serviceId,slotId:p.slotId,status:'confirmed',createdVia:p.channel};s.bookings.push(b);reply=`Sample booking ${b.id} is confirmed: ${serviceById(b.serviceId).name}, ${slotById(b.slotId).label}, London time. It is now visible in every channel.`;extra.cards=[{type:'bookings',rows:[b]}];}
 else if(p.action==='reschedule'||p.action==='cancel'){const b=s.bookings.find(b=>b.id===p.bookingId&&b.status==='confirmed');if(!b)throw Error('That sample booking is no longer active.');if(p.action==='cancel'){b.status='cancelled';reply=`Sample booking ${b.id} has been cancelled. Its time is available again.`;}else{if(!available(s,b.id).some(v=>v.id===p.slotId))throw Error('That time is no longer available.');b.slotId=p.slotId;reply=`Sample booking ${b.id} has moved to ${slotById(b.slotId).label}, London time.`;extra.cards=[{type:'bookings',rows:[b]}];}}
 else{const t={id:`TKT-${s.nextTicket++}`,customerId:'CUS-001',summary:clean(p.topic),status:'open',createdVia:p.channel,type:p.action};s.tickets.push(t);reply=`${t.id} is saved in the sample support register. The handoff summary is ready for review. No email or WhatsApp message has been sent.`;extra.cards=[{type:'ticket',row:t}];}
 s.revision++;s.pending=null;s.receipts.push(key);log(s,'Sample action confirmed',reply,p.channel,'write');return out(s,reply,extra);
}
export function declinePending(input){const s=validateState(input);s.pending=null;return out(s,'Proposal dismissed. The sample records are unchanged.');}
export function guidedPlan(text,state){
 const q=clean(text,900).toLowerCase(),bookingId=text.match(/HH-\d{4}/i)?.[0].toUpperCase()||null,slotId=BUSINESS.slots.find(s=>q.includes(s.id.toLowerCase())||q.includes(s.label.toLowerCase()))?.id||null,serviceId=/maintenance/.test(q)?'maintenance':/consult/.test(q)?'consultation':'inspection';
 if(/pay (this|the|my)|mark.*paid|refund|change.*amount/.test(q))return {action:'clarify',topic:'This demo can look up sample balances and prepare a query. It cannot take payments, issue refunds or change invoice amounts.'};
 if(/cancel/.test(q))return {action:'cancel',bookingId};if(/reschedul|move.*booking|change.*appointment|change.*booking/.test(q))return {action:'reschedule',bookingId,slotId};
 if(/prepare.*query|query about|dispute|ticket|broken|repair|issue with|leak/.test(q))return {action:'ticket',topic:clean(text)};if(/human|colleague|handoff|speak to|person/.test(q))return {action:'handoff',topic:clean(text)};
 if(/invoice|balance|outstanding|bill/.test(q))return {action:'invoices'};if(/my booking|my appointment|show.*booking|show.*appointment|look.*booking/.test(q))return {action:'bookings'};
 if(/book|schedule|reserve/.test(q)&&slotId)return {action:'book',serviceId,slotId};if(/availab|appointment|slot|book|schedule|reserve/.test(q))return {action:'availability',serviceId};
 if(/service|price|cost|inspection|maintenance|consult|hour|team|support|include|offer/.test(q))return {action:'knowledge',topic:q};
 if(/^(hi|hello|hey|good morning)[!. ]*$/.test(q))return {action:'clarify',topic:'Hello, Maya. I’m the Harbor & Home demo assistant. I can help with sample bookings, service questions, invoices and support.'};return {action:'knowledge',topic:q};
}
export function demoContext(state){const s=validateState(state);return {business:BUSINESS,bookings:s.bookings,invoices:s.invoices,tickets:s.tickets,pending:s.pending};}
