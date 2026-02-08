import { useEffect } from "react";
import type { ClientConfig } from "../types/config";

interface Props {
  config: ClientConfig["app"];
  children: React.ReactNode;
}

export default function Layout({ config, children }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute("data-template", config.template);

    const root = document.documentElement;
    const brand = config.brand;
    if (brand) {
      root.style.setProperty("--color-primary", brand.primaryColor);
      root.style.setProperty("--color-secondary", brand.secondaryColor);
      if (brand.backgroundColor)
        root.style.setProperty("--color-bg", brand.backgroundColor);
      if (brand.textColor)
        root.style.setProperty("--color-text", brand.textColor);
      if (brand.fontFamily)
        root.style.setProperty("--font-family", brand.fontFamily);
    }

    document.title = config.name;
  }, [config]);

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <header className="w-full max-w-2xl px-4 pt-8 pb-4 text-center">
        {config.brand?.logo && (
          <img
            src={config.brand.logo}
            alt={config.name}
            className="w-16 h-16 mx-auto mb-4 rounded-xl"
          />
        )}
        <h1 className="text-2xl font-bold">{config.name}</h1>
        {config.description && (
          <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
            {config.description}
          </p>
        )}
      </header>

      <main className="w-full max-w-2xl px-4 pb-8 flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
