import React, { useEffect, useRef, useState } from "react";
import type { ResolvedFaqItem } from "./faqTypes";
import { cn } from "@/lib/utils"; // optional - fallback class concat helper

// localStorage key
const FEEDBACK_KEY = "faq-feedback";

// small helper to escape regex
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// highlight function returns array of React nodes with <mark> around matches
function highlight(text: string, query: string) {
  if (!query) return text;
  const q = escapeRegExp(query.trim());
  if (!q) return text;
  const re = new RegExp(`(${q})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-200 rounded-sm px-[2px]">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function FaqList({
  faqs,
  search,
  builder,
  projectId,
}: {
  faqs: ResolvedFaqItem[];
  search: string;
  builder?: string;
  projectId?: string;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // refs for category tabs container to animate/center
  const tabsRef = useRef<HTMLDivElement | null>(null);

  // load persisted feedback
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      if (stored) setFeedback(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  // Persist feedback
  const persistFeedback = (key: string, value: string) => {
    const updated = { ...feedback, [key]: value };
    setFeedback(updated);
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  // analytics push
  const pushFeedbackEvent = (faq: ResolvedFaqItem, key: string, value: string) => {
    // dataLayer (GTM)
    const payload = {
      event: "faq_feedback",
      feedback: value, // "yes" | "no"
      question: faq.question,
      category: faq.category,
      builder: builder ?? null,
      projectId: projectId ?? null,
    };

    try {
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push(payload);
      } else if (typeof (window as any).gtag === "function") {
        // gtag event
        (window as any).gtag("event", "faq_feedback", payload);
      } else {
        // fallback to console for dev
        // eslint-disable-next-line no-console
        console.log("FAQ feedback (no GTM):", payload);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to push FAQ analytics", e);
    }
  };

  // Save feedback, persist and push analytics
  const storeFeedback = (faq: ResolvedFaqItem, key: string, value: string) => {
    persistFeedback(key, value);
    pushFeedbackEvent(faq, key, value);
  };

  // filtering based on search
  const lower = (search || "").trim().toLowerCase();
  const filteredFaqs = (faqs || []).filter((f) =>
    lower
      ? f.question.toLowerCase().includes(lower) ||
        f.answer.toLowerCase().includes(lower) ||
        f.category.toLowerCase().includes(lower)
      : true
  );

  // categories list
  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];

  // when activeCategory changes, center the tab (works with touch swipes)
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const btn = container.querySelector<HTMLElement>(`[data-cat="${activeCategory}"]`);
    if (btn && typeof btn.scrollIntoView === "function") {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCategory]);

  // final list to render
  const finalFaqs =
    activeCategory === "all"
      ? filteredFaqs
      : filteredFaqs.filter((f) => f.category === activeCategory);

  // sort within category: universal -> builder -> project
  const levelOrder: Record<string, number> = { universal: 1, builder: 2, project: 3 };
  finalFaqs.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return (
    <div className="w-full">
      {/* CATEGORY TABS */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-20 bg-white py-2 border-b border-gray-100"
        style={{ scrollSnapType: "x proximity" }}
      >
        <div className="flex gap-2 px-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                data-cat={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shrink-0",
                  isActive ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700"
                )}
                style={{ scrollSnapAlign: "center" }}
              >
                {cat === "all" ? "All" : cap(cat)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-3 px-3">
        {finalFaqs.length === 0 && (
          <div className="text-center text-gray-500 py-8">No FAQs found.</div>
        )}

        {finalFaqs.map((faq, idx) => {
          const key = faq.question + "-" + idx;
          const isOpen = openKey === key;
          const fb = feedback[key]; // "yes"|"no"|undefined

          return (
            <article
              key={key}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <header>
                <button
                  onClick={() => setOpenKey(isOpen ? null : key)}
                  className="w-full flex justify-between items-start text-left"
                  aria-expanded={isOpen}
                >
                  <h4 className="text-base font-semibold text-gray-900 leading-snug max-w-[85%]">
                    {/* highlight search inside question */}
                    <span>{highlightStringToNodes(faq.question, lower)}</span>
                  </h4>

                  <span className="text-gray-500 text-xl ml-2">{isOpen ? "−" : "+"}</span>
                </button>
              </header>

              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  isOpen ? "max-h-[1000px] mt-3" : "max-h-0"
                )}
              >
                <div className="text-gray-700 text-sm leading-relaxed">
                  {/* highlight search inside answer */}
                  <div>{highlightStringToNodes(faq.answer, lower)}</div>
                </div>

                {/* FEEDBACK */}
                <footer className="mt-4 border-t pt-3">
                  {fb ? (
                    <div className="text-xs text-green-600">
                      {fb === "yes"
                        ? "Thanks! Glad this helped."
                        : "Thanks for your feedback — we’ll improve this answer."}
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center text-xs">
                      <span className="text-gray-600">Was this helpful?</span>

                      <button
                        onClick={() => storeFeedback(faq, key, "yes")}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100"
                        aria-label="Yes, helpful"
                      >
                        Yes 👍
                      </button>

                      <button
                        onClick={() => storeFeedback(faq, key, "no")}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full hover:bg-red-100"
                        aria-label="No, not helpful"
                      >
                        No 👎
                      </button>
                    </div>
                  )}
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// helper to capitalize
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// wrapper that highlights using <mark> nodes
function highlightStringToNodes(text: string, query: string) {
  if (!query) return text;
  const q = escapeRegExp(query);
  if (!q) return text;
  const re = new RegExp(`(${q})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-200 rounded-sm px-[2px]">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
