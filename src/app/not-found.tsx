import { Column, Row, Heading, Text, Button } from "@once-ui-system/core";
import { EMIcon } from "@/resources/EMIcon";

export default function NotFound() {
  return (
    <Column as="section" fill center gap="16" paddingBottom="160">
      <Row style={{ fontSize: "40px", color: "var(--brand-on-background-strong)" }}>
        <EMIcon />
      </Row>
      <Text
        onBackground="brand-strong"
        style={{ fontFamily: "var(--font-code)", fontWeight: 700 }}
        variant="heading-strong-l"
      >
        404
      </Text>
      <Heading marginBottom="s" variant="display-default-xs" wrap="balance" align="center">
        This page hasn't been built yet.
      </Heading>
      <Text onBackground="neutral-weak" align="center">
        Everything else here was designed and shipped from zero — this URL just wasn't one of
        them.
      </Text>
      <Row paddingTop="16">
        <Button href="/" variant="secondary" size="m" arrowIcon>
          Back to the homepage
        </Button>
      </Row>
    </Column>
  );
}
