import styles from "./BlueprintFrame.module.scss";
import { BlueprintLine } from "./BlueprintLine";

interface BlueprintFrameProps {
  trigger?: "view" | "load";
  className?: string;
}

/**
 * Blueprint frame: each edge draws from a corner, clockwise, plus four 90° crop
 * marks. Absolutely positioned at inset 0 — the parent must be position:relative
 * and provide its own padding, so nothing overflows the viewport gutter.
 */
export function BlueprintFrame({ trigger = "load", className }: BlueprintFrameProps) {
  return (
    <span aria-hidden="true" className={`${styles.frame} ${className ?? ""}`}>
      <BlueprintLine trigger={trigger} orientation="h" origin="start" className={styles.top} />
      <BlueprintLine trigger={trigger} orientation="v" origin="start" className={styles.right} />
      <BlueprintLine trigger={trigger} orientation="h" origin="end" className={styles.bottom} />
      <BlueprintLine trigger={trigger} orientation="v" origin="end" className={styles.left} />
      <span className={`${styles.mark} ${styles.tl}`} />
      <span className={`${styles.mark} ${styles.tr}`} />
      <span className={`${styles.mark} ${styles.bl}`} />
      <span className={`${styles.mark} ${styles.br}`} />
    </span>
  );
}
