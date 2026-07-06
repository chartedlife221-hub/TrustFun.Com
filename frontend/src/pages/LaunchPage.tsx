import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { TextField, TextAreaField } from "../components/ui/Field";
import StepIndicator from "../components/wizard/StepIndicator";
import DisclosureCard from "../components/token/DisclosureCard";
import { useWallet } from "../contexts/WalletContext";
import {
  createTokenDraft,
  generateAiTokenomicsDraft,
  publishToken,
  setManualTokenomics,
} from "../services/tokenService";
import type { DistributionSlice, TrustFunToken } from "../types/token";
import styles from "./LaunchPage.module.css";

const STEPS = ["Basics", "Tokenomics", "Review", "Publish"];

type TokenomicsMode = "choose" | "manual" | "ai";

export default function LaunchPage() {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [token, setToken] = useState<TrustFunToken | null>(null);

  // Step 0 — basics
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [totalSupply, setTotalSupply] = useState("1000000000");
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [basicsError, setBasicsError] = useState<string | null>(null);

  // Shared network/server error surface for steps 1-2 (AI generation,
  // manual save, publish) — the mock backend never failed, so this states
  // didn't exist before; a real network call can.
  const [actionError, setActionError] = useState<string | null>(null);

  // Step 1 — tokenomics
  const [mode, setMode] = useState<TokenomicsMode>("choose");
  const [distribution, setDistribution] = useState<DistributionSlice[]>([
    { label: "Public sale", percent: 60 },
    { label: "Liquidity", percent: 20 },
    { label: "Team", percent: 20 },
  ]);
  const [vesting, setVesting] = useState("");
  const [summary, setSummary] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [savingManual, setSavingManual] = useState(false);

  // Step 3 — publish
  const [publishing, setPublishing] = useState(false);

  const distributionTotal = distribution.reduce((sum, d) => sum + (Number(d.percent) || 0), 0);

  if (!wallet.connected) {
    return (
      <PageLayout>
        <div className="container">
          <div className={styles.wrap}>
            <h1>Launch a token</h1>
            <Alert tone="info" title="Connect a wallet to continue">
              Creating a token requires a connected Solana wallet so the launch can be attributed
              to a creator address. Use the &quot;Connect Wallet&quot; button in the top navigation.
            </Alert>
          </div>
        </div>
      </PageLayout>
    );
  }

  async function handleCreateDraft() {
    setBasicsError(null);
    if (!name.trim() || !symbol.trim() || !description.trim() || !displayName.trim()) {
      setBasicsError("Fill in every field before continuing.");
      return;
    }
    const supplyNum = Number(totalSupply);
    if (!Number.isFinite(supplyNum) || supplyNum <= 0) {
      setBasicsError("Total supply must be a positive number.");
      return;
    }

    setCreatingDraft(true);
    try {
      const draft = await createTokenDraft({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim(),
        totalSupply: supplyNum,
        creator: {
          displayName: displayName.trim(),
          walletAddress: wallet.address ?? "unknown",
          isAnonymous,
        },
      });
      setToken(draft);
      setStep(1);
    } catch (err) {
      setBasicsError(err instanceof Error ? err.message : "Failed to create draft. Try again.");
    } finally {
      setCreatingDraft(false);
    }
  }

  async function handleGenerateAi() {
    if (!token) return;
    setActionError(null);
    setGeneratingAi(true);
    try {
      const updated = await generateAiTokenomicsDraft(token.id);
      setToken(updated);
      setDistribution(updated.tokenomics.distribution);
      setVesting(updated.tokenomics.vestingDescription ?? "");
      setSummary(updated.tokenomics.summary);
      setMode("ai");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to generate a draft. Try again.");
    } finally {
      setGeneratingAi(false);
    }
  }

  function updateDistRow(index: number, field: "label" | "percent", value: string) {
    setDistribution((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: field === "percent" ? Number(value) || 0 : value }
          : row
      )
    );
  }

  function addDistRow() {
    setDistribution((prev) => [...prev, { label: "", percent: 0 }]);
  }

  function removeDistRow(index: number) {
    setDistribution((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveManualTokenomics() {
    if (!token) return;
    setActionError(null);
    setSavingManual(true);
    try {
      const updated = await setManualTokenomics(token.id, {
        distribution,
        vestingDescription: vesting.trim() || null,
        summary: summary.trim(),
      });
      setToken(updated);
      setStep(2);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save tokenomics. Try again.");
    } finally {
      setSavingManual(false);
    }
  }

  function handleContinueFromAiDraft() {
    setStep(2);
  }

  async function handlePublish() {
    if (!token) return;
    setActionError(null);
    setPublishing(true);
    try {
      const updated = await publishToken(token.id);
      setToken(updated);
      setStep(3);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to publish. Try again.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <PageLayout>
      <div className="container">
        <div className={styles.wrap}>
          <h1>Launch a token</h1>
          <StepIndicator steps={STEPS} currentIndex={step} />

          {step === 0 && (
            <Card>
              <h2 style={{ fontSize: "var(--fs-lg)" }}>Basics</h2>
              {basicsError && (
                <div style={{ marginBottom: "var(--sp-4)" }}>
                  <Alert tone="danger">{basicsError}</Alert>
                </div>
              )}
              <div className={styles.row2}>
                <TextField
                  label="Token name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Solana Puppy"
                  maxLength={40}
                />
                <TextField
                  label="Symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="SPUP"
                  maxLength={10}
                />
              </div>
              <TextAreaField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this token for, and who is it for?"
                rows={3}
                maxLength={400}
              />
              <div className={styles.row2}>
                <TextField
                  label="Total supply"
                  type="number"
                  min={1}
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                />
                <TextField
                  label="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How backers will see you"
                  hint="This is disclosed publicly regardless of the anonymous setting below."
                />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", fontSize: "var(--fs-sm)", marginBottom: "var(--sp-4)" }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Publish without linking my real identity (wallet address stays visible)
              </label>

              <div className={styles.actions}>
                <span />
                <Button onClick={handleCreateDraft} disabled={creatingDraft}>
                  {creatingDraft ? "Creating draft…" : "Continue"}
                </Button>
              </div>
            </Card>
          )}

          {step === 1 && token && (
            <Card>
              <h2 style={{ fontSize: "var(--fs-lg)" }}>Tokenomics</h2>
              {actionError && (
                <div style={{ marginBottom: "var(--sp-4)" }}>
                  <Alert tone="danger">{actionError}</Alert>
                </div>
              )}

              {mode === "choose" && (
                <>
                  <p>Choose how to draft your tokenomics.</p>
                  <div className={styles.choiceGrid}>
                    <button type="button" className={styles.choiceCard} onClick={() => setMode("manual")}>
                      <strong>Write it myself</strong>
                      <p style={{ fontSize: "var(--fs-sm)", marginTop: "var(--sp-2)", marginBottom: 0 }}>
                        Ships immediately as creator-authored. You&apos;re responsible for its accuracy.
                      </p>
                    </button>
                    <button type="button" className={styles.choiceCard} onClick={handleGenerateAi} disabled={generatingAi}>
                      <strong>{generatingAi ? "Generating…" : "Generate with AI"}</strong>
                      <p style={{ fontSize: "var(--fs-sm)", marginTop: "var(--sp-2)", marginBottom: 0 }}>
                        Drafts a starting point, but it cannot appear as reviewed on your public
                        disclosure card until compliance approves it (Blueprint 5.3).
                      </p>
                    </button>
                  </div>
                </>
              )}

              {mode === "ai" && (
                <>
                  <div style={{ marginBottom: "var(--sp-4)" }}>
                    <Alert tone="caution" title="Pending compliance review">
                      This draft was AI-generated. It will publish to your disclosure card labeled
                      &quot;pending review&quot; until the AI Risk Engine and a human compliance
                      reviewer sign off. You may still edit it below.
                    </Alert>
                  </div>
                  <TextAreaField
                    label="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                  />
                  <p className={styles.totalTag} style={{ color: distributionTotal === 100 ? "var(--success-500)" : "var(--danger-500)" }}>
                    Distribution totals {distributionTotal}% {distributionTotal !== 100 && "— must equal 100%"}
                  </p>
                  {distribution.map((row, i) => (
                    <div className={styles.distRow} key={i}>
                      <TextField
                        label="Allocation"
                        hideLabel={i !== 0}
                        value={row.label}
                        onChange={(e) => updateDistRow(i, "label", e.target.value)}
                      />
                      <TextField
                        label="Percent"
                        hideLabel={i !== 0}
                        type="number"
                        value={String(row.percent)}
                        onChange={(e) => updateDistRow(i, "percent", e.target.value)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeDistRow(i)} aria-label="Remove row">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={addDistRow}>
                    + Add allocation
                  </Button>
                  <TextAreaField
                    label="Vesting"
                    value={vesting}
                    onChange={(e) => setVesting(e.target.value)}
                    rows={2}
                    hint="Describe cliff and vesting terms for team/insider allocations."
                  />
                  <div className={styles.actions}>
                    <Button variant="secondary" onClick={() => setMode("choose")}>
                      Back
                    </Button>
                    <Button onClick={handleContinueFromAiDraft} disabled={distributionTotal !== 100}>
                      Continue with pending draft
                    </Button>
                  </div>
                </>
              )}

              {mode === "manual" && (
                <>
                  <TextAreaField
                    label="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                    placeholder="Plain-language summary of your token allocation."
                  />
                  <p className={styles.totalTag} style={{ color: distributionTotal === 100 ? "var(--success-500)" : "var(--danger-500)" }}>
                    Distribution totals {distributionTotal}% {distributionTotal !== 100 && "— must equal 100%"}
                  </p>
                  {distribution.map((row, i) => (
                    <div className={styles.distRow} key={i}>
                      <TextField
                        label="Allocation"
                        hideLabel={i !== 0}
                        value={row.label}
                        onChange={(e) => updateDistRow(i, "label", e.target.value)}
                      />
                      <TextField
                        label="Percent"
                        hideLabel={i !== 0}
                        type="number"
                        value={String(row.percent)}
                        onChange={(e) => updateDistRow(i, "percent", e.target.value)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeDistRow(i)} aria-label="Remove row">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={addDistRow}>
                    + Add allocation
                  </Button>
                  <TextAreaField
                    label="Vesting"
                    value={vesting}
                    onChange={(e) => setVesting(e.target.value)}
                    rows={2}
                    hint="Describe cliff and vesting terms for team/insider allocations, if any."
                  />
                  <div className={styles.actions}>
                    <Button variant="secondary" onClick={() => setMode("choose")}>
                      Back
                    </Button>
                    <Button
                      onClick={handleSaveManualTokenomics}
                      disabled={distributionTotal !== 100 || summary.trim().length === 0 || savingManual}
                    >
                      {savingManual ? "Saving…" : "Continue"}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )}

          {step === 2 && token && (
            <div>
              {actionError && (
                <div style={{ marginBottom: "var(--sp-4)" }}>
                  <Alert tone="danger">{actionError}</Alert>
                </div>
              )}
              <DisclosureCard token={token} />
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handlePublish} disabled={publishing}>
                  {publishing ? "Publishing…" : "Publish token"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && token && (
            <Card style={{ textAlign: "center" }}>
              <h2>Your token is live</h2>
              <p>
                {token.name} (${token.symbol}) has been published. Its disclosure card is now
                visible on Explore.
              </p>
              {token.tokenomics.complianceStatus === "pending_review" && (
                <div style={{ marginBottom: "var(--sp-4)", textAlign: "left" }}>
                  <Alert tone="caution" title="Tokenomics still pending compliance review">
                    Backers will see your token, but its tokenomics section is labeled
                    &quot;pending review&quot; until compliance clears the AI-generated draft.
                  </Alert>
                </div>
              )}
              <div style={{ display: "flex", gap: "var(--sp-3)", justifyContent: "center" }}>
                <Button onClick={() => navigate(`/token/${token.id}`)}>View token page</Button>
                <Link to="/explore">
                  <Button variant="secondary">Back to Explore</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
