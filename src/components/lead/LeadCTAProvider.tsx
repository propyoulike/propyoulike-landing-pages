import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import LeadFormModal from "./LeadFormModal";
import LeadFormDrawer from "./LeadFormDrawer";
import type { LeadIntent } from "./types/LeadIntent";

/* ✅ Analytics (CANONICAL) */
import { track } from "@/lib/tracking/track";
import { EventName } from "@/lib/analytics/events";
import { SectionId } from "@/lib/analytics/sectionIds";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

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

/* ------------------------------------------------------------
   Context
------------------------------------------------------------ */

const CTAContext = createContext<CTAContextType | null>(null);

/* ------------------------------------------------------------
   Provider
------------------------------------------------------------ */

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

  /* ----------------------------------------------------------
     Device detection (SAFE)
  ---------------------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ----------------------------------------------------------
     Open CTA (CANONICAL)
  ---------------------------------------------------------- */
  const openCTA = useCallback(
    (intentData?: LeadIntent) => {
      setIntent(intentData);

      track(EventName.CTAInteraction, {
        section_id: SectionId.LeadCTA,
        project_id: projectId,
        project_name: projectName,
        source_item: intentData?.source,
        label: intentData?.label || "generic",
        question: intentData?.question,
      });

      isMobile ? setDrawerOpen(true) : setModalOpen(true);
    },
    [isMobile, projectId, projectName]
  );

  /* ----------------------------------------------------------
     Close CTA
  ---------------------------------------------------------- */
  const closeCTA = () => {
    setModalOpen(false);
    setDrawerOpen(false);
    setIntent(undefined);
  };

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */
  return (
    <CTAContext.Provider
      value={{ openCTA, closeCTA, isMobile, intent }}
    >
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

/* ------------------------------------------------------------
   Hook (STRICT)
------------------------------------------------------------ */

export const useLeadCTAContext = () => {
  const ctx = useContext(CTAContext);
  if (!ctx) {
    throw new Error(
      "useLeadCTAContext must be used inside LeadCTAProvider"
    );
  }
  return ctx;
};
