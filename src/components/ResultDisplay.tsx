import SectionResult from "./SectionResult";
import MarkdownResult from "./MarkdownResult";
import type { ClientConfig } from "../types/config";
import type { FlowResult } from "../hooks/useFlow";

interface Props {
  result: FlowResult;
  config: ClientConfig["output"];
  onReset: () => void;
}

export default function ResultDisplay({ result, config, onReset }: Props) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {result.outputType === "sections" &&
      result.sections &&
      config.sections ? (
        <SectionResult
          sections={result.sections}
          sectionConfig={config.sections}
        />
      ) : result.outputType === "markdown" ? (
        <MarkdownResult content={result.raw} />
      ) : (
        <div className="result-card p-6">
          <p className="whitespace-pre-wrap leading-relaxed">{result.raw}</p>
        </div>
      )}

      <div className="flex gap-4 justify-center mt-4">
        {config.shareEnabled && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.raw);
            }}
            className="btn-secondary"
          >
            Copy Result
          </button>
        )}
        <button onClick={onReset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
