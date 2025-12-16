import { useState } from "react";

export default function FAQList({
  faqs = [],
  autoExpandFirst = false,
  onFaqClick,
  onInlineCTA,
}: {
  faqs: any[];
  autoExpandFirst?: boolean;
  onFaqClick?: (q: string) => void;
  onInlineCTA?: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    autoExpandFirst ? 0 : null
  );

  if (!faqs.length) return null;

  return (
    <div className="mt-6 space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={`${faq.question}-${idx}`}
            className="border rounded-xl p-4"
          >
            <button
              className="w-full text-left font-medium"
              onClick={() => {
                setOpenIndex(isOpen ? null : idx);
                onFaqClick?.(faq.question);
              }}
            >
              {faq.question}
            </button>

            {isOpen && (
              <div className="mt-3 text-sm text-muted-foreground">
                <p>{faq.answer}</p>

                {/* Inline CTA only for first/top FAQ */}
                {idx === 0 && onInlineCTA && (
                  <button
                    onClick={onInlineCTA}
                    className="mt-3 text-primary underline text-sm"
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
