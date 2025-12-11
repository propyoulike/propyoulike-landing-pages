// src/components/FAQ.tsx
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CTAButtons from "@/components/CTAButtons";

/* WhatsApp SVG icon */
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-4 h-4 mr-2"
  >
    <path d="M20.52 3.48A11.8 11.8 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.14 1.6 5.94L0 24l6.33-1.65a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.91a11.85 11.85 0 0 0-3.47-8.4zM12.1 21.3a9.4 9.4 0 0 1-4.78-1.3l-.34-.2-3.75.98 1-3.65-.23-.38a9.4 9.4 0 0 1-1.43-4.96c0-5.19 4.23-9.42 9.42-9.42a9.35 9.35 0 0 1 6.66 2.76 9.36 9.36 0 0 1 2.76 6.66c0 5.2-4.24 9.43-9.42 9.43zm5.15-7.07c-.28-.14-1.65-.82-1.9-.92-.25-.1-.43-.14-.62.14-.2.28-.72.92-.88 1.11-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48-.16-.01-.35-.01-.54-.01a1.04 1.04 0 0 0-.75.35c-.26.28-.99.97-.99 2.36 0 1.39 1.02 2.73 1.17 2.92.14.19 2 3.05 4.88 4.27.68.29 1.2.46 1.61.59.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.89-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z" />
  </svg>
);

interface FAQProps {
  id?: string;
  title?: string;
  subtitle?: string;
  faqs: { question: string; answer: any }[]; // answer may come as string or HTML object
  onCtaClick: () => void;
}

export default function FAQ({
  id = "faq",
  title = "Frequently Asked Questions",
  subtitle,
  faqs = [],
  onCtaClick,
}: FAQProps) {
  if (!faqs || !faqs.length) return null;

  /* ---------- Helpers ---------- */

  // Remove HTML tags (safe, quick)
  const stripHTML = (s: string) => s.replace(/<\/?[^>]+(>|$)/g, "");

  // Unwrap URLs inside parentheses: (https://example.com) -> https://example.com
  const unwrapParenthesizedUrls = (s: string) =>
    s.replace(/\((https?:\/\/[^\s)]+)\)/gi, "$1").replace(/\((www\.[^\s)]+)\)/gi, "https://$1");

  // Force value to plain string and normalize
  const normalizeAnswerString = (input: any) => {
    if (input == null) return "";
    // If it's already a string, use it; if not, convert to string
    let s = typeof input === "string" ? input : String(input);
    // Some CMS wrap links in <p>... or other tags; remove tag wrappers
    s = stripHTML(s);
    // Unwrap parenthesis wrapped urls
    s = unwrapParenthesizedUrls(s);
    // Trim extra whitespace
    return s.trim();
  };

  // Linkify text into React nodes (WhatsApp placeholder, email, URL)
  const linkifyText = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Combined regex:
    // 1: whatsapp placeholder [whatsapp:+919...]
    // 2: email
    // 3: url with protocol or starting with www.
    const REGEX =
      /\[whatsapp:(\+?\d+)\]|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|\b((?:https?:\/\/|www\.)[^\s<>]+)\b/gi;

    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = REGEX.exec(text)) !== null) {
      if (last < match.index) parts.push(text.slice(last, match.index));

      if (match[1]) {
        // WhatsApp placeholder
        const phone = match[1].replace(/\D/g, "");
        parts.push(
          <a
            key={`wa-${match.index}`}
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium text-sm">
              <WhatsAppIcon />
              Chat on WhatsApp
            </button>
          </a>
        );
      } else if (match[2]) {
        // email
        const email = match[2];
        parts.push(
          <a key={`email-${match.index}`} href={`mailto:${email}`} className="text-blue-600 underline">
            {email}
          </a>
        );
      } else if (match[3]) {
        // URL
        const raw = match[3];
        const url = raw.startsWith("http") ? raw : `https://${raw}`;
        parts.push(
          <a
            key={`url-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition"
            title={url}
          >
            {raw}
          </a>
        );
      }

      last = REGEX.lastIndex;
    }

    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  // Render answer: split into paragraphs and linkify each line
  const renderAnswer = (input: any): React.ReactNode => {
    const str = normalizeAnswerString(input);
    if (!str) return null;
    // preserve paragraphs separated by two newlines or single newline
    const lines = str.split(/\n+/).filter(Boolean);
    return lines.map((line, idx) => (
      <p className="mb-3" key={idx}>
        {linkifyText(line)}
      </p>
    ));
  };

  /* ---------- Analytics / CTA handlers ---------- */

  const trackFaqOpen = (question: string) => {
    try {
      window?.dataLayer?.push?.({
        event: "select_content",
        content_type: "faq_question",
        item_id: question,
      });
      window?.fbq?.("trackCustom", "FAQOpened", { question });
    } catch {
      /* noop */
    }
  };

  const handleCtaClick = () => {
    try {
      window?.dataLayer?.push?.({ event: "cta_click", section: "faq" });
      window?.fbq?.("trackCustom", "CTAClicked", { section: "FAQ" });
    } catch {
      /* noop */
    }
    onCtaClick?.();
  };

  /* ---------- Render component ---------- */

  return (
    <section id={id} className="py-20 lg:py-28 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border px-6">
                <AccordionTrigger onClick={() => trackFaqOpen(faq.question)} className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>

                <AccordionContent className="pb-6 text-muted-foreground">
                  {renderAnswer(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <CTAButtons onFormOpen={handleCtaClick} variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
