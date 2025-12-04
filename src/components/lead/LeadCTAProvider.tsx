import { createContext, useContext, useState, useCallback } from "react";
import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";

interface CTAContextType {
  openCTA: (label?: string) => void;
  closeCTA: () => void;
  isMobile: boolean;
}

const CTAContext = createContext<CTAContextType | null>(null);

export const LeadCTAProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = window.innerWidth < 768;

  const openCTA = useCallback((label?: string) => {
    window.dataLayer?.push({
      event: "cta_open",
      label: label || "generic",
    });

    if (isMobile) setDrawerOpen(true);
    else setModalOpen(true);
  }, []);

  const closeCTA = useCallback(() => {
    setModalOpen(false);
    setDrawerOpen(false);
  }, []);

  return (
    <CTAContext.Provider value={{ openCTA, closeCTA, isMobile }}>
      {children}

      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
      <LeadFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </CTAContext.Provider>
  );
};

export const useLeadCTAContext = () => {
  const ctx = useContext(CTAContext);
  if (!ctx) throw new Error("useLeadCTAContext must be used inside LeadCTAProvider");
  return ctx;
};
