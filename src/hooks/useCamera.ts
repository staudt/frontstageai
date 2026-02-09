import { useRef, useState, useCallback, useEffect } from "react";

interface UseCameraOptions {
  facingMode: "user" | "environment";
}

export function useCamera({ facingMode }: UseCameraOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setIsReady(true);
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsReady(false);
    }
  }, []);

  const capture = useCallback((aspectRatio = 3 / 4): {
    base64: string;
    mimeType: string;
  } | null => {
    if (!videoRef.current || !isReady) return null;

    const vw = videoRef.current.videoWidth;
    const vh = videoRef.current.videoHeight;

    // Crop to match the visible area (object-cover behavior)
    let sx = 0, sy = 0, sw = vw, sh = vh;
    const videoAspect = vw / vh;
    if (videoAspect > aspectRatio) {
      // Video is wider — crop sides
      sw = Math.round(vh * aspectRatio);
      sx = Math.round((vw - sw) / 2);
    } else {
      // Video is taller — crop top/bottom
      sh = Math.round(vw / aspectRatio);
      sy = Math.round((vh - sh) / 2);
    }

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, sx, sy, sw, sh, 0, 0, sw, sh);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];

    return { base64, mimeType: "image/jpeg" };
  }, [isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, startCamera, stopCamera, capture, isReady, error };
}
