interface Props {
  message?: string;
}

export default function Loading({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div
        className="w-16 h-16 rounded-full loading-pulse"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.7 }}
      />
      {message && (
        <p
          className="text-lg font-medium text-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
