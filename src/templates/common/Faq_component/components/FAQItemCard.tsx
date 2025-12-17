// src/templates/common/Faq_component/components/FAQItemCard.tsx

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQItemCard({ faq }: { faq: any }) {
  return (
    <AccordionItem
      value={faq.question}
      className="
        rounded-xl border border-border
        bg-background
        px-6
        transition
        hover:bg-muted/30
      "
    >
      <AccordionTrigger className="py-5 text-left">
        <span className="text-base md:text-lg font-semibold">
          {faq.question}
        </span>
      </AccordionTrigger>

      <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  );
}
