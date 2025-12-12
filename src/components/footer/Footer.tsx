// src/components/footer/Footer.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";

import FooterProjectColumn from "./FooterProjectColumn";
import FooterBuilderColumn from "./FooterBuilderColumn";
import FooterBrandColumn from "./FooterBrandColumn";

type FooterProps = {
  project?: any;
  builder?: any;
  brand?: any;
  legal?: any;
};

export default function Footer({ project, builder, brand, legal }: FooterProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((s) => ({ ...s, [field]: value }));

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name?.trim() || !form.phone?.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (!brand?.privyrEndpoint) {
      console.warn("No privyr endpoint configured, skipping submit.");
      alert("Thank you! We will reach out shortly.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(brand.privyrEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        console.warn("Privyr submission failed", res.status, await res.text());
        alert("Thanks — we received your request. If you don't hear from us, please email support.");
      } else {
        alert("Thank you! We will reach out shortly.");
        setForm({ name: "", phone: "", email: "" });
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("An error occurred while submitting. Please try again or email us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 pt-6">
      {/* A. CTA BAR */}
      <div className="bg-primary/95 py-8 px-4 text-center">
        <h3 className="text-xl font-semibold text-white mb-4 md:text-2xl">
          Get Floor Plans, Pricing & Expert Assistance
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 max-w-4xl mx-auto">
          <Input
            placeholder="Name"
            className="bg-white"
            value={form.name}
            onChange={(e: any) => handleChange("name", e.target.value)}
            aria-label="Your name"
          />
          <Input
            placeholder="Phone"
            className="bg-white"
            value={form.phone}
            onChange={(e: any) => handleChange("phone", e.target.value)}
            aria-label="Your phone"
          />
          <Input
            placeholder="Email"
            className="bg-white"
            value={form.email}
            onChange={(e: any) => handleChange("email", e.target.value)}
            aria-label="Your email"
          />
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </div>

        {brand?.contact?.whatsapp && (
          <a
            href={brand.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-4 items-center gap-2 text-white underline"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        )}
      </div>

      {/* B. FOOTER COLUMNS */}
      <div className="container mx-auto px-4 py-10 space-y-6 md:grid md:grid-cols-3 md:space-y-0 md:gap-12">
        <FooterProjectColumn project={project} />
        <FooterBuilderColumn builder={builder} />
        <FooterBrandColumn brand={brand} />
      </div>

      {/* C. LEGAL */}
      <div className="border-t border-gray-700 py-6 text-center">
        <div className="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:gap-6 md:justify-center">
          <a href="/legal/privacy" className="hover:text-white">
            {legal?.privacy?.title || "Privacy Policy"}
          </a>
          <a href="/legal/terms" className="hover:text-white">
            {legal?.terms?.title || "Terms of Use"}
          </a>
          <a href="/legal/rera" className="hover:text-white">
            {legal?.rera?.title || "RERA Disclaimer"}
          </a>
        </div>
      </div>

      {/* D. COPYRIGHT */}
      <div className="text-center py-4 text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} PropYouLike. All rights reserved.
      </div>
    </footer>
  );
}
