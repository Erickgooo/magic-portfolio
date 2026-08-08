import type { ReactNode } from "react";

// Data Callout, Manual §4.3: exact figures are set in the mono family and the
// Cobalto accent so "the number" reads as a different register from "the
// narrative" around it. Lives in resources (like EMIcon) so content.tsx can
// import it directly without going through the components barrel, which would
// close an import cycle back onto this file.
export const Metric = ({ children }: { children: ReactNode }) => (
  <span className="metric">{children}</span>
);
