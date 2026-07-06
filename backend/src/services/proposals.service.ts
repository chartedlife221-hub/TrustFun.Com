import type { DiscussionPost, GovernanceProposal } from "@trustfun/shared/types";
import { prisma } from "../database/prisma";
import { toDiscussionPost, toProposal } from "../database/mappers";
import { HttpError } from "../utils/httpError";

const MAX_AUTHOR_LENGTH = 80;
const MAX_BODY_LENGTH = 2000;

export async function listProposals(tokenId: string): Promise<GovernanceProposal[]> {
  const rows = await prisma.governanceProposal.findMany({
    where: { tokenId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProposal);
}

export async function voteOnProposal(
  proposalId: string,
  direction: "for" | "against"
): Promise<GovernanceProposal> {
  if (direction !== "for" && direction !== "against") {
    throw new HttpError(400, 'direction must be "for" or "against"');
  }

  const proposal = await prisma.governanceProposal.findUnique({ where: { id: proposalId } });
  if (!proposal) throw new HttpError(404, `Proposal ${proposalId} not found`);
  if (proposal.status !== "open") {
    throw new HttpError(400, "This proposal is closed and no longer accepting votes");
  }

  const row = await prisma.governanceProposal.update({
    where: { id: proposalId },
    data: direction === "for" ? { votesFor: { increment: 1 } } : { votesAgainst: { increment: 1 } },
  });

  return toProposal(row);
}

export async function listDiscussion(tokenId: string): Promise<DiscussionPost[]> {
  const rows = await prisma.discussionPost.findMany({
    where: { tokenId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toDiscussionPost);
}

export async function postDiscussion(
  tokenId: string,
  author: string,
  body: string
): Promise<DiscussionPost> {
  const trimmedAuthor = author?.trim();
  const trimmedBody = body?.trim();

  if (!trimmedAuthor || !trimmedBody) {
    throw new HttpError(400, "author and body are required");
  }
  if (trimmedAuthor.length > MAX_AUTHOR_LENGTH) {
    throw new HttpError(400, `author must be ${MAX_AUTHOR_LENGTH} characters or fewer`);
  }
  if (trimmedBody.length > MAX_BODY_LENGTH) {
    throw new HttpError(400, `body must be ${MAX_BODY_LENGTH} characters or fewer`);
  }

  const tokenExists = await prisma.token.findUnique({ where: { id: tokenId }, select: { id: true } });
  if (!tokenExists) throw new HttpError(404, `Token ${tokenId} not found`);

  const row = await prisma.discussionPost.create({
    data: { tokenId, author: trimmedAuthor, body: trimmedBody },
  });

  return toDiscussionPost(row);
}
