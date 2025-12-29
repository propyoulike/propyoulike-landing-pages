// src/App.tsx

import { Routes, Route, ScrollRestoration } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { IS_DEV } from "@/env/runtime";
import { useResetScrollOnLoad } from "@/hooks/useResetScrollOnLoad";

import Index from "@/pages/Index";
import DynamicRouter from "@/pages/DynamicRouter";
import NotFound from "@/pages/NotFound";

import BuilderPage from "@/pages/BuilderPage";
import LocalityPage from "@/pages/LocalityPage";
import CityPage from "@/pages/CityPage";
import ZonePage from "@/pages/ZonePage";

import PrivacyPage from "@/components/legal/PrivacyPage";
import TermsPage from "@/components/legal/TermsPage";
import ReraPage from "@/components/legal/ReraPage";

import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { runtimeLog } from "@/lib/log/runtimeLog";

const queryClient = new QueryClient();

function DisableScrollRestoration() {
  return <ScrollRestoration getKey={() => "always-new"} />;
}

export default function App() {
  useResetScrollOnLoad();

  runtimeLog("App", "info", "App rendered", {
    env: IS_DEV ? "development" : "production",
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LeadCTAProvider>
            <Toaster />
            <Sonner />
            <DisableScrollRestoration />

            {IS_DEV && (
              <div
                style={{
                  position: "fixed",
                  bottom: 8,
                  right: 8,
                  fontSize: 11,
                  opacity: 0.5,
                  zIndex: 9999,
                }}
              >
                DEV MODE — prerender disabled
              </div>
            )}

            <Routes>
              <Route path="/" element={<Index />} />

              {/* Legal */}
              <Route path="/legal/privacy" element={<PrivacyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/rera" element={<ReraPage />} />

              {/* Known routes */}
              <Route path="/builder/:builder" element={<BuilderPage />} />
              <Route path="/locality/:locality" element={<LocalityPage />} />
              <Route path="/:city/:zone" element={<ZonePage />} />

              {/* Catch-all */}
              <Route path="/:slug" element={<DynamicRouter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LeadCTAProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
