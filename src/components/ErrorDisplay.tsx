interface Props {
  error: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="text-4xl">!</div>
      <p className="text-lg font-medium" style={{ color: "var(--color-text)" }}>
        Something went wrong
      </p>
      <p style={{ color: "var(--color-text-muted)" }}>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Try Again
        </button>
      )}
    </div>
  );
}
