import { Router } from "express";
import { loadConfig } from "../config.js";
import { getProvider } from "../providers/index.js";
import { BaseProvider } from "../providers/base.js";
import type { AIRequest } from "../providers/types.js";

export const aiRouter = Router();

// Helper to use BaseProvider's static-like methods
class PromptHelper extends BaseProvider {
  readonly name = "helper";
  async run(): Promise<never> {
    throw new Error("Not a real provider");
  }

  buildPrompt(prompt: string, sectionKeys: string[]) {
    return this.buildPromptWithOutputInstructions(prompt, sectionKeys);
  }

  parse(raw: string, sectionKeys: string[]) {
    return this.parseSections(raw, sectionKeys);
  }
}

const helper = new PromptHelper();

aiRouter.post("/run", async (req, res, next) => {
  try {
    const config = loadConfig();
    const { image, text } = req.body;

    // Validate required input
    const inputType = config.input.type;
    if ((inputType === "camera" || inputType === "upload") && !image) {
      res.status(400).json({
        success: false,
        error: "Image input is required for this flow.",
      });
      return;
    }
    if (inputType === "text" && !text) {
      res.status(400).json({
        success: false,
        error: "Text input is required for this flow.",
      });
      return;
    }

    // Build the prompt
    let prompt = config.ai.prompt;
    if (text) {
      prompt = prompt.replace(/\{\{input\}\}/g, text);
    }

    // If sections output, append JSON format instructions
    const sectionKeys =
      config.ai.output.type === "sections" && config.ai.output.sections
        ? config.ai.output.sections.map((s) => s.key)
        : undefined;

    if (sectionKeys && sectionKeys.length > 0) {
      prompt = helper.buildPrompt(prompt, sectionKeys);
    }

    const provider = getProvider(config.ai.provider);

    const request: AIRequest = {
      prompt,
      systemPrompt: config.ai.systemPrompt,
      image: image
        ? { base64: image.base64, mimeType: image.mimeType }
        : undefined,
      text,
      temperature: config.ai.temperature,
      maxTokens: config.ai.maxTokens,
      model: config.ai.model,
    };

    const result = await provider.run(request);

    // Parse sections if needed
    let sections: Record<string, string> | null = null;
    if (sectionKeys) {
      sections = helper.parse(result.raw, sectionKeys);
    }

    res.json({
      success: true,
      data: {
        raw: result.raw,
        sections,
        outputType: config.ai.output.type,
      },
    });
  } catch (err) {
    next(err);
  }
});
