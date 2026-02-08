import { GoogleGenAI } from "@google/genai";
import { BaseProvider } from "./base.js";
import type { AIRequest, AIResponse } from "./types.js";

export class GoogleProvider extends BaseProvider {
  readonly name = "google";
  private client: GoogleGenAI;

  constructor() {
    super();
    this.client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
  }

  async run(request: AIRequest): Promise<AIResponse> {
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    parts.push({ text: request.prompt });

    if (request.image) {
      parts.push({
        inlineData: {
          mimeType: request.image.mimeType,
          data: request.image.base64,
        },
      });
    }

    const response = await this.client.models.generateContent({
      model: request.model,
      contents: [{ role: "user", parts }],
      config: {
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens,
        systemInstruction: request.systemPrompt,
      },
    });

    const raw = response.text ?? "";
    return { raw, parsed: null };
  }
}
