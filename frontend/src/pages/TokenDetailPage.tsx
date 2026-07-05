import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import DisclosureCard from "../components/token/DisclosureCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import { TextAreaField } from "../components/ui/Field";
import {
  getToken,
  listDiscussion,
  listProposals,
  postDiscussion,
  voteOnProposal,
} from "../services/tokenService";
import type { DiscussionPost, GovernanceProposal, TrustFunToken } from "../types/token";
import styles from "./TokenDetailPage.module.css";

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function ProposalRow({
  proposal,
  onVote,
}: {
  proposal: GovernanceProposal;
  onVote: (id: string, dir: "for" | "against") => void;
}) {
  const total = proposal.votesFor + proposal.votesAgainst || 1;
  const forPct = Math.round((proposal.votesFor / total) * 100);
  return (
    <div className={styles.proposal}>
      <div className={styles.proposalTop}>
        <h3 style={{ margin: 0, fontSize: "var(--fs-base)" }}>{proposal.title}</h3>
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {proposal.status === "open" ? "Open" : "Closed"}
        </span>
      </div>
      <p style={{ fontSize: "var(--fs-sm)", marginBottom: 0 }}>{proposal.description}</p>
      <div className={styles.voteRow}>
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--success-500)" }}>
          {proposal.votesFor} for
        </span>
        <span className={styles.voteBarTrack} aria-hidden="true">
          <span style={{ width: `${forPct}%`, background: "var(--success-500)" }} />
          <span style={{ width: `${100 - forPct}%`, background: "var(--danger-500)" }} />
        </span>
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--danger-500)" }}>
          {proposal.votesAgainst} against
        </span>
      </div>
      {proposal.status === "open" && (
        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-3)" }}>
          <Button size="sm" variant="secondary" onClick={() => onVote(proposal.id, "for")}>
            Vote for
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onVote(proposal.id, "against")}>
            Vote against
          </Button>
        </div>
      )}
    </div>
  );
}

export default function TokenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<TrustFunToken | null | undefined>(null);
  const [tab, setTab] = useState("disclosure");
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!id) return;
    getToken(id).then(setToken);
    listProposals(id).then(setProposals);
    listDiscussion(id).then(setPosts);
  }, [id]);

  if (token === null) {
    return (
      <PageLayout>
        <div className="container">
          <p role="status" aria-live="polite">
            Loading…
          </p>
        </div>
      </PageLayout>
    );
  }

  if (token === undefined) {
    return (
      <PageLayout>
        <div className="container" style={{ padding: "var(--sp-7) 0" }}>
          <h1>Token not found</h1>
          <p>We couldn&apos;t find a token with that ID.</p>
          <Link to="/explore">
            <Button variant="secondary">Back to Explore</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  async function handleVote(proposalId: string, direction: "for" | "against") {
    const updated = await voteOnProposal(proposalId, direction);
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? updated : p)));
  }

  async function handlePost() {
    if (!id || draft.trim().length === 0) return;
    const post = await postDiscussion(id, "You", draft.trim());
    setPosts((prev) => [...prev, post]);
    setDraft("");
  }

  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <Link to="/explore" className={styles.back}>
            ← Back to Explore
          </Link>

          <Tabs
            ariaLabel="Token detail sections"
            tabs={[
              { id: "disclosure", label: "Disclosure" },
              { id: "community", label: "Community" },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          <div className={styles.layout}>
            {tab === "disclosure" && <DisclosureCard token={token} />}

            {tab === "community" && (
              <div style={{ display: "grid", gap: "var(--sp-6)" }}>
                <Card>
                  <h2 style={{ fontSize: "var(--fs-lg)" }}>Governance proposals</h2>
                  {proposals.length === 0 ? (
                    <p style={{ marginBottom: 0 }}>No proposals yet for this token.</p>
                  ) : (
                    proposals.map((p) => (
                      <ProposalRow key={p.id} proposal={p} onVote={handleVote} />
                    ))
                  )}
                </Card>

                <Card>
                  <h2 style={{ fontSize: "var(--fs-lg)" }}>Discussion</h2>
                  {posts.length === 0 && <p>No posts yet — be the first to comment.</p>}
                  {posts.map((post) => (
                    <div key={post.id} className={styles.post}>
                      <div className={styles.postMeta}>
                        {post.author} · {relativeTime(post.createdAt)}
                      </div>
                      <p style={{ margin: 0 }}>{post.body}</p>
                    </div>
                  ))}

                  <div className={styles.composer}>
                    <TextAreaField
                      label="Add a comment"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Share your thoughts with the community…"
                      rows={2}
                    />
                    <Button onClick={handlePost} disabled={draft.trim().length === 0}>
                      Post
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
