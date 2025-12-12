// ----------------------------------------------------------
// ULTIMATE NEXT-GEN FAQ (Free, Premium, SEO-friendly)
// ----------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CTAButtons from "@/components/CTAButtons";

/* ---------- Utility Helpers ---------- */

// Normalize string for matching
const norm = (s: string) => s.toLowerCase().trim();

// Highlight matches
const highlight = (text: string, query: string) => {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");

  return text.split(regex).reduce((acc: any[], part, i, arr) => {
    acc.push(part);
    if (i < arr.length - 1) {
      acc.push(
        <mark className="bg-yellow-200 px-1 rounded" key={i}>
          {query}
        </mark>
      );
    }
    return acc;
  }, []);
};

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  onCtaClick: () => void;
}

export default function PremiumFAQ({
  title = "Frequently Asked Questions",
  subtitle,
  faqs = [],
  onCtaClick,
}: FAQProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [openCount, setOpenCount] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ---------- Categorization ---------- */

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category || "General"));
    return ["All", ...Array.from(set)];
  }, [faqs]);

  /* ---------- Smart Filtering ---------- */

  const visibleFaqs = useMemo(() => {
    let list = faqs;

    // Category filter
    if (activeTab !== "All") {
      list = list.filter((f) => (f.category || "General") === activeTab);
    }

    // Search filter
    if (search.trim()) {
      const q = norm(search);
      list = list.filter(
        (f) =>
          norm(f.question).includes(q) || norm(f.answer).includes(q)
      );
    }

    return list;
  }, [faqs, search, activeTab]);

  /* ---------- Predictive Suggestions ---------- */

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = norm(search);

    return faqs
      .filter((f) => norm(f.question).includes(q))
      .slice(0, 5)
      .map((f) => f.question);
  }, [search, faqs]);

  /* ---------- Deep Linking With Query ---------- */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query");
    if (q) {
      setSearch(q);
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /* ---------- Auto Scroll to First Result ---------- */

  useEffect(() => {
    if (visibleFaqs.length > 0 && search) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [visibleFaqs, search]);

  /* ---------- Popular Questions Ranking ---------- */

  const sortedByPopularity = useMemo(() => {
    return [...faqs]
      .sort((a, b) => (openCount[a.question] || 0) - (openCount[b.question] || 0))
      .reverse()
      .slice(0, 3);
  }, [openCount]);

  /* ---------- Render ---------- */

  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground mt-3">{subtitle}</p>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Input
            placeholder="Search questions…"
            className="h-12 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Suggestion Box */}
          {suggestions.length > 0 && (
            <div className="absolute z-20 left-0 right-0 bg-white shadow-xl border mt-1 rounded-lg">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-2 cursor-pointer hover:bg-muted/30"
                  onClick={() => setSearch(s)}
                >
                  {highlight(s, search)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Section */}
        {sortedByPopularity.length > 0 && (
          <div className="mb-10">
            <h3 className="font-semibold text-xl mb-4">Top Questions</h3>
            <ul className="space-y-2">
              {sortedByPopularity.map((f, i) => (
                <li
                  key={i}
                  onClick={() => setSearch(f.question)}
                  className="cursor-pointer underline hover:text-primary"
                >
                  {f.question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="px-5 py-2 rounded-full border shadow-sm data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <div ref={scrollRef}>
              {visibleFaqs.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No questions found.
                </p>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {visibleFaqs.map((faq, i) => (
                    <AccordionItem
                      key={faq.question}
                      value={`faq-${i}`}
                      className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition"
                    >
                      <AccordionTrigger
                        className="py-5 text-left text-lg font-semibold"
                        onClick={() =>
                          setOpenCount((prev) => ({
                            ...prev,
                            [faq.question]: (prev[faq.question] || 0) + 1,
                          }))
                        }
                      >
                        {highlight(faq.question, search)}
                      </AccordionTrigger>

                      <AccordionContent className="pb-6 text-muted-foreground text-[15px] leading-relaxed">
                        {highlight(faq.answer, search)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Desktop CTA */}
        <div className="mt-16 flex justify-center">
          <CTAButtons variant="premium" onFormOpen={onCtaClick} />
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t p-3 md:hidden">
        <CTAButtons variant="sticky" onFormOpen={onCtaClick} />
      </div>
    </section>
  );
}
