import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
