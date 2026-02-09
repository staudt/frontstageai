import { useEffect, useState } from "react";
import { useCamera } from "../hooks/useCamera";
import type { ClientConfig } from "../types/config";

interface Props {
  config: ClientConfig["input"];
  onCapture: (image: { base64: string; mimeType: string }) => void;
}

export default function CameraCapture({ config, onCapture }: Props) {
  const { videoRef, startCamera, stopCamera, capture, isReady, error } =
    useCamera({ facingMode: config.cameraFacing });
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const result = capture();
    if (result) {
      setPreview(`data:${result.mimeType};base64,${result.base64}`);
      setCapturedImage(result);
      stopCamera();
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setCapturedImage(null);
    startCamera();
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p style={{ color: "#EF4444" }}>{error}</p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Try uploading an image instead.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-semibold">{config.label}</h2>
      {config.instructions && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {config.instructions}
        </p>
      )}

      {!preview ? (
        <>
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleCapture}
            disabled={!isReady}
            className="btn-primary w-20 h-20 rounded-full text-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      ) : (
        <>
          <div className="w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden">
            <img
              src={preview}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            <button onClick={handleRetake} className="btn-secondary">
              Retake
            </button>
            <button onClick={handleConfirm} className="btn-primary">
              Use This Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
