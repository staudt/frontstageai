import type { ClientConfig } from "../types/config";
import CameraCapture from "./CameraCapture";
import FileUpload from "./FileUpload";
import TextInput from "./TextInput";

interface Props {
  config: ClientConfig["input"];
  onSubmit: (input: {
    image?: { base64: string; mimeType: string };
    text?: string;
  }) => void;
}

export default function InputCapture({ config, onSubmit }: Props) {
  const inputType = config.type;

  if (inputType === "camera") {
    return (
      <CameraCapture
        config={config}
        onCapture={(image) => onSubmit({ image })}
      />
    );
  }

  if (inputType === "upload") {
    return (
      <FileUpload
        config={config}
        onUpload={(image) => onSubmit({ image })}
      />
    );
  }

  if (inputType === "text") {
    return (
      <TextInput
        config={config}
        onSubmit={(text) => onSubmit({ text })}
      />
    );
  }

  // Combined types (camera+text, upload+text)
  if (inputType.startsWith("camera")) {
    return (
      <CameraCapture
        config={config}
        onCapture={(image) => onSubmit({ image })}
      />
    );
  }

  return (
    <FileUpload
      config={config}
      onUpload={(image) => onSubmit({ image })}
    />
  );
}
