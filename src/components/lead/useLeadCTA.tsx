// src/components/lead/useLeadCTA.tsx
import { useEffect, useState, useCallback } from "react";
import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";
import FloatingCTA from "./FloatingCTA";

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

  /** ----------------------------------------------------------
   * Device detection (runs once)
   * ---------------------------------------------------------- */
  const isMobile = typeof window !== "undefined"
    ? window.innerWidth < 768
    : false;

  /** ----------------------------------------------------------
   * CTA Open → auto-detect device
   * ---------------------------------------------------------- */
  const open = useCallback(() => {
    // Track CTA click
    trackEvent?.("cta_clicked", {
      component: "useLeadCTA",
      project: projectName,
      project_id: projectId,
    });

    if (isMobile) {
      setOpenDrawer(true);
    } else {
      setOpenModal(true);
    }
  }, [isMobile, projectName, projectId, trackEvent]);

  /** ----------------------------------------------------------
   * CTA Close
   * ---------------------------------------------------------- */
  const close = useCallback(() => {
    setOpenDrawer(false);
    setOpenModal(false);
  }, []);

  /** ----------------------------------------------------------
   * Attach global event to track scroll depth or time on page
   * (Optional but improves ad optimization)
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
   * Render UI components controlled by this hook
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
      />

      {/* Mobile Drawer */}
      <LeadFormDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
      />

      {/* Floating CTA (mobile only) */}
      <FloatingCTA
        whatsappNumber={whatsappNumber}
        onEnquire={open}
      />
    </>
  );

  return {
    open,
    close,
    CTAComponents,
    openModal,
    openDrawer,
  };
}
