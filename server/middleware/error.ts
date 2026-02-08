import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[Frontstage AI Error]", err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Invalid flow.yaml configuration",
      details: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
    });
    return;
  }

  if (err.message?.includes("API key")) {
    res.status(401).json({
      success: false,
      error: "Missing or invalid API key. Check your .env file.",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message,
  });
}
