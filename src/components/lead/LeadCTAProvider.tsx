import { createContext, useContext, useState, useCallback } from "react";
import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

interface CTAContextType {
  openCTA: (label?: string) => void;
  closeCTA: () => void;
  isMobile: boolean;
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
  whatsappNumber = "919379822010"
}: LeadCTAProviderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const openCTA = useCallback((label?: string) => {
    window.dataLayer?.push({
      event: "cta_open",
      label: label || "generic",
    });

    if (isMobile) setDrawerOpen(true);
    else setModalOpen(true);
  }, [isMobile]);

  const closeCTA = useCallback(() => {
    setModalOpen(false);
    setDrawerOpen(false);
  }, []);

  return (
    <CTAContext.Provider value={{ openCTA, closeCTA, isMobile }}>
      {children}

      <LeadFormModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        projectName={projectName}
        whatsappNumber={whatsappNumber}
        projectId={projectId}
      />
      <LeadFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        projectName={projectName}
        whatsappNumber={whatsappNumber}
        projectId={projectId}
      />
    </CTAContext.Provider>
  );
};

export const useLeadCTAContext = () => {
  const ctx = useContext(CTAContext);
  if (!ctx) throw new Error("useLeadCTAContext must be used inside LeadCTAProvider");
  return ctx;
};
