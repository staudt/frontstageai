import { useState } from "react";
import type { ClientConfig } from "../types/config";

interface Props {
  config: ClientConfig["input"];
  onSubmit: (text: string) => void;
}

export default function TextInput({ config, onSubmit }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 w-full"
    >
      <h2 className="text-xl font-semibold">{config.label}</h2>
      {config.instructions && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {config.instructions}
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={config.placeholder ?? "Enter your text..."}
        rows={6}
        className="w-full max-w-md p-4 rounded-xl resize-none focus:outline-none"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="btn-primary"
      >
        Submit
      </button>
    </form>
  );
}
