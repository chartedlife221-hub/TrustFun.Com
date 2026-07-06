import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as tokensController from "../controllers/tokens.controller";
import * as proposalsController from "../controllers/proposals.controller";

export const tokensRouter = Router();

tokensRouter.get("/", asyncHandler(tokensController.listTokens));
tokensRouter.post("/", asyncHandler(tokensController.createTokenDraft));
tokensRouter.get("/:id", asyncHandler(tokensController.getToken));
tokensRouter.put("/:id/tokenomics/manual", asyncHandler(tokensController.setManualTokenomics));
tokensRouter.post("/:id/tokenomics/ai-draft", asyncHandler(tokensController.generateAiTokenomicsDraft));
tokensRouter.post("/:id/publish", asyncHandler(tokensController.publishToken));

tokensRouter.get("/:id/proposals", asyncHandler(proposalsController.listProposals));
tokensRouter.get("/:id/discussion", asyncHandler(proposalsController.listDiscussion));
tokensRouter.post("/:id/discussion", asyncHandler(proposalsController.postDiscussion));
