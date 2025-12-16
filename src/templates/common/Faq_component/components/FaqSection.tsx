import React, { useEffect, useState } from "react";
import { getMergedFaqs } from "./faqLoader";
import type { ResolvedFaqItem } from "./faqTypes";
import FaqList from "./FaqList";

export default function FaqSection({ builder, projectId }) {
  const [faqs, setFaqs] = useState<ResolvedFaqItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!builder || !projectId) return;

    getMergedFaqs(builder, projectId).then((res) => {
      setFaqs(res || []);
    });
  }, [builder, projectId]);

  return (
    <section id="faq" className="py-10 px-2 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">Frequently Asked Questions</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="w-full border rounded-lg px-4 py-2 mb-4 text-sm shadow-sm"
        placeholder="Search FAQs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <FaqList faqs={faqs} search={search} builder={builder} projectId={projectId} />
    </section>
  );
}
