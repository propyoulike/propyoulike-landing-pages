import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CTAButtons from "@/components/CTAButtons";

interface FAQItem {
  question: string;
  answer: string; // HTML allowed
}

interface FAQProps {
  id?: string;
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  onCtaClick: () => void;
}

export default function FAQ({
  id = "faq",
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common buyer questions.",
  faqs = [],
  onCtaClick,
}: FAQProps) {
  if (!faqs.length) return null;

  /* ---------------- Tracking: FAQ Open ---------------- */
  const trackFaqOpen = (question: string) => {
    window?.dataLayer?.push({
      event: "select_content",
      content_type: "faq_question",
      item_id: question,
    });

    window?.fbq?.("trackCustom", "FAQOpened", { question });
  };

  /* ---------------- Tracking: CTA ---------------- */
  const handleCtaClick = () => {
    window?.dataLayer?.push({
      event: "cta_click",
      section: "faq",
    });

    window?.fbq?.("trackCustom", "CTAClicked", {
      section: "FAQ",
    });

    onCtaClick();
  };

  return (
    <section id={id} className="py-20 lg:py-28 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-background rounded-xl border px-6"
              >
                <AccordionTrigger
                  onClick={() => trackFaqOpen(faq.question)}
                  className="text-left hover:no-underline py-6"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="text-muted-foreground pb-6">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
