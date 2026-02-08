import { Router } from "express";
import { loadConfig, toClientConfig } from "../config.js";

export const configRouter = Router();

configRouter.get("/config", (_req, res, next) => {
  try {
    const config = loadConfig();
    const clientConfig = toClientConfig(config);
    res.json(clientConfig);
  } catch (err) {
    next(err);
  }
});
