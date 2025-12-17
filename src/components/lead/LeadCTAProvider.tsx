// src/components/lead/LeadCTAProvider.tsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";
import type { LeadIntent } from "./types/LeadIntent";

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

interface CTAContextType {
  openCTA: (intent?: LeadIntent) => void;
  closeCTA: () => void;
  isMobile: boolean;
  intent?: LeadIntent;
}

interface LeadCTAProviderProps {
  children: React.ReactNode;
  projectName?: string;
  projectId?: string;
  whatsappNumber?: string;
}

const CTAContext = createContext<CTAContextType | null>(null);

export const LeadCTAProvider = ({
  children,
  projectName = "Project",
  projectId = "UNKNOWN",
  whatsappNumber = "919379822010",
}: LeadCTAProviderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [intent, setIntent] = useState<LeadIntent | undefined>();
  const [isMobile, setIsMobile] = useState(false);

  /** -------- Device detection -------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /** -------- Open CTA -------- */
  const openCTA = useCallback((intentData?: LeadIntent) => {
    setIntent(intentData);

    window.dataLayer?.push({
      event: "cta_open",
      source: intentData?.source,
      question: intentData?.question,
      label: intentData?.label || "generic",
    });

    isMobile ? setDrawerOpen(true) : setModalOpen(true);
  }, [isMobile]);

  const closeCTA = () => {
    setModalOpen(false);
    setDrawerOpen(false);
    setIntent(undefined);
  };

  return (
    <CTAContext.Provider value={{ openCTA, closeCTA, isMobile, intent }}>
      {children}

      <LeadFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
        intent={intent}
      />

      <LeadFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
        intent={intent}
      />
    </CTAContext.Provider>
  );
};

export const useLeadCTAContext = () => {
  const ctx = useContext(CTAContext);
  if (!ctx) throw new Error("useLeadCTAContext must be used inside LeadCTAProvider");
  return ctx;
};
