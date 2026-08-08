"use client";

import { useState } from "react";
import { Button, Column, Heading, PasswordInput, Text } from "@once-ui-system/core";

/**
 * Password form for routes gated by middleware.ts. On success the page is
 * reloaded so the request passes through the middleware again, this time
 * carrying a valid signed cookie.
 */
const PasswordPrompt: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(undefined);

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      if (response.status === 429) {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setSubmitting(false);
  };

  return (
    <Column paddingY="128" maxWidth={24} gap="24" center>
      <Heading align="center" wrap="balance">
        This page is password protected
      </Heading>
      <Column fillWidth gap="8" horizontal="center">
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          errorMessage={error}
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Checking..." : "Submit"}
        </Button>
      </Column>
    </Column>
  );
};

export { PasswordPrompt };
