// src/templates/common/Faq_component/components/FAQItemCard.tsx
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import highlight from "../utils/highlight";
import normalize from "../utils/normalize";

export default function FAQItemCard({ faq }) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      <AccordionItem
        value={faq.question}
        className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition"
      >
        <AccordionTrigger className="py-5 text-left text-lg font-semibold">
          {faq.question}
        </AccordionTrigger>

        <AccordionContent className="pb-6 text-muted-foreground">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
