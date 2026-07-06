import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import TokenCard from "../components/token/TokenCard";
import { listTokens } from "../services/tokenService";
import type { TrustFunToken } from "../types/token";
import styles from "./ExplorePage.module.css";

type Filter = "all" | "locked" | "verified" | "needs-review";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "locked", label: "Liquidity locked" },
  { id: "verified", label: "Verified creator" },
  { id: "needs-review", label: "Tokenomics pending review" },
];

export default function ExplorePage() {
  const [tokens, setTokens] = useState<TrustFunToken[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let active = true;
    listTokens().then((data) => {
      if (active) setTokens(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!tokens) return [];
    return tokens.filter((t) => {
      const matchesQuery =
        query.trim().length === 0 ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.symbol.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "locked" && t.liquidityLock.locked) ||
        (filter === "verified" && t.creator.verified) ||
        (filter === "needs-review" && t.tokenomics.complianceStatus === "pending_review");

      return matchesQuery && matchesFilter;
    });
  }, [tokens, query, filter]);

  return (
    <PageLayout>
      <div className="container">
        <div className={styles.head}>
          <h1>Explore tokens</h1>
          <p>Browse live launches. Every card shows liquidity lock status and a baseline risk score before you click in.</p>
        </div>

        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search by name or symbol"
            aria-label="Search tokens"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--surface-border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              padding: "0.6rem 0.9rem",
            }}
          />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.filterBtn} ${filter === f.id ? styles.filterBtnActive : ""}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {tokens === null && (
          <p role="status" aria-live="polite">
            Loading tokens…
          </p>
        )}

        {tokens !== null && filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No tokens match your filters.</p>
          </div>
        )}

        {tokens !== null && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((t) => (
              <TokenCard key={t.id} token={t} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
