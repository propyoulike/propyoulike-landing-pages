// src/components/lead/LeadPipeline.ts

import type { LeadIntent } from "./types/LeadIntent";

const LEADS_ENDPOINT = "https://leads.propyoulike.workers.dev/";

export const LeadPipeline = {
  buildWhatsAppUrl(
    data: any,
    projectName: string,
    whatsappNumber: string,
    intent?: LeadIntent
  ) {
    const stageLine = intent?.decisionStage
      ? `\nDecision stage: ${intent.decisionStage.toUpperCase()}`
      : "";

    const context = intent?.question
      ? `\n\nUser asked:\n"${intent.question}"`
      : "";

    const text = `
Hi, I'm interested in ${projectName}.

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email ?? "—"}
Message: ${data.message}${stageLine}${context}
`.trim();

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  async submitLead({
    data,
    projectName,
    projectId,
    intent,
  }: {
    data: {
      name: string;
      phone: string;
      email?: string;
      message: string;
    };
    projectName: string;
    projectId: string;
    intent?: LeadIntent;
  }) {
    const res = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        /* core */
        ...data,
        projectName,
        projectId,

        /* buyer intelligence */
        decision_stage: intent?.decisionStage ?? "research",
        trust_reviewed: intent?.trustReviewed ?? false,

        /* CRM */
        crm: intent?.crm,

        /* attribution */
        source_section: intent?.sourceSection,
        source_item: intent?.sourceItem,

        /* identity */
        builder_id: intent?.builderId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Lead submission failed:", errorText);
      throw new Error("Lead submission failed");
    }

    return res.json();
  },
};
