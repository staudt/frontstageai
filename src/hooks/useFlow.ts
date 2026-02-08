import { useState } from "react";

interface FlowInput {
  image?: { base64: string; mimeType: string };
  text?: string;
}

export interface FlowResult {
  raw: string;
  sections?: Record<string, string>;
  outputType: "sections" | "markdown" | "raw";
}

export function useFlow() {
  const [result, setResult] = useState<FlowResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runFlow = async (input: FlowInput): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        return false;
      }

      setResult(data.data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { runFlow, result, error, isLoading };
}
