import type { Request, Response } from "express";
import * as proposalsService from "../services/proposals.service";

export async function listProposals(req: Request, res: Response) {
  res.json(await proposalsService.listProposals(req.params.id));
}

export async function voteOnProposal(req: Request, res: Response) {
  res.json(await proposalsService.voteOnProposal(req.params.id, req.body?.direction));
}

export async function listDiscussion(req: Request, res: Response) {
  res.json(await proposalsService.listDiscussion(req.params.id));
}

export async function postDiscussion(req: Request, res: Response) {
  const post = await proposalsService.postDiscussion(
    req.params.id,
    req.body?.author,
    req.body?.body
  );
  res.status(201).json(post);
}
