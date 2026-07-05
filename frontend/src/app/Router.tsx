import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LaunchPage from "../pages/LaunchPage";
import ExplorePage from "../pages/ExplorePage";
import TokenDetailPage from "../pages/TokenDetailPage";
import TrustSafetyPage from "../pages/TrustSafetyPage";
import TermsPage from "../pages/TermsPage";
import PrivacyPage from "../pages/PrivacyPage";
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/token/:id" element={<TokenDetailPage />} />
        <Route path="/trust-safety" element={<TrustSafetyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
