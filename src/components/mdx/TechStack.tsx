import { Icon } from "@once-ui-system/core";
import { iconLibrary, type IconName } from "@/resources/icons";
import styles from "./TechStack.module.scss";

interface TechStackProps {
  /** Comma-separated tool names: "Next.js, WhatsApp Business API, Kommo CRM" */
  data: string;
}

// Matches a tool name to a registered icon by substring, longest key first so
// e.g. "google search console" matches before the shorter "google".
const TOOL_ICON_MAP: [string, IconName][] = [
  ["google search console", "googleSearchConsole"],
  ["google analytics", "googleAnalytics"],
  ["davinci resolve", "davinciresolve"],
  ["whatsapp business", "whatsapp"],
  ["typescript", "typescript"],
  ["next.js", "nextjs"],
  ["nextjs", "nextjs"],
  ["javascript", "javascript"],
  ["figma", "figma"],
  ["supabase", "supabase"],
  ["zapier", "zapier"],
  ["odoo", "odoo"],
  ["meta", "meta"],
  ["canva", "canva"],
  ["shopify", "shopify"],
  ["wordpress", "wordpress"],
  ["netlify", "netlify"],
  ["vercel", "vercel"],
  ["python", "python"],
  ["elevenlabs", "elevenlabs"],
  ["gemini", "gemini"],
  ["claude", "claude"],
  ["github", "github"],
  ["whatsapp", "whatsapp"],
];

function matchIcon(name: string): IconName | null {
  const key = name.toLowerCase();
  for (const [needle, icon] of TOOL_ICON_MAP) {
    if (key.includes(needle)) return icon;
  }
  return null;
}

export function TechStack({ data }: TechStackProps) {
  const items = data
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className={styles.root}>
      {items.map((item) => {
        const iconName = matchIcon(item);
        return (
          <span key={item} className={styles.chip}>
            {iconName && iconLibrary[iconName] ? (
              <Icon name={iconName} size="xs" className={styles.chipIcon} />
            ) : (
              <span className={styles.chipDot} aria-hidden="true" />
            )}
            {item}
          </span>
        );
      })}
    </div>
  );
}
