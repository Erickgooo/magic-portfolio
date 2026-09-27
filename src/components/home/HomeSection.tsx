import { BlueprintLine } from "@/components/motion/BlueprintLine";
import { formatIndex } from "@/utils/projects";
import type { ReactNode } from "react";
import styles from "./Home.module.scss";

interface HomeSectionProps {
  index: number;
  total: number;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A Home section "wired" to the rail: its mono index, a 90° branch from the rail
 * (≥1024px) and a full-width guide line (<1024px). Lines are absolute (0 flow
 * height), so they never reduce the content width.
 */
export function HomeSection({ index, total, id, className, children }: HomeSectionProps) {
  return (
    <section id={id} className={`${styles.section} ${className ?? ""}`}>
      <BlueprintLine orientation="h" className={styles.branch} />
      <BlueprintLine orientation="h" className={styles.hline} />
      <span aria-hidden="true" className={styles.index}>
        {formatIndex(index, total)}
      </span>
      {children}
    </section>
  );
}
