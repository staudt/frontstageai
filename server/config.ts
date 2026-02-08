import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { z } from "zod";

// --- Zod Schema ---

const BrandSchema = z.object({
  logo: z.string().optional(),
  primaryColor: z.string().default("#6366F1"),
  secondaryColor: z.string().default("#1E1B4B"),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
});

const InputSchema = z.object({
  type: z.enum(["camera", "upload", "text", "camera+text", "upload+text"]),
  label: z.string(),
  instructions: z.string().optional(),
  placeholder: z.string().optional(),
  cameraFacing: z.enum(["user", "environment"]).default("environment"),
  maxFileSize: z.number().default(10),
  acceptedFormats: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp"]),
});

const SectionSchema = z.object({
  key: z.string(),
  title: z.string(),
  icon: z.string().optional(),
});

const AIOutputSchema = z.object({
  type: z.enum(["sections", "markdown", "raw"]),
  sections: z.array(SectionSchema).optional(),
});

const AISchema = z.object({
  provider: z.enum(["openai", "anthropic", "google"]),
  model: z.string(),
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().default(2048),
  output: AIOutputSchema,
});

const OutputSchema = z.object({
  style: z.enum(["card", "fullwidth", "minimal"]).default("card"),
  shareEnabled: z.boolean().default(false),
});

const AppSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  template: z.string().default("default"),
  brand: BrandSchema.optional(),
});

export const FlowConfigSchema = z.object({
  app: AppSchema,
  input: InputSchema,
  ai: AISchema,
  output: OutputSchema.optional(),
});

export type FlowConfig = z.infer<typeof FlowConfigSchema>;

// --- Config Loader ---

let cachedConfig: FlowConfig | null = null;
let configMtime = 0;

export function loadConfig(): FlowConfig {
  const configPath = path.resolve(process.cwd(), "flow.yaml");
  const stats = fs.statSync(configPath);

  if (cachedConfig && stats.mtimeMs === configMtime) {
    return cachedConfig;
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const parsed = yaml.load(raw);
  const validated = FlowConfigSchema.parse(parsed);

  cachedConfig = validated;
  configMtime = stats.mtimeMs;

  return validated;
}

// --- Client Config (sanitized, no AI secrets) ---

export interface ClientConfig {
  app: {
    name: string;
    description?: string;
    template: string;
    brand?: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
      backgroundColor?: string;
      textColor?: string;
      fontFamily?: string;
    };
  };
  input: {
    type: "camera" | "upload" | "text" | "camera+text" | "upload+text";
    label: string;
    instructions?: string;
    placeholder?: string;
    cameraFacing: "user" | "environment";
    maxFileSize: number;
    acceptedFormats: string[];
  };
  output: {
    style: "card" | "fullwidth" | "minimal";
    shareEnabled: boolean;
    sections?: Array<{ key: string; title: string; icon?: string }>;
  };
}

export function toClientConfig(config: FlowConfig): ClientConfig {
  return {
    app: config.app,
    input: config.input,
    output: {
      style: config.output?.style ?? "card",
      shareEnabled: config.output?.shareEnabled ?? false,
      sections:
        config.ai.output.type === "sections"
          ? config.ai.output.sections
          : undefined,
    },
  };
}
