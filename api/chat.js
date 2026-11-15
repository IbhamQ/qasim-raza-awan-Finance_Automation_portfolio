// Compatibility path: both assistants use one Groq endpoint and visitor budget.
export default function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('Location','/api/agent-playground');return res.status(307).end();}
