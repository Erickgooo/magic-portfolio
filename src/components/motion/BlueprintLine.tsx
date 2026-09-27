import styles from "./BlueprintLine.module.scss";

interface BlueprintLineProps {
  orientation?: "h" | "v";
  /** Which end the stroke grows from. */
  origin?: "start" | "end";
  /** "view": draws as it scrolls in. "load": draws on first paint (paused during the intro). */
  trigger?: "view" | "load";
  className?: string;
  style?: React.CSSProperties;
}

/** 1px Grafito guide line that draws itself with scaleX/scaleY. Out of flow (absolute). */
export function BlueprintLine({
  orientation = "h",
  origin = "start",
  trigger = "view",
  className,
  style,
}: BlueprintLineProps) {
  return (
    <span
      aria-hidden="true"
      data-mo-io={trigger === "view" ? "" : undefined}
      className={[styles.line, styles[orientation], styles[origin], styles[trigger], className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    />
  );
}
