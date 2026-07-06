import { Router } from "express";
import { tokensRouter } from "./tokens.routes";
import { proposalsRouter } from "./proposals.routes";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ status: "ok" }));
routes.use("/tokens", tokensRouter);
routes.use("/proposals", proposalsRouter);
