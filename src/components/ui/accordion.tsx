// src/components/ui/accordion.tsx

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------
   Root
-------------------------------------------------- */
const Accordion = AccordionPrimitive.Root;

/* --------------------------------------------------
   Item
-------------------------------------------------- */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-background",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/* --------------------------------------------------
   Trigger
-------------------------------------------------- */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        `
        flex w-full items-center justify-between py-5 text-left
        font-semibold transition-all
        hover:text-primary
        [&[data-state=open]>svg]:rotate-180
        `,
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

/* --------------------------------------------------
   Content
-------------------------------------------------- */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="
      overflow-hidden text-sm
      data-[state=open]:animate-accordion-down
      data-[state=closed]:animate-accordion-up
    "
    {...props}
  >
    <div className={cn("pb-6 pt-2 text-muted-foreground", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
