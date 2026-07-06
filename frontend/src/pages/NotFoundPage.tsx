import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="container" style={{ padding: "var(--sp-8) 0", textAlign: "center" }}>
        <h1>404 — Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/">
          <Button>Back home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
