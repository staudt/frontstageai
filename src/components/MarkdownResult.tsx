import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default function MarkdownResult({ content }: Props) {
  return (
    <div className="result-card p-6 w-full">
      <div className="prose max-w-none" style={{ color: "var(--color-text)" }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
