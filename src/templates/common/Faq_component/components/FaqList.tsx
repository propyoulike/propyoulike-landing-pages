// src/templates/common/Faq_component/components/FAQList.tsx

/**
 * ============================================================
 * FAQList
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Renders a list of FAQs with expand/collapse behavior
 * - Owns ONLY local UI state (open / closed index)
 * - Emits user intent upward via callbacks
 *
 * WHAT THIS COMPONENT DOES NOT DO
 * ------------------------------------------------------------
 * - No data fetching
 * - No filtering / searching
 * - No routing or navigation
 * - No project identity logic
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. LOCAL STATE ONLY
 *    → Controls open/close UI, nothing else
 *
 * 2. PURE FROM PROPS
 *    → Same props = same render
 *
 * 3. ACCESSIBLE BY DEFAULT
 *    → Button semantics
 *    → aria-expanded state
 *
 * 4. SCHEMA-ALIGNED
 *    → Explicit FAQ shape (no `any`)
 *
 * ============================================================
 */

import { useState } from "react";

/* ---------------------------------------------------------------------
   TYPES (MINIMAL + CANONICAL)
------------------------------------------------------------------------*/
export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQListProps {
  faqs: FAQItem[];

  /** Auto-expand first FAQ on initial mount only */
  autoExpandFirst?: boolean;

  /** Fired when a FAQ is clicked */
  onFaqClick?: (question: string) => void;

  /** Optional inline CTA (shown only for first FAQ) */
  onInlineCTA?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function FAQList({
  faqs,
  autoExpandFirst = false,
  onFaqClick,
  onInlineCTA,
}: FAQListProps) {
  /**
   * Local UI state:
   * - index of currently open FAQ
   * - null = all collapsed
   *
   * NOTE:
   * autoExpandFirst is intentionally applied ONLY on first render.
   */
  const [openIndex, setOpenIndex] = useState<number | null>(
    autoExpandFirst && faqs.length > 0 ? 0 : null
  );

  if (!faqs.length) return null;

  return (
    <div className="mt-6 space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={`faq-${idx}`}
            className="border rounded-xl p-4"
          >
            {/* QUESTION */}
            <button
              type="button"
              aria-expanded={isOpen}
              className="w-full text-left font-medium"
              onClick={() => {
                setOpenIndex(isOpen ? null : idx);
                onFaqClick?.(faq.question);
              }}
            >
              {faq.question}
            </button>

            {/* ANSWER */}
            {isOpen && (
              <div className="mt-3 text-sm text-muted-foreground space-y-3">
                <p>{faq.answer}</p>

                {/* Inline CTA — ONLY for first/top FAQ */}
                {idx === 0 && onInlineCTA && (
                  <button
                    type="button"
                    onClick={onInlineCTA}
                    className="text-primary underline text-sm"
                  >
                    Talk to an expert about this →
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
