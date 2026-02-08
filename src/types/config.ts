export interface ClientConfig {
  app: {
    name: string;
    description?: string;
    template: string;
    brand?: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
      backgroundColor?: string;
      textColor?: string;
      fontFamily?: string;
    };
  };
  input: {
    type: "camera" | "upload" | "text" | "camera+text" | "upload+text";
    label: string;
    instructions?: string;
    placeholder?: string;
    cameraFacing: "user" | "environment";
    maxFileSize: number;
    acceptedFormats: string[];
  };
  output: {
    style: "card" | "fullwidth" | "minimal";
    shareEnabled: boolean;
    sections?: Array<{
      key: string;
      title: string;
      icon?: string;
    }>;
  };
}
