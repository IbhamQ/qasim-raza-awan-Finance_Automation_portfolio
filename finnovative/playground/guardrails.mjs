export const GROQ_MODEL='openai/gpt-oss-120b';
export const GROQ_FALLBACK_MODEL='openai/gpt-oss-20b';
export const MAX_AI_TOKENS=150;
export const LIVE_LIMIT=8;
export const LIVE_USAGE_KEY='finnovative-live-ai-used-v2';
export const SCOPE_REPLY='I am a demo assistant focused on bookings, invoices, support tickets, and FP&A workflows. Please try one of those topics or use the guided demos!';
export const LIMIT_REPLY='You’ve used the 8 live AI messages in this visitor session. Thanks for exploring! Book a custom consultation to discuss your workflow, or keep exploring the guided demos for free.';
export const CONSULTATION_URL='mailto:finnovative.automations@gmail.com?subject=Custom%20consultation';
const greeting=/^(?:hi|hello|hey|good (?:morning|afternoon|evening)|thanks|thank you|bye|goodbye)[\s!.,?]*$/i;
const blocked=/\b(?:code|coding|program(?:me|ming)?|debug|javascript|typescript|html|css|algorithm|leetcode|trivia|essay|poem|poetry|lyrics|joke|recipe|weather|capital of|who (?:is|was)|quantum|politics|president|football|translate|translation)\b|\b(?:write|generate|build)\b.{0,35}\b(?:script|python|sql|function|app|website)\b|\b(?:ignore|override|forget|bypass)\b.{0,45}\b(?:instructions?|rules?|system|prompt|limit)\b|\b(?:system prompt|api key|secret|pretend|roleplay)\b/i;
const playground=/\b(?:book(?:ing|ings)?|appointment|availability|available (?:time|slot|appointment)|reschedule|cancel|invoice|invoices|unpaid|outstanding|owe|support|tickets?|handoff|human|colleague|service|services|inspection|maintenance|consultation|finnovat(?:ive)?|fp\s*&\s*a|fpa|forecast(?:ing)?|budget(?:ing)?|variance|financial planning|margin|cash flow|financial analysis|financial reporting)\b|\b(?:INV-\d+|HH-\d+|TKT-\d+)\b/i;
const portfolio=/\b(?:qasim|qualifications?|certifications?|credentials?|experience|portfolio|case stud(?:y|ies)|projects?|hire|hiring|collaborat(?:e|ion)|contact|finance|accounting|bookkeeping|reconciliation|reconciliations|payroll|retirement|wealth|power bi|fabric|lakehouse|dataflows|excel|power query|vba|sql|python|automation|automations|accrual|bestway|swapp|humi|restaurant365|cpa|acca)\b/i;
const followup=/^(?:yes|no|please|thanks|thank you|go ahead|that one|the first one|the second one|how much|what times|show (?:me )?(?:them|those|it)|(?:mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?)(?:[\s\d:a-z·-]*)|\d{1,2}(?::\d{2})?\s*(?:am|pm)?)[\s!?.]*$/i;
export function checkMessage(text,history=[],scope='playground'){
 if(typeof text!=='string'||!text.trim())return {allowed:false,reason:'empty'};
 if(Array.from(text).length>=300)return {allowed:false,reason:'length'};
 const q=text.trim();if(blocked.test(q))return {allowed:false,reason:'scope'};
 if(greeting.test(q)||playground.test(q)||(scope==='portfolio'&&portfolio.test(q)))return {allowed:true};
 const prior=Array.isArray(history)?history.filter(m=>m?.role==='user'&&typeof m.content==='string').slice(-3):[];
 if(followup.test(q)&&prior.some(m=>!blocked.test(m.content)&&(playground.test(m.content)||(scope==='portfolio'&&portfolio.test(m.content)))))return {allowed:true};
 return {allowed:false,reason:'scope'};
}
export function automatedReply(reason){return {reply:reason==='limit'?LIMIT_REPLY:SCOPE_REPLY,mode:'automated',automated:true,calledApi:false,reason,suggestions:['Find an available appointment','Show my invoices','What FP&A services do you offer?'],consultationUrl:reason==='limit'?CONSULTATION_URL:undefined};}
export function loadLiveUsage(){try{return Math.min(LIVE_LIMIT,Math.max(0,Number(sessionStorage.getItem(LIVE_USAGE_KEY))||0));}catch{return 0;}}
export function saveLiveUsage(value){const used=Math.min(LIVE_LIMIT,Math.max(loadLiveUsage(),Number(value)||0));try{sessionStorage.setItem(LIVE_USAGE_KEY,String(used));}catch{}return used;}
export function withLiveSession(task){return globalThis.navigator?.locks?.request?globalThis.navigator.locks.request('finnovative-live-ai',task):task();}
