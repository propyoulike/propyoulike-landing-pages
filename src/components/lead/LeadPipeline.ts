// src/components/lead/LeadPipeline.ts
import type { LeadIntent } from "./types/LeadIntent";

export const LeadPipeline = {
  buildWhatsAppUrl(
    data: any,
    projectName: string,
    whatsappNumber: string,
    intent?: LeadIntent
  ) {
    const context = intent?.question
      ? `\n\nUser asked:\n"${intent.question}"`
      : "";

    const text = `
Hi, I'm interested in ${projectName}.

Name: ${data.name}
Phone: ${data.phone}
Message: ${data.message}${context}
`.trim();

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  async submitLead({
    data,
    projectName,
    projectId,
    intent,
  }: {
    data: any;
    projectName: string;
    projectId: string;
    intent?: LeadIntent;
  }) {
    window.dataLayer?.push({
      event: "lead_submit",
      project: projectName,
      project_id: projectId,
      source: intent?.source,
      question: intent?.question,
    });
  },
};
