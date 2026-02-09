import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { configRouter } from "./routes/config.js";
import { aiRouter } from "./routes/ai.js";
import { errorHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

// Parse JSON bodies up to 20MB (for base64 images)
app.use(express.json({ limit: "20mb" }));

// API routes
app.use("/api", configRouter);
app.use("/api", aiRouter);

// In production, serve the built frontend
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientPath = path.resolve(__dirname, "../dist");
  app.use(express.static(clientPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Frontstage AI running on http://localhost:${PORT}`);
});
