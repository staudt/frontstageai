import Anthropic from "@anthropic-ai/sdk";
import { BaseProvider } from "./base.js";
import type { AIRequest, AIResponse } from "./types.js";

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

export class AnthropicProvider extends BaseProvider {
  readonly name = "anthropic";
  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async run(request: AIRequest): Promise<AIResponse> {
    const content: Anthropic.Messages.ContentBlockParam[] = [];

    if (request.image) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: request.image.mimeType as ImageMediaType,
          data: request.image.base64,
        },
      });
    }

    content.push({ type: "text", text: request.prompt });

    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens,
      system: request.systemPrompt,
      messages: [{ role: "user", content }],
    });

    const raw = response.content
      .filter(
        (block): block is Anthropic.Messages.TextBlock => block.type === "text"
      )
      .map((block) => block.text)
      .join("\n");

    return { raw, parsed: null };
  }
}
