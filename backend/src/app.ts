import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { routes } from "./routes";

export function createApp() {
  const app = express();

  // Scoped to a specific origin (never "*") since the frontend's
  // VITE_API_URL mode calls this server cross-origin from localhost:3000.
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
  app.use(express.json());

  app.use(routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
