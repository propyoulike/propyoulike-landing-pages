// src/hooks/useLeadIntent.ts

import { useEffect, useState } from "react";
import type { LeadIntent } from "@/components/lead/types/LeadIntent";

export function useLeadIntent() {
  const [intent, setIntent] = useState<LeadIntent>({});

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<LeadIntent>;
      setIntent((prev) => ({
        ...prev,
        ...custom.detail,
      }));
    };

    window.addEventListener("lead:intent", handler);
    return () =>
      window.removeEventListener("lead:intent", handler);
  }, []);

  return intent;
}
