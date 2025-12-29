// src/lib/analytics/eventPayloads.ts

import { EventName } from "./events";

export type EventPayloadMap = {
  [EventName.PageView]: {
    project_slug: string;
  };

  [EventName.SectionView]: {
    section_id: string;
  };

  [EventName.CTAClick]: {
    cta_type: string;
    section_id?: string;
  };

  [EventName.FormSubmit]: {
    form_id: string;
  };

  [EventName.LeadCreated]: {
    lead_type: string;
    source?: string;
  };

  // others can be progressively typed
};
