// src/app/AppProviders.tsx
import { Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";
import { TrackingProvider } from "@/lib/tracking/TrackingContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import propyoulike from "@/content/global/propyoulike.json";
import { normalizeWhatsappNumber } from "@/utils/normalizeWhatsapp";

const queryClient = new QueryClient();

export function AppProviders() {
  const whatsappNumber = normalizeWhatsappNumber(
    propyoulike.contact?.whatsapp || propyoulike.contact?.phone
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TrackingProvider>
          <TooltipProvider>
            <LeadCTAProvider
              projectName={null}
              projectId={null}
              whatsappNumber={whatsappNumber}
            >
              <Toaster />
              <Sonner />
              <Outlet />
            </LeadCTAProvider>
          </TooltipProvider>
        </TrackingProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
