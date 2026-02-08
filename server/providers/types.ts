export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  image?: {
    base64: string;
    mimeType: string;
  };
  text?: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

export interface AIResponse {
  raw: string;
  parsed: Record<string, string> | null;
}

export interface AIProvider {
  readonly name: string;
  run(request: AIRequest): Promise<AIResponse>;
}
