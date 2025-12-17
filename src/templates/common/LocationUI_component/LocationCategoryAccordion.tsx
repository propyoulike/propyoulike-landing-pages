import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface LocationCategory {
  title: string;
  items: string[];
}

export default function LocationCategoryAccordion({
  categories = [],
}: {
  categories: LocationCategory[];
}) {
  if (!categories.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-4"
    >
      {categories.map((category, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx}`}
          className="accordion-card"
        >
          <AccordionTrigger className="accordion-trigger">
            <span className="text-base font-semibold">
              {category.title}
            </span>
          </AccordionTrigger>

          <AccordionContent className="accordion-content-item">
            <ul className="space-y-3">
              {category.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 items-start"
                >
                  <span className="accordion-bullet mt-2" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
