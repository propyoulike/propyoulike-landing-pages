```

/docs/DATA\_LAYER\_CONTRACT.md

```
This document is intentionally \*\*short, strict, and boring\*\* — which is exactly what a contract should be.
---
\# 📦 Data Layer Contract
\*\*Status:\*\* Frozen (Phase 3)
\*\*Audience:\*\* Engineering, Product, Marketing
\*\*Scope:\*\* Client-side analytics transport only
---
\## 1. Purpose
This document defines the \*\*canonical `dataLayer` contract\*\* for the application.
The `dataLayer` is a \*\*transport envelope\*\*, not a logic layer.
Its sole responsibility is to:
\* Carry \*\*already-defined analytics events\*\*
\* From the application
\* To downstream tools (GTM, GA4, Meta, etc.)
It must never define meaning, intent, or success.
---
\## 2. Core Principles (Non-Negotiable)
\### 2.1 Canonical Events Only
All events pushed to `dataLayer` \*\*must come from\*\* the frozen `EventName` enum.
No ad-hoc strings.
No GTM-created events.
---
\### 2.2 Flat Schema Only
All `dataLayer` payloads \*\*must be flat objects\*\*.
❌ No nested objects
❌ No arrays
❌ No derived fields

This ensures:
\* GTM simplicity
\* Vendor portability
\* Long-term stability
---
\### 2.3 Single Push Location
There is \*\*exactly one place\*\* where `dataLayer.push()` is allowed:
```
src/lib/tracking/track.ts
```
Components must \*\*never\*\* reference `window.dataLayer` directly.
---
\### 2.4 GTM Is a Router, Not a Brain
All keys must use snake_case.
camelCase and vendor naming conventions are forbidden.

Google Tag Manager may:
\* Listen for events
\* Route events to vendors

Google Tag Manager must \*\*never\*\*:

\* Create new events
\* Rename events
\* Infer intent
\* Define conversions
\* Mutate payloads
---
\## 3. Canonical dataLayer Shape
Every client-side analytics event \*\*must conform\*\* to this shape:
```ts
interface DataLayerEvent {
&nbsp; // Required
&nbsp; event: string;              // Canonical EventName

&nbsp; // Global context (auto-injected)
&nbsp; page\_path?: string;
&nbsp; page\_title?: string;

&nbsp; // Optional shared context
&nbsp; project\_id?: string;
&nbsp; builder\_id?: string;

&nbsp; // Event-specific properties

&nbsp; section\_id?: string;        // SectionId
&nbsp; cta\_type?: string;          // CTAType
&nbsp; lead\_type?: string;         // LeadType

&nbsp; // Attribution / diagnostics
&nbsp; source\_section?: string;
&nbsp; source\_item?: string;
}

```



---

Global context fields are injected by `track()` or a wrapper utility,
never by GTM and never by components directly.


\## 4. Mapping to Canonical Enums



| Field        | Source      |

| ------------ | ----------- |

| `event`      | `EventName` |

| `section\_id` | `SectionId` |

| `cta\_type`   | `CTAType`   |

| `lead\_type`  | `LeadType`  |



All values must originate from \*\*frozen enums\*\*, never raw strings.



---



\## 5. What Is Explicitly Forbidden

The following are \*\*violations of this contract\*\*:

\* Nested payloads
\* UI labels or button text
\* Vendor-specific keys (`ga\_`, `gtm\_`, `fb\_`, etc.)
\* GTM-generated events
\* GTM “Create Event” rules
\* Conversion logic inside GTM
\* Multiple client-side conversions
\* The use of wrapper objects such as `eventModel`, `context`, or `payload`



Any of the above constitutes a \*\*breaking change\*\*.

---

\## 6. Relationship to Conversions

\* `lead\_created` is the \*\*only business conversion\*\*
\* It is emitted \*\*server-side only\*\*
\* Client-side `dataLayer` events are \*\*signals\*\*, not outcomes

`dataLayer` must never be used to fabricate conversions.

---



\## 7. Change Management

\### Allowed

\* Adding new flat properties (with approval)
\* Adding new canonical events (rare, approved)
\* Adding new routing destinations in GTM

\### Breaking Changes (Require Explicit Sign-off)
\* Renaming events
\* Renaming properties
\* Introducing nested structures
\* Introducing GTM-defined semantics

---

\## 8. Final Assertion
> The dataLayer exists to \*\*preserve truth, not invent it\*\*.

If GTM were removed tomorrow:

\* Event semantics must remain intact
\* Analytics meaning must not change

\*\*Deviation from this contract is a bug.\*\*

---

\*\*Status:\*\* Frozen ✅



