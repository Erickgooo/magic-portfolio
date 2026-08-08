import { Column } from "@once-ui-system/core";
import { PasswordPrompt } from "@/components/PasswordPrompt";

export const metadata = {
  title: "Password required",
  robots: { index: false, follow: false },
};

/**
 * Target of the middleware rewrite for protected routes. The original URL is
 * preserved, so reloading after a successful login renders the real page.
 */
export default function Unauthorized() {
  return (
    <Column fillWidth horizontal="center">
      <PasswordPrompt />
    </Column>
  );
}
