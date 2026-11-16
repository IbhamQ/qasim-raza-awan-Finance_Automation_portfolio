# Portfolio and playground AI

The personal portfolio assistant and the Agent Playground share `/api/agent-playground`. The legacy `/api/chat` path redirects to it. Both use GroqCloud with server-side `GROQ_API_KEY`; the `openai/` prefix in the model ID names the model, not a second API provider.

Primary model: `openai/gpt-oss-120b`. Fallback: `openai/gpt-oss-20b`. Each attempt keeps `max_tokens: 150`, low reasoning effort and reasoning excluded from the response. One fallback is allowed for model-access, rate-limit, transient or invalid-response failures. Invalid credentials do not trigger fallback. No other provider is called.

Both assistants receive current, validated synthetic bookings, invoices, support tickets, the sample business documents and the Finnovative FP&A offering in their system prompts. The portfolio widget reads the same browser sample workspace as the playground; its answers are read-only. Its additional professional context distinguishes verified work, qualifications and demonstrations. This is prompt grounding, not model training. The model does not connect to client or employer datasets.

Requests must be relevant and contain fewer than 300 Unicode characters. A local topic/length check runs before inference; rejected messages return the automated scope response without calling Groq. A strict system prompt provides another scope boundary. Playground actions are validated in code, with explicit confirmation for sample writes; invoice amounts remain fixed.

The two assistants share eight upstream attempts per anonymous visitor session. A fallback uses another reservation within that same limit, never an additional allowance. Signed HttpOnly session cookies and a per-instance high-water mark enforce the ordinary browser flow; page reload, navigation and sample reset do not replenish it. Web Locks serialize supported same-origin clients. Anonymous cookies are not an authenticated, globally atomic spending limit against deliberate cookie clearing or distributed replay; those require durable shared state and identity controls. No new paid datastore is provisioned.

Twenty-two automated test groups passed for the independent source, including context grounding, fallback reservation, 299/300-character boundaries, sample-write confirmation, immutable invoices, stale proposals and the eight-attempt cap. On 15 November 2026, the deployed 120B model returned successful portfolio FP&A answers and playground invoice tool calls. Browser checks also confirmed the current booking and empty support-ticket register, a £125 outstanding invoice balance and the shared allowance. The fallback was tested with controlled provider failures; a real fallback was not forced while the primary worked.

Published portfolio: https://qasimawan-finnovative-automations.vercel.app/

Company portfolio: https://qasimawan-finnovative-automations.vercel.app/finnovative/

Playground: https://qasimawan-finnovative-automations.vercel.app/finnovative/playground/

## Standalone export and discovery

Run `node scripts/build-playground-standalone.mjs` from this repository to rebuild the downloadable single HTML file. Styles, scripts and sample records are embedded; external font imports are removed by full line, so semicolons inside font URLs cannot corrupt the root theme. System fonts provide offline fallbacks. Company links use the published absolute URL. Guided scenarios are available in the file; live inference requires the hosted server.

The personal and company pages put demo discovery immediately after their opening proof strips. Both feature the FP&A assistant with figures from its synthetic November USD example. The personal showcase links to all existing finance tools and the conversation playground. The full company agent playground appears before the services/about sections.
