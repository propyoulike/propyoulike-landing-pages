// src/components/lead/LeadForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRef } from "react";

import type { LeadIntent } from "./types/LeadIntent";
import { LeadPipeline } from "./LeadPipeline";

import { useTracking } from "@/lib/tracking/TrackingContext";
import { EventName } from "@/lib/analytics/events";

/* -------------------------------------------------
   Schema
-------------------------------------------------- */
const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/),
  message: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectName: string;
  projectId?: string; // project.slug
  whatsappNumber: string;
  intent?: LeadIntent;
  onSuccess?: () => void;
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
export default function LeadForm({
  projectName,
  projectId = "UNKNOWN",
  whatsappNumber,
  intent,
  onSuccess,
}: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { track } = useTracking();

  // 🔒 GUARANTEE: fires once per form lifecycle
  const hasStartedRef = useRef(false);

  /* -----------------------------------------------
     form_start (ONCE, FORM-LEVEL)
  ------------------------------------------------ */
  const handleFormStart = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    track(EventName.FormStart);
  };

  /* -----------------------------------------------
     Submit handler
  ------------------------------------------------ */
  const onSubmit = async (data: FormData) => {
    // Attempt signal (not conversion)
    track(EventName.FormSubmit);

    const waUrl = LeadPipeline.buildWhatsAppUrl(
      data,
      projectName,
      whatsappNumber,
      intent
    );

    // Backend / CRM source of truth
    await LeadPipeline.submitLead({
      data,
      projectName,
      projectId,
      intent,
    });

    // ✅ REAL conversion
    track(EventName.LeadCreated, {
      project_id: projectId,
      project_name: projectName,
      builder_id: intent?.builderId,

      source_section: intent?.sourceSection,
      source_item: intent?.sourceItem,

      page_slug: window.location.pathname.replace("/", ""),
      section_id: "lead_form",
    });

    window.open(waUrl, "_blank");
    reset();
    onSuccess?.();
  };

  return (
    <form
      onFocusCapture={handleFormStart}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
    >
      {intent?.question && (
        <div className="text-sm bg-muted p-3 rounded-lg">
          You’re asking about:
          <strong className="block mt-1">“{intent.question}”</strong>
        </div>
      )}

      <input {...register("name")} placeholder="Name" />

      <input {...register("phone")} placeholder="Phone" />

      <textarea {...register("message")} placeholder="Your message" />

      <button type="submit" className="w-full btn-gradient">
        Get Best Offers
      </button>

      <p className="text-[11px] text-muted-foreground leading-snug">
        By submitting this form, you agree to be contacted by{" "}
        <strong>PropYouLike</strong>, an authorized channel partner for this project,
        to assist with site visits and project information.
        PropYouLike is not the developer or promoter.
      </p>
    </form>
  );
}
