import styles from "./ReadingProgress.module.scss";

/** Reading progress: a 1px Cobalto stroke with the node riding its tip. Pure CSS (scroll(root)). */
export function ReadingProgress() {
  return (
    <span aria-hidden="true" className={styles.bar} data-reading-progress="">
      <span className={styles.fill} />
      <span className={styles.node} />
    </span>
  );
}
