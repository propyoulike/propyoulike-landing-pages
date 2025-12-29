import { cloneElement, isValidElement, ReactElement } from "react";

import { useAnalytics } from "@/lib/analytics/useAnalytics";
import { EventName } from "@/lib/analytics/events";
import { CTAType } from "@/lib/analytics/ctaTypes";
import { SectionId } from "@/lib/analytics/sectionIds";

interface TrackedCTAProps {
  ctaType: CTAType;
  sectionId?: SectionId;
  children: ReactElement;
}

export default function TrackedCTA({
  ctaType,
  sectionId,
  children,
}: TrackedCTAProps) {
  const { track } = useAnalytics();

  if (!isValidElement(children)) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("TrackedCTA requires a single valid React element");
    }
    return null;
  }

  const originalOnClick = children.props.onClick;

  function handleClick(event: any) {
    track(EventName.CTAClick, {
      cta_type: ctaType,
      section_id: sectionId,
    });

    if (typeof originalOnClick === "function") {
      originalOnClick(event);
    }
  }

  return cloneElement(children, {
    onClick: handleClick,
  });
}
