import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as proposalsController from "../controllers/proposals.controller";

export const proposalsRouter = Router();

proposalsRouter.post("/:id/vote", asyncHandler(proposalsController.voteOnProposal));
