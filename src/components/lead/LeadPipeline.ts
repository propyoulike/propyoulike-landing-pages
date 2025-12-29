import type { LeadIntent } from "./types/LeadIntent";

const LEADS_ENDPOINT = "https://leads.propyoulike.workers.dev/";

export const LeadPipeline = {
  /* -----------------------------------------------------------
     WhatsApp URL (side-channel, not analytics)
  ----------------------------------------------------------- */
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

  /* -----------------------------------------------------------
     Lead submission (AUTHORITATIVE)
     → Cloudflare Worker
     → Privyr (CRM)
     → GA4 lead_created (server-side)
  ----------------------------------------------------------- */
  async submitLead({
    data,
    projectName,
    projectId,
    intent,
  }: {
    data: {
      name: string;
      phone: string;
      message: string;
    };
    projectName: string;
    projectId: string;
    intent?: LeadIntent;
  }) {
    const res = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        message: data.message,
        projectName,
        projectId,
        intent,
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
