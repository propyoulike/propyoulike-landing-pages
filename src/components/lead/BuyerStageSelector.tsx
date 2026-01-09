// src/components/lead/BuyerStageSelector.tsx

import type { LeadIntent } from "./types/LeadIntent";
import { useTracking } from "@/lib/tracking/TrackingContext";
import { EventName } from "@/lib/analytics/events";

interface Props {
  onSelect: (intent: LeadIntent) => void;
}

export default function BuyerStageSelector({ onSelect }: Props) {
  const { track } = useTracking();

  const selectStage = (stage: LeadIntent["decisionStage"]) => {
    // 1️⃣ Persist immediately
    sessionStorage.setItem("buyer_stage", stage!);

    // 2️⃣ Track intent (pre-lead)
    track(EventName.DecisionStageSelected, {
      decision_stage: stage,
    });

    // 3️⃣ Pass intent forward
    onSelect({
      decisionStage: stage,
      trustReviewed: true,
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={() => selectStage("exploring")}>
        Just exploring
      </button>

      <button onClick={() => selectStage("shortlisting")}>
        Shortlisting
      </button>

      <button onClick={() => selectStage("ready_to_visit")}>
        Ready to visit
      </button>
    </div>
  );
}
