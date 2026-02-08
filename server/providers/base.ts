import type { AIProvider, AIRequest, AIResponse } from "./types.js";

export abstract class BaseProvider implements AIProvider {
  abstract readonly name: string;
  abstract run(request: AIRequest): Promise<AIResponse>;

  protected buildPromptWithOutputInstructions(
    prompt: string,
    sectionKeys: string[]
  ): string {
    const keysExample = sectionKeys
      .map((k) => `"${k}": "Your content for ${k}"`)
      .join(",\n  ");

    return `${prompt}

IMPORTANT: You MUST respond with ONLY a valid JSON object with the following keys, no other text:
{
  ${keysExample}
}

Each value should be a detailed string (2-4 sentences). Do not include any text outside the JSON.`;
  }

  protected parseSections(
    raw: string,
    sectionKeys: string[]
  ): Record<string, string> | null {
    // Try JSON parse directly
    try {
      const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === "object" && parsed !== null) {
        const hasAllKeys = sectionKeys.every((k) => k in parsed);
        if (hasAllKeys) return parsed as Record<string, string>;
      }
    } catch {
      // Fall through to regex
    }

    // Regex fallback
    const result: Record<string, string> = {};
    for (const key of sectionKeys) {
      const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\\\"[^"]*)*)"`, "s");
      const match = raw.match(regex);
      if (match) {
        result[key] = match[1].replace(/\\"/g, '"');
      }
    }
    return Object.keys(result).length === sectionKeys.length ? result : null;
  }
}
