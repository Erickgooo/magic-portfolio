import styles from "./Home.module.scss";

/**
 * The growth-node rail (≥1024px): a 1px line that draws with the page's view
 * timeline and a Cobalto node that rides it via position: sticky — no scroll
 * timeline needed, so it behaves the same in Firefox.
 */
export function HomeRail() {
  return (
    <span aria-hidden="true" className={styles.rail} data-home-rail="">
      <span className={styles.railLine} data-rail-line="" />
      <span className={styles.railNode} />
    </span>
  );
}
