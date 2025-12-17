// src/components/lead/useLeadCTA.tsx
import { useEffect, useState, useCallback } from "react";
import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";
import FloatingCTA from "./FloatingCTA";

export type CTAIntent = {
  source?: "faq" | "hero" | "floating" | "section" | "unknown";
  label?: string;
  question?: string;
};

interface UseLeadCTAProps {
  projectName: string;
  projectId?: string;
  whatsappNumber: string;

  trackEvent?: (name: string, data?: any) => void;
}

export function useLeadCTA({
  projectName,
  projectId = "UNKNOWN",
  whatsappNumber,
  trackEvent,
}: UseLeadCTAProps) {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  /** 🔥 Store CTA intent */
  const [intent, setIntent] = useState<CTAIntent | null>(null);

  /** ----------------------------------------------------------
   * Device detection
   * ---------------------------------------------------------- */
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  /** ----------------------------------------------------------
   * Open CTA with intent
   * ---------------------------------------------------------- */
  const open = useCallback(
    (nextIntent?: CTAIntent) => {
      setIntent(nextIntent || null);

      trackEvent?.("cta_opened", {
        project: projectName,
        project_id: projectId,
        source: nextIntent?.source || "generic",
        label: nextIntent?.label,
        question: nextIntent?.question,
      });

      if (isMobile) setOpenDrawer(true);
      else setOpenModal(true);
    },
    [isMobile, projectName, projectId, trackEvent]
  );

  /** ----------------------------------------------------------
   * Close CTA
   * ---------------------------------------------------------- */
  const close = useCallback(() => {
    setOpenDrawer(false);
    setOpenModal(false);
    setIntent(null);
  }, []);

  /** ----------------------------------------------------------
   * Engagement tracking (optional)
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!trackEvent) return;

    const timer = setTimeout(() => {
      trackEvent("landing_page_engaged", {
        project: projectName,
        project_id: projectId,
        engaged_after_sec: 8,
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, [trackEvent, projectName, projectId]);

  /** ----------------------------------------------------------
   * Render controlled CTA UI
   * ---------------------------------------------------------- */
  const CTAComponents = (
    <>
      {/* Desktop Modal */}
      <LeadFormModal
        open={openModal}
        onOpenChange={setOpenModal}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
        intent={intent} // 🔥 PASS INTENT
      />

      {/* Mobile Drawer */}
      <LeadFormDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
        intent={intent} // 🔥 PASS INTENT
      />

      {/* Floating CTA */}
      <FloatingCTA
        whatsappNumber={whatsappNumber}
        onEnquire={() =>
          open({
            source: "floating",
            label: "Floating CTA",
          })
        }
      />
    </>
  );

  return {
    open,          // open(intent?)
    close,
    CTAComponents,
    openModal,
    openDrawer,
    intent,        // exposed if needed
  };
}
