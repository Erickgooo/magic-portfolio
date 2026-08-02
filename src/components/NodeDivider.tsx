import { Line, Row } from "@once-ui-system/core";

interface NodeDividerProps {
  maxWidth?: number;
}

// Line with a Cobalto node marker at its midpoint — the divider treatment
// used on the homepage, extracted so detail pages (work/blog) match it.
export function NodeDivider({ maxWidth = 48 }: NodeDividerProps) {
  return (
    <Row fitWidth position="relative">
      <Line maxWidth={maxWidth} />
      <Row
        position="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "5px",
          height: "5px",
          background: "#2D5BFF",
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      />
    </Row>
  );
}
