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

/* ✅ Analytics */
import { track } from "@/lib/tracking/track";
import { EventName } from "@/lib/analytics/events";
import { SectionId } from "@/lib/analytics/sectionIds";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

interface CTAContextType {
  openCTA: (intent?: LeadIntent & { ctaLabel?: string }) => void;
  closeCTA: () => void;
  isMobile: boolean;
  intent?: LeadIntent & { ctaLabel?: string };
  isCTAOpen: boolean;
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
  const [intent, setIntent] =
    useState<(LeadIntent & { ctaLabel?: string }) | undefined>();
  const [isMobile, setIsMobile] = useState(false);

  const isCTAOpen = modalOpen || drawerOpen;

  /* ----------------------------------------------------------
     Device detection
  ---------------------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ----------------------------------------------------------
     ✅ CANONICAL OPEN CTA (SOURCE OF TRUTH)
  ---------------------------------------------------------- */
  const openCTA = useCallback(
    (incomingIntent?: LeadIntent & { ctaLabel?: string }) => {
      const normalizedIntent: LeadIntent & { ctaLabel?: string } = {
        ...incomingIntent,

        /**
         * 🔑 ABSOLUTE KEY FIX
         * Every CTA must resolve a decisionStage HERE
         * This is why all forms were looking the same earlier.
         */
        decisionStage:
          incomingIntent?.decisionStage ||
          incomingIntent?.buyerStage ||
          "exploring",

        /* backward compatibility */
        source: incomingIntent?.sourceSection,

        label:
          incomingIntent?.ctaLabel ||
          incomingIntent?.label ||
          "Explore layouts",
      };

      setIntent(normalizedIntent);

      /* analytics observer */
      track(EventName.CTAInteraction, {
        section_id: SectionId.LeadCTA,
        project_id: projectId,
        project_name: projectName,
        source_item: normalizedIntent.sourceItem,
        label: normalizedIntent.label,
        decision_stage: normalizedIntent.decisionStage,
        question: normalizedIntent.question,
      });

      isMobile ? setDrawerOpen(true) : setModalOpen(true);
    },
    [isMobile, projectId, projectName]
  );

  /* ----------------------------------------------------------
     Close CTA
  ---------------------------------------------------------- */
  const closeCTA = useCallback(() => {
    setModalOpen(false);
    setDrawerOpen(false);
    setIntent(undefined);
  }, []);

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */
  return (
    <CTAContext.Provider
      value={{ openCTA, closeCTA, isMobile, intent, isCTAOpen }}
    >
      {children}

      {/* Desktop */}
      <LeadFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projectName={projectName}
        projectId={projectId}
        whatsappNumber={whatsappNumber}
        intent={intent}
      />

      {/* Mobile */}
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
   Hook
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
