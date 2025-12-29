\# 📊 Analytics Contract



\*\*Status:\*\* Frozen (Phase 1)

\*\*Audience:\*\* Product, Engineering, Marketing

\*\*Scope:\*\* Analytics semantics, authority, and guarantees



---



\## 1. Purpose



This document defines the \*\*authoritative analytics contract\*\* for the PropYouLike platform.



Its goals are to:



\* Establish a \*\*single source of truth\*\* for business outcomes

\* Prevent analytics drift and redefinition over time

\* Decouple product logic from analytics tooling (GA4, Meta, etc.)

\* Ensure analytics remains \*\*observational\*\*, not \*\*decisional\*\*



This contract is \*\*tool-agnostic\*\* and must be respected across all implementations.



---



\## 2. Core Principles (Non-Negotiable)



\### 2.1 Business Truth > Tool Semantics



Analytics tools \*\*do not define success\*\*.

They only observe outcomes defined elsewhere.



\### 2.2 One Business Conversion



There is \*\*exactly one primary business conversion\*\*:



```

lead\_created

```



No other event represents success.



\### 2.3 Backend Authority



A lead is considered real \*\*only after backend / CRM acceptance\*\*.



Frontend interactions \*\*cannot\*\* create conversions.



\### 2.4 Intent ≠ Outcome



\* \*\*Intent signals\*\* (clicks, views, downloads) are \*diagnostic\*

\* \*\*Outcomes\*\* (leads) are \*business truth\*



They must never be conflated.



---



\## 3. Canonical Enums (Frozen Contracts)



All analytics identifiers are defined as enums and must be imported — \*\*never hard-coded\*\*.



\### 3.1 Section Identifiers



Source of truth:



```

src/lib/analytics/sectionIds.ts

```



Purpose:



\* Stable semantic identifiers for page sections

\* Used across analytics, navigation, scroll, attribution



Rules:



\* Do NOT rename once released

\* UI labels may change; IDs must not



---



\### 3.2 Event Names



Source of truth:



```

src/lib/analytics/events.ts

```



Purpose:



\* Canonical analytics events

\* Permanent contract across tools



Rules:



\* Do NOT rename events

\* Do NOT add events without product approval

\* Event details belong in properties, not names



Key distinction:



\* `LeadCreated` = business outcome

\* All other events = signals



---



\### 3.3 CTA Types



Source of truth:



```

src/lib/analytics/ctaTypes.ts

```



Purpose:



\* Describe \*\*user intent\*\* behind a CTA interaction



Rules:



\* Intent-based, not UI-based

\* Channel is a property, not the type

\* Used with `EventName.CTAClick`



---



\### 3.4 Lead Types



Source of truth:



```

src/lib/analytics/leadTypes.ts

```



Purpose:



\* Business classification of qualified leads



Rules:



\* Used \*\*only\*\* with `EventName.LeadCreated`

\* Assigned after validation / qualification

\* Reflects sales reality, not UI intent



---



\## 4. Lead Definition (Authoritative)



A \*\*lead\*\* is defined as:



> A user enquiry that has been \*\*accepted by the CRM (Privyr)\*\*.



Implications:



\* Form submission ≠ lead

\* CTA click ≠ lead

\* WhatsApp open ≠ lead

\* Only CRM acceptance creates a lead



This rule is enforced via:



\* Cloudflare Worker (backend authority)

\* CRM integration (Privyr)

\* Server-side analytics emission



---



\## 5. Conversion Model



\### 5.1 Primary Conversion



| Type                        | Event          |

| --------------------------- | -------------- |

| Primary business conversion | `lead\_created` |



\### 5.2 Secondary Conversions



None.



\### 5.3 Secondary Signals (Non-Conversion)



Examples:



\* `section\_view`

\* `cta\_click`

\* `brochure\_download`

\* `media\_play`

\* `form\_start`



These are \*\*diagnostic only\*\* and must never be starred as conversions.



---



\## 6. Analytics Architecture



\### 6.1 Data Flow



```

Frontend (React)

&nbsp;  ↓

Cloudflare Worker (Authority)

&nbsp;  ↓

CRM (Privyr) — Source of Truth

&nbsp;  ↓

Analytics Tools (GA4, etc.) — Observers

```



\### 6.2 Emission Rules



\* `lead\_created` is emitted \*\*server-side only\*\*

\* Frontend analytics may emit \*\*signals\*\*, never outcomes

\* No frontend `dataLayer`-driven conversions



---



\## 7. GA4-Specific Rules



\* GA4 is a \*\*viewer\*\*, not an owner

\* Auto-events do not define success

\* Only `lead\_created` is starred as a Key Event

\* Lead quality is encoded via `lead\_type`, not multiple conversions



---



\## 8. Change Management



\### 8.1 Allowed



\* Adding new enum values (with approval)

\* Adding new event properties

\* Adding new diagnostic events (carefully)



\### 8.2 Breaking Changes (Require Explicit Sign-off)



\* Renaming enums

\* Reusing event names for new meanings

\* Introducing new conversions

\* Frontend-fired business outcomes



---



\## 9. Phase Boundaries



\### Phase 1 (Complete)



\* Analytics contract

\* Lead authority

\* Canonical enums

\* One conversion model



\### Phase 2 (Future)



\* Attribution analysis

\* Intent → lead correlation

\* Funnel diagnostics

\* Sales feedback enrichment



Phase 2 must \*\*not\*\* redefine Phase 1 concepts.



---



\## 10. Final Assertion



> Analytics is infrastructure, not experimentation.



Once defined, this contract protects:



\* Data integrity

\* Business clarity

\* Engineering velocity

\* Marketing credibility



\*\*Deviation from this contract is a bug.\*\*



---



\*\*Last updated:\*\* Phase 1 completion

\*\*Status:\*\* Frozen ✅



