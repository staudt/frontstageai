import { getIcon } from "../lib/icons";

interface Props {
  sections: Record<string, string>;
  sectionConfig: Array<{ key: string; title: string; icon?: string }>;
}

export default function SectionResult({ sections, sectionConfig }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {sectionConfig.map((sec) => {
        const content = sections[sec.key];
        if (!content) return null;

        const Icon = sec.icon ? getIcon(sec.icon) : null;

        return (
          <div key={sec.key} className="result-card p-6">
            <div className="flex items-center gap-3 mb-3">
              {Icon && (
                <Icon
                  className="w-6 h-6"
                  style={{ color: "var(--color-primary)" }}
                />
              )}
              <h3 className="text-lg font-semibold">{sec.title}</h3>
            </div>
            <p
              className="leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
