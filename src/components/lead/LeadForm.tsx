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
  projectId?: string;
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
  const hasStartedRef = useRef(false);

  /* -----------------------------------------------
     Diagnostics: form_start (once)
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
    // Diagnostic signal (NOT a conversion)
    track(EventName.FormSubmit);

    const waUrl = LeadPipeline.buildWhatsAppUrl(
      data,
      projectName,
      whatsappNumber,
      intent
    );

    await LeadPipeline.submitLead({
      data,
      projectName,
      projectId,
      intent,
    });

    window.open(waUrl, "_blank");
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {intent?.question && (
        <div className="text-sm bg-muted p-3 rounded-lg">
          You’re asking about:
          <strong className="block mt-1">“{intent.question}”</strong>
        </div>
      )}

      <input
        {...register("name")}
        placeholder="Name"
        onFocus={handleFormStart}
      />

      <input
        {...register("phone")}
        placeholder="Phone"
        onFocus={handleFormStart}
      />

      <textarea
        {...register("message")}
        placeholder="Your message"
        onFocus={handleFormStart}
      />

      <button type="submit" className="w-full btn-gradient">
        Get Best Offers
      </button>
    </form>
  );
}
