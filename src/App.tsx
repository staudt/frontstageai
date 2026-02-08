import { useState } from "react";
import { useConfig } from "./hooks/useConfig";
import { useFlow } from "./hooks/useFlow";
import Layout from "./components/Layout";
import InputCapture from "./components/InputCapture";
import Loading from "./components/Loading";
import ResultDisplay from "./components/ResultDisplay";
import ErrorDisplay from "./components/ErrorDisplay";

type AppState = "input" | "loading" | "result" | "error";

export default function App() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { runFlow, result, error: flowError } = useFlow();
  const [appState, setAppState] = useState<AppState>("input");

  if (configLoading) return <Loading message="Loading..." />;
  if (configError || !config)
    return <ErrorDisplay error={configError ?? "Failed to load configuration"} />;

  const handleSubmit = async (input: {
    image?: { base64: string; mimeType: string };
    text?: string;
  }) => {
    setAppState("loading");
    const success = await runFlow(input);
    setAppState(success ? "result" : "error");
  };

  const handleReset = () => {
    setAppState("input");
  };

  return (
    <Layout config={config.app}>
      {appState === "input" && (
        <InputCapture config={config.input} onSubmit={handleSubmit} />
      )}
      {appState === "loading" && (
        <Loading message="Reading your palm..." />
      )}
      {appState === "result" && result && (
        <ResultDisplay
          result={result}
          config={config.output}
          onReset={handleReset}
        />
      )}
      {appState === "error" && (
        <ErrorDisplay
          error={flowError ?? "Something went wrong"}
          onRetry={handleReset}
        />
      )}
    </Layout>
  );
}
