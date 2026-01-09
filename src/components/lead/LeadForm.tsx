import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRef } from "react";

import type { LeadIntent } from "./types/LeadIntent";
import { LeadPipeline } from "./LeadPipeline";

import { useTracking } from "@/lib/tracking/TrackingContext";
import { EventName } from "@/lib/analytics/events";

/* =================================================
   Schema
================================================= */
const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectName: string;
  projectId?: string;
  builderId: string;
  whatsappNumber: string;
  intent?: LeadIntent;
  onSuccess?: () => void;
}

/* =================================================
   Copy Resolver (ABSOLUTE MUST)
================================================= */
const getCopyFromIntent = (intent?: LeadIntent) => {
  switch (intent?.decisionStage) {
    case "ready_to_visit":
      return {
        helper:
          "We’ll help you schedule a site visit, confirm timings, and share directions.",
        button: "Schedule site visit",
      };

    case "shortlisting":
      return {
        helper:
          "We’ll confirm available units, pricing bands, and current offers.",
        button: "Check availability",
      };

    default:
      return {
        helper:
          "We’ll share layouts, pricing ranges, and clarify details.",
        button: "Explore layouts",
      };
  }
};

/* =================================================
   Component
================================================= */
export default function LeadForm({
  projectName,
  projectId = "UNKNOWN",
  builderId,
  whatsappNumber,
  intent,
  onSuccess,
}: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { track } = useTracking();
  const hasStartedRef = useRef(false);

  /* ---------------------------------------------
     Resolve copy from intent
  --------------------------------------------- */
  const copy = getCopyFromIntent(intent);

  /* ---------------------------------------------
     Form start (fires once)
  --------------------------------------------- */
  const handleFormStart = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    track(EventName.FormStart, {
      decision_stage: intent?.decisionStage,
    });
  };

  /* ---------------------------------------------
     Submit handler (MONEY PATH)
  --------------------------------------------- */
  const onSubmit = async (data: FormData) => {
    track(EventName.FormSubmit);

    const decisionStage = intent?.decisionStage ?? "research";

    const stageLabelMap: Record<string, string> = {
      research: "Researching options",
      exploring: "Exploring projects",
      shortlisting: "Shortlisting homes",
      ready_to_visit: "Ready for site visit",
    };

    const enrichedIntent: LeadIntent = {
      ...intent,
      builderId,
      decisionStage,

      crm: {
        priority:
          decisionStage === "ready_to_visit"
            ? "HIGH"
            : decisionStage === "shortlisting"
            ? "MEDIUM"
            : "LOW",

        followup_type:
          decisionStage === "ready_to_visit"
            ? "CALL_IMMEDIATE"
            : "WHATSAPP_FOLLOWUP",

        call_script:
          decisionStage === "ready_to_visit"
            ? "VISIT_READY"
            : "RESEARCH_NURTURE",

        sales_note: `Buyer is ${stageLabelMap[decisionStage]}. Trust section reviewed.`,
      },
    };

    const waUrl = LeadPipeline.buildWhatsAppUrl(
      { ...data, email: data.email || undefined },
      projectName,
      whatsappNumber,
      enrichedIntent
    );

    await LeadPipeline.submitLead({
      data: { ...data, email: data.email || undefined },
      projectName,
      projectId,
      intent: enrichedIntent,
    });

    track(EventName.LeadCreated, {
      page_type: "project",
      page_slug: window.location.pathname.replace(/^\/|\/$/g, ""),
      project_id: projectId,
      project_name: projectName,
      builder_id: builderId,
      decision_stage: decisionStage,
      source: "lead_form",
      source_section: enrichedIntent.sourceSection,
      source_item: enrichedIntent.sourceItem,
    });

    window.open(waUrl, "_blank");
    reset();
    onSuccess?.();
  };

  /* ---------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <form
      onFocusCapture={handleFormStart}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
    >
      {intent?.question && (
        <div className="text-sm bg-muted p-3 rounded-lg">
          You’re asking about:
          <strong className="block mt-1">
            “{intent.question}”
          </strong>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {copy.helper}
      </p>

      <input {...register("name")} placeholder="Name" />
      <input {...register("phone")} placeholder="Phone" />
      <input {...register("email")} placeholder="Email (optional)" />
      <textarea {...register("message")} placeholder="Your message" />

      <button type="submit" className="w-full btn-gradient">
        {copy.button}
      </button>

      <p className="text-[11px] text-muted-foreground leading-snug">
        By submitting, you agree to be contacted by{" "}
        <strong>PropYouLike</strong>, an authorized channel partner.
      </p>
    </form>
  );
}
