import OpenAI from "openai";
import { BaseProvider } from "./base.js";
import type { AIRequest, AIResponse } from "./types.js";

export class OpenAIProvider extends BaseProvider {
  readonly name = "openai";
  private client: OpenAI;

  constructor() {
    super();
    // SDK v5 auto-reads OPENAI_API_KEY from process.env
    this.client = new OpenAI();
  }

  async run(request: AIRequest): Promise<AIResponse> {
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

    content.push({ type: "text", text: request.prompt });

    if (request.image) {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${request.image.mimeType};base64,${request.image.base64}`,
          detail: "high",
        },
      });
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }

    messages.push({ role: "user", content });

    const response = await this.client.chat.completions.create({
      model: request.model,
      messages,
      temperature: request.temperature,
      max_tokens: request.maxTokens,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    return { raw, parsed: null };
  }
}
