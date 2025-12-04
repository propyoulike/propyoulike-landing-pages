// src/templates/common/Tracking.tsx

import { useEffect } from "react";

export default function Tracking() {
  useEffect(() => {
    // Example: fire pageview or analytics event
    // Replace with your actual tracking integrations
    console.log("Tracking: page loaded");

    // Example: Facebook Meta Pixel
    // window.fbq?.("track", "PageView");

    // Example: Google Analytics
    // window.gtag?.("event", "page_view");
  }, []);

  return null; // This component renders nothing, only tracks
}
