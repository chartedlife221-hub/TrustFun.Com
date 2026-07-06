import type { Request, Response } from "express";
import * as tokensService from "../services/tokens.service";
import { HttpError } from "../utils/httpError";

export async function listTokens(_req: Request, res: Response) {
  res.json(await tokensService.listTokens());
}

export async function getToken(req: Request, res: Response) {
  const token = await tokensService.getToken(req.params.id);
  if (!token) throw new HttpError(404, `Token ${req.params.id} not found`);
  res.json(token);
}

export async function createTokenDraft(req: Request, res: Response) {
  const token = await tokensService.createTokenDraft(req.body);
  res.status(201).json(token);
}

export async function setManualTokenomics(req: Request, res: Response) {
  const token = await tokensService.setManualTokenomics(req.params.id, req.body);
  res.json(token);
}

export async function generateAiTokenomicsDraft(req: Request, res: Response) {
  const token = await tokensService.generateAiTokenomicsDraft(req.params.id);
  res.json(token);
}

export async function publishToken(req: Request, res: Response) {
  const token = await tokensService.publishToken(req.params.id);
  res.json(token);
}
