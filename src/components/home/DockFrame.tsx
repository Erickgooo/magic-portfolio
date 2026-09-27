import styles from "./DockFrame.module.scss";

/** Video frame that "docks" (scale .92 → 1) as it enters while its crop marks retract. */
export function DockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dock} data-mo-io="" data-dock-frame="">
      {children}
      <span aria-hidden="true" className={`${styles.mark} ${styles.tl}`} />
      <span aria-hidden="true" className={`${styles.mark} ${styles.tr}`} />
      <span aria-hidden="true" className={`${styles.mark} ${styles.bl}`} />
      <span aria-hidden="true" className={`${styles.mark} ${styles.br}`} />
    </div>
  );
}
