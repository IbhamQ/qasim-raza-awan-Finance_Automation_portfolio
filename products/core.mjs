// Shared browser/Node engines. Monetary values use integer cents.
export function cents(value) {
  let s=String(value??'').trim(); if(s.startsWith('(')&&s.endsWith(')'))s='-'+s.slice(1,-1);
  if(!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(s))throw Error('Invalid amount: '+s+'. Use a decimal point and at most two decimal places.');
  s=s.replaceAll(',','');const negative=s.startsWith('-');s=s.replace(/^[+-]/,'');const [a,b='']=s.split('.');
  const n=BigInt(a)*100n+BigInt(b.padEnd(2,'0'));if(n>100000000000000000n)throw Error('Amount exceeds supported range.');return negative?-n:n;
}
export function amount(n){const s=n<0n?'-':'';n=n<0n?-n:n;return s+(n/100n)+'.'+String(n%100n).padStart(2,'0');}
export const norm=s=>String(s??'').trim().replace(/\s+/g,' ').toLowerCase();
export function parseCSV(text){
  text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0];const delimiter=first.includes('\t')?'\t':first.includes(';')&&!first.includes(',')?';':',';
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted)quoted=false;else if(!cell)quoted=true;else throw Error('Unexpected quote in CSV.');}
    else if(!quoted&&c===delimiter){row.push(cell);cell='';}else if(!quoted&&(c==='\n'||c==='\r')){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
  if(quoted)throw Error('Unclosed quote in CSV.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
  if(rows.length<2)throw Error('CSV needs a header and at least one data row.');if(rows.length>50001)throw Error('Maximum 50,000 rows.');
  const headers=rows.shift().map(s=>s.trim());if(headers.some(h=>!h)||new Set(headers).size!==headers.length)throw Error('Use unique, nonblank headers.');
  return {headers,rows:rows.map((r,i)=>{if(r.length>headers.length)throw Error('Too many values on data row '+(i+1));return {row:i+2,values:Object.fromEntries(headers.map((h,j)=>[h,r[j]??'']))};})};
}
export function csv(records){if(!records.length)return 'status\r\nNo records\r\n';const keys=Object.keys(records[0]);const encode=(v,k)=>{let s=String(v??'');if(!/amount|budget|actual|variance|difference|row|total|subtotal|tax/i.test(k)&&/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};return [keys.map(k=>encode(k,'header')).join(','),...records.map(r=>keys.map(k=>encode(r[k],k)).join(','))].join('\r\n');}
export function reconcile(left,right,lmap,rmap,tolerance='0.01',currency='AED'){
  const tol=cents(tolerance);if(tol<0n)throw Error('Tolerance cannot be negative.');
  for(const f of ['currency','entity'])if(Boolean(lmap[f])!==Boolean(rmap[f]))throw Error('Map '+f+' on both sides or neither.');
  const sides=[left,right].map((table,i)=>{const m=[lmap,rmap][i];for(const f of ['reference','amount'])if(!table.headers.includes(m[f]))throw Error('Choose valid '+f+' columns.');
    return table.rows.map(raw=>{const v=raw.values;const r={row:raw.row,reference:v[m.reference]?.trim()||'',currency:String(m.currency?v[m.currency]:currency).trim().toUpperCase(),entity:m.entity?v[m.entity]?.trim()||'':'',value:null,error:''};try{r.value=cents(v[m.amount]);}catch(e){r.error=e.message;}if(!r.reference)r.error='Missing reference';if(!/^[A-Z]{3}$/.test(r.currency))r.error='Invalid currency';if(m.entity&&!r.entity)r.error='Missing entity';r.key=JSON.stringify([norm(r.reference),r.currency,norm(r.entity)]);return r;});});
  const counts=sides.map(rows=>{const m=new Map();for(const r of rows)if(!r.error)m.set(r.key,(m.get(r.key)||0)+1);return m;});
  const duplicates=new Set(counts.flatMap(m=>[...m].filter(([k,n])=>n>1).map(([k])=>k)));
  const groups=[new Map(),new Map()],records=[];
  function add(status,l,r,reason){const a=l||r;records.push({status,reference:a.reference,currency:a.currency,entity:a.entity,left_row:l?.row??'',right_row:r?.row??'',left_amount:l?.value!=null?amount(l.value):'',right_amount:r?.value!=null?amount(r.value):'',difference:l?.value!=null&&r?.value!=null?amount(l.value-r.value):'',reason});}
  sides.forEach((rows,i)=>rows.forEach(r=>{if(r.error)add('Invalid row',i?null:r,i?r:null,r.error);else if(duplicates.has(r.key))add('Duplicate reference',i?null:r,i?r:null,'Duplicate key on at least one source; all counterparts require review.');else groups[i].set(r.key,r);}));
  for(const k of new Set([...groups[0].keys(),...groups[1].keys()])){const l=groups[0].get(k),r=groups[1].get(k);if(l&&r){const delta=l.value-r.value;const pass=(delta<0n?-delta:delta)<=tol;add(pass?'Matched':'Amount difference',l,r,pass?'Reference and amount within tolerance':'Same reference; amount exceeds tolerance');}else add(l?'Left only':'Right only',l,r,'No counterpart with the same reference, currency and entity');}
  const totals=new Map();sides.forEach((rows,i)=>rows.forEach(r=>{if(r.value===null)return;const t=totals.get(r.currency)||[0n,0n];t[i]+=r.value;totals.set(r.currency,t);}));
  for(let i=0;i<2;i++){const field=i?'right_row':'left_row';if(records.filter(r=>r[field]!=='').length!==sides[i].length)throw Error('Row coverage failed');}
  return {records,leftRows:sides[0].length,rightRows:sides[1].length,matched:records.filter(r=>r.status==='Matched').length,exceptions:records.filter(r=>r.status!=='Matched').length,totals:[...totals].map(([currency,v])=>({currency,left:amount(v[0]),right:amount(v[1]),difference:amount(v[0]-v[1])})),invalidAmounts:sides.flat().filter(r=>r.value===null).length};
}
export function variance(table,map,threshold='100',percentage='10'){
  for(const f of ['account','budget','actual','currency','type'])if(!table.headers.includes(map[f]))throw Error('Map a valid '+f+' column.');
  const limit=cents(threshold);const pct=Number(percentage);if(limit<0n||!Number.isFinite(pct)||pct<0)throw Error('Thresholds must be nonnegative.');
  const groups=new Map(),invalid=[];
  for(const raw of table.rows){const v=raw.values;try{const account=v[map.account].trim(),currency=v[map.currency].trim().toUpperCase(),type=norm(v[map.type]),period=map.period?v[map.period].trim():'All uploaded periods';
    if(!account||!period||!/^[A-Z]{3}$/.test(currency)||!['expense','revenue'].includes(type))throw Error('Account, period, currency or type is missing/invalid. Type must be expense or revenue.');
    const budget=cents(v[map.budget]),actual=cents(v[map.actual]);if(budget<0n||actual<0n)throw Error('Use positive budget and actual values; specify expense/revenue in type.');
    const key=JSON.stringify([norm(account),currency,type,period]);const g=groups.get(key)||{account,currency,type,period,budget:0n,actual:0n,rows:[]};g.budget+=budget;g.actual+=actual;g.rows.push(raw.row);groups.set(key,g);
  }catch(e){invalid.push({row:raw.row,error:e.message});}}
  const records=[...groups.values()].map(g=>{const delta=g.actual-g.budget;const absolute=delta<0n?-delta:delta;const percent=g.budget===0n?null:Number(delta)*100/Number(g.budget);const favorable=g.type==='expense'?delta<0n:delta>0n;
    return {account:g.account,period:g.period,currency:g.currency,type:g.type,budget:amount(g.budget),actual:amount(g.actual),variance:amount(delta),variance_percent:percent===null?'N/A':percent.toFixed(2),direction:delta===0n?'On budget':favorable?'Favorable':'Unfavorable',material:absolute>=limit&&(percent===null||Math.abs(percent)>=pct)?'Yes':'No',source_rows:g.rows.join(', ')};
  }).sort((a,b)=>{const av=cents(a.variance),bv=cents(b.variance);return Number((bv<0n?-bv:bv)-(av<0n?-av:av));});
  const totals=new Map();for(const g of groups.values()){const key=g.currency+' / '+g.type;const t=totals.get(key)||[0n,0n];t[0]+=g.budget;t[1]+=g.actual;totals.set(key,t);}
  const covered=[...groups.values()].reduce((s,g)=>s+g.rows.length,0)+invalid.length;if(covered!==table.rows.length)throw Error('Source row coverage failed.');
  return {records,invalid,inputRows:table.rows.length,material:records.filter(r=>r.material==='Yes').length,totals:[...totals].map(([scope,v])=>({scope,budget:amount(v[0]),actual:amount(v[1]),variance:amount(v[1]-v[0])}))};
}
export function extractInvoice(text,filename='invoice.txt'){
  const lines=text.replace(/\r/g,'').split('\n').map(s=>s.trim()).filter(Boolean);if(!lines.length)throw Error('No selectable invoice text found. Scanned PDFs need OCR first.');
  const find=patterns=>{for(const p of patterns){const m=text.match(p);if(m)return m[1].trim();}return '';};
  const reference=find([/(?:invoice\s*(?:number|no\.?|#|id))\s*[:#-]?\s*([A-Z0-9][A-Z0-9/_-]*)/i]);
  const date=find([/(?:invoice\s*date|date\s*issued|issue\s*date)\s*:?\s*([^\n]+)/i]);
  const currency=find([/\bcurrency\s*:\s*([A-Z]{3})\b/i])||find([/\b(AED|USD|GBP|EUR|SAR|PKR)\s*[\d,(]/i]);
  const vendor=find([/(?:supplier|vendor|from)\s*:\s*([^\n]+)/i]);
  const getAmount=labels=>{for(const line of lines){if(labels.test(line)){const m=line.match(/([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{1,2}|\([\d,]+\.\d{1,2}\))\s*$/);if(m)try{return amount(cents(m[1]));}catch{}}}return '';};
  const subtotal=getAmount(/^(?:sub\s*total|net\s*amount)\b/i),tax=getAmount(/^(?:tax|vat)(?:\s+amount)?\s*[: ]/i),total=getAmount(/^(?:grand\s*total|invoice\s*total|total\s*due|amount\s*due|total)\b/i);
  const errors=[];for(const [name,value] of Object.entries({reference,date,currency,vendor,total}))if(!value)errors.push('Missing '+name);
  let check='Not checked';if(subtotal&&tax&&total){const delta=cents(subtotal)+cents(tax)-cents(total);check=delta===0n?'Subtotal + tax agrees':'Mismatch: subtotal + tax differs from total';if(delta!==0n)errors.push(check);}
  if(!subtotal||!tax)errors.push('Subtotal/tax arithmetic requires review');
  return {filename,vendor,reference,date,currency,subtotal,tax,total,arithmetic_check:check,status:errors.length?'Review needed':'Extracted; verify against source',issues:errors.join('; '),source_excerpt:lines.slice(0,35).join('\n')};
}
