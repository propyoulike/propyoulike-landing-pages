// src/App.tsx
import { Routes, Route, ScrollRestoration } from "react-router-dom";
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
import AboutPage from "@/components/legal/AboutPage";
import ContactPage from "@/components/legal/ContactPage";

function DisableScrollRestoration() {
  return <ScrollRestoration getKey={() => "always-new"} />;
}

export default function App() {
  useResetScrollOnLoad();

  return (
    <>
      <DisableScrollRestoration />

      {IS_DEV && (
        <div style={{ position: "fixed", bottom: 8, right: 8, fontSize: 11 }}>
          DEV MODE
        </div>
      )}

      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/legal/about" element={<AboutPage />} />
        <Route path="/legal/contact" element={<ContactPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/rera" element={<ReraPage />} />

        <Route path="/builder/:builder" element={<BuilderPage />} />
        <Route path="/locality/:locality" element={<LocalityPage />} />
        <Route path="/:city/:zone" element={<ZonePage />} />

        <Route path="/:slug" element={<DynamicRouter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
