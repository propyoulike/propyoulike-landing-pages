// src/components/lead/LeadPipeline.ts

export const LeadPipeline = {
  /** ---------------------------------------------------------
   * 1. Generate WhatsApp message
   * -------------------------------------------------------- */
  buildWhatsAppUrl(data: any, projectName: string, whatsappNumber: string) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hi, I’m ${data.name}. I'm interested in ${projectName}. BHK: ${
        data.bhkPreference || "Not Sure"
      }. Please share availability, views & pricing.`
    )}`;
  },

  /** ---------------------------------------------------------
   * 2. Push GTM Event (GA4, Google Ads, Tags)
   * -------------------------------------------------------- */
  pushGTM(eventName: string, data: any) {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...data,
        ga_measurement_id: "G-YZLLC4DES1",
        gads_conversion_id: "AW-17754016716",
      });
    }
  },

  /** ---------------------------------------------------------
   * 3. Facebook Pixel
   * -------------------------------------------------------- */
  fbPixel(event: string, data?: any) {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", event, data);
    }
  },

  /** ---------------------------------------------------------
   * 4. Submit to Privyr CRM
   * -------------------------------------------------------- */
  async submitToPrivyr(payload: any) {
    await fetch(
      "https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/5xrM2juN",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  },

  /** ---------------------------------------------------------
   * 5. MASTER SUBMITTER
   * Called by every CTA / Modal / Form
   * -------------------------------------------------------- */
  async submitLead({
    data,
    projectName,
    projectId,
    whatsappNumber,
  }: {
    data: any;
    projectName: string;
    projectId: string;
    whatsappNumber: string;
  }) {
    // ---- GTM ----
    this.pushGTM("lead_submit", {
      project: projectName,
      project_id: projectId,
      phone: data.phone,
      bhk: data.bhkPreference,
    });

    // ---- FB Pixel ----
    this.fbPixel("Lead", {
      project: projectName,
      phone: data.phone,
    });

    // ---- CRM ----
    await this.submitToPrivyr({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      message: `Project: ${projectName}\nBHK: ${data.bhkPreference}`,
    });

    // ---- WhatsApp ----
    const wa = this.buildWhatsAppUrl(data, projectName, whatsappNumber);

    return wa;
  },
};
