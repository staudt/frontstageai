import type { AIProvider } from "./types.js";
import { OpenAIProvider } from "./openai.js";
import { AnthropicProvider } from "./anthropic.js";
import { GoogleProvider } from "./google.js";

const providers: Record<string, () => AIProvider> = {
  openai: () => new OpenAIProvider(),
  anthropic: () => new AnthropicProvider(),
  google: () => new GoogleProvider(),
};

export function getProvider(name: string): AIProvider {
  const factory = providers[name];
  if (!factory) {
    throw new Error(
      `Unknown AI provider "${name}". Supported: ${Object.keys(providers).join(", ")}`
    );
  }
  return factory();
}
