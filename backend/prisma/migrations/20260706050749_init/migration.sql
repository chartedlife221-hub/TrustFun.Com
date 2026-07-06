-- CreateEnum
CREATE TYPE "LaunchStage" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "TokenomicsSource" AS ENUM ('creator_authored', 'ai_assisted');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('not_applicable', 'pending_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chain" TEXT NOT NULL DEFAULT 'solana',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    "stage" "LaunchStage" NOT NULL DEFAULT 'draft',
    "totalSupply" BIGINT NOT NULL,
    "disclosureComplete" BOOLEAN NOT NULL DEFAULT false,
    "liquidityLocked" BOOLEAN NOT NULL DEFAULT false,
    "liquidityLockedPercent" INTEGER,
    "liquidityUnlockDate" TIMESTAMP(3),
    "liquidityLockContractUrl" TEXT,
    "tokenomicsSource" "TokenomicsSource" NOT NULL DEFAULT 'creator_authored',
    "tokenomicsSummary" TEXT NOT NULL DEFAULT '',
    "tokenomicsDistribution" JSONB NOT NULL,
    "tokenomicsVestingDescription" TEXT,
    "tokenomicsComplianceStatus" "ComplianceStatus" NOT NULL DEFAULT 'not_applicable',
    "tokenomicsGeneratedAt" TIMESTAMP(3),
    "tokenomicsReviewedAt" TIMESTAMP(3),
    "riskScore" INTEGER NOT NULL DEFAULT 100,
    "riskFactors" JSONB NOT NULL,
    "riskComputedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "riskMethodologyVersion" TEXT NOT NULL DEFAULT 'baseline-rules-v0.1',

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceProposal" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'open',
    "votesFor" INTEGER NOT NULL DEFAULT 0,
    "votesAgainst" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovernanceProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionPost" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_walletAddress_key" ON "Creator"("walletAddress");

-- CreateIndex
CREATE INDEX "Token_stage_idx" ON "Token"("stage");

-- CreateIndex
CREATE INDEX "Token_tokenomicsComplianceStatus_idx" ON "Token"("tokenomicsComplianceStatus");

-- CreateIndex
CREATE INDEX "GovernanceProposal_tokenId_idx" ON "GovernanceProposal"("tokenId");

-- CreateIndex
CREATE INDEX "DiscussionPost_tokenId_createdAt_idx" ON "DiscussionPost"("tokenId", "createdAt");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernanceProposal" ADD CONSTRAINT "GovernanceProposal_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPost" ADD CONSTRAINT "DiscussionPost_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
