import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion";

export default function LocationCategoryAccordion({ categories }) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {categories.map((category, idx) => (
        <AccordionItem key={idx} value={`item-${idx}`}>
          <AccordionTrigger>
            <span>{category.title}</span>
          </AccordionTrigger>

          <AccordionContent>
            <ul className="space-y-3">
              {category.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
