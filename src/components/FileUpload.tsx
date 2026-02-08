import { useState, useRef } from "react";
import type { ClientConfig } from "../types/config";

interface Props {
  config: ClientConfig["input"];
  onUpload: (image: { base64: string; mimeType: string }) => void;
}

export default function FileUpload({ config, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!config.acceptedFormats.includes(file.type)) return;
    if (file.size > config.maxFileSize * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setPreview(dataUrl);
      onUpload({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-semibold">{config.label}</h2>
      {config.instructions && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {config.instructions}
        </p>
      )}

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="w-full max-w-md aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-border)"}`,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10" style={{ color: "var(--color-text-muted)" }}>
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            Drop an image or click to upload
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={config.acceptedFormats.join(",")}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <img
          src={preview}
          alt="Uploaded"
          className="w-full max-w-md rounded-2xl"
        />
      )}
    </div>
  );
}
