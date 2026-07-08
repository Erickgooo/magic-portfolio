"use client";

import React, { useState, useEffect, useRef } from "react";
import { Flex, Column, Row, Text, Heading, IconButton, Icon, Button } from "@once-ui-system/core";
import {
  faqData,
  FAQItem,
  initialGreeting,
  backButtonLabel,
  chatbotTitle,
} from "@/resources/faqChatbot";
import styles from "./FaqChatbot.module.scss";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export const FaqChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top of messages container when active question changes or panel opens
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [activeQuestionId, isOpen]);

  // Click outside to close chatbot panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleQuestionSelect = (id: string) => {
    setActiveQuestionId(id);
  };

  const handleReset = () => {
    setActiveQuestionId(null);
  };

  // Helper to parse simple markdown formatting (bold and links)
  const parseAnswerText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const lineParts = [];
      let idx = 0;
      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
      let match;

      while ((match = regex.exec(line)) !== null) {
        const matchText = match[0];
        const matchIdx = match.index;

        if (matchIdx > idx) {
          lineParts.push(line.substring(idx, matchIdx));
        }

        if (matchText.startsWith("**") && matchText.endsWith("**")) {
          lineParts.push(<strong key={matchIdx}>{matchText.slice(2, -2)}</strong>);
        } else if (matchText.startsWith("[") && matchText.includes("](")) {
          const label = matchText.substring(1, matchText.indexOf("]("));
          const url = matchText.substring(matchText.indexOf("](") + 2, matchText.length - 1);
          lineParts.push(
            <a
              key={matchIdx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "var(--brand-solid)" }}
            >
              {label}
            </a>,
          );
        }
        idx = regex.lastIndex;
      }

      if (idx < line.length) {
        lineParts.push(line.substring(idx));
      }

      return (
        <span
          key={lIdx}
          style={{ display: "block", minHeight: line.trim() === "" ? "8px" : "unset" }}
        >
          {lineParts}
        </span>
      );
    });
  };

  return (
    <div ref={wrapperRef} className={styles.chatbotWrapper}>
      {/* Chatbot Panel */}
      {isOpen && (
        <Column
          ref={containerRef}
          className={styles.chatbotContainer}
          padding="16"
          radius="l"
          gap="16"
        >
          {/* Header */}
          <Row fillWidth vertical="center" horizontal="between" className={styles.header}>
            <Row gap="8" vertical="center">
              <Icon name="message" size="s" onBackground="neutral-weak" />
              <Heading as="h4" variant="heading-strong-s">
                {chatbotTitle}
              </Heading>
            </Row>
            <IconButton
              icon="x"
              variant="tertiary"
              size="s"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
            />
          </Row>

          {/* Content Area */}
          <div ref={messagesContainerRef} className={styles.messagesContainer}>
            {activeQuestionId === null ? (
              <Column gap="12" fillWidth>
                {/* Greeting Bubble */}
                <Flex fillWidth horizontal="start">
                  <Flex
                    paddingY="s"
                    paddingX="m"
                    radius="m"
                    style={{
                      background: "var(--neutral-alpha-weak)",
                      maxWidth: "85%",
                      borderBottomLeftRadius: "var(--radius-xs)",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Text variant="body-default-m" onBackground="neutral-strong">
                      {initialGreeting}
                    </Text>
                  </Flex>
                </Flex>

                {/* Initial Suggested Questions List */}
                <Column fillWidth gap="8" className={styles.questionsList}>
                  {faqData.map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      className={styles.questionButton}
                      onClick={() => handleQuestionSelect(faq.id)}
                    >
                      {faq.question}
                    </button>
                  ))}
                </Column>
              </Column>
            ) : (
              (() => {
                const activeFAQ = faqData.find((item) => item.id === activeQuestionId);
                if (!activeFAQ) return null;

                const relatedQuestions = activeFAQ.relatedIds
                  .map((rId) => faqData.find((item) => item.id === rId))
                  .filter((item): item is FAQItem => !!item);

                return (
                  <Column gap="12" fillWidth>
                    {/* User Question Bubble */}
                    <Flex fillWidth horizontal="end">
                      <Flex
                        paddingY="s"
                        paddingX="m"
                        radius="m"
                        style={{
                          background: "var(--brand-solid)",
                          maxWidth: "85%",
                          borderBottomRightRadius: "var(--radius-xs)",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        <Text variant="body-default-m" onBackground="brand-strong">
                          {activeFAQ.question}
                        </Text>
                      </Flex>
                    </Flex>

                    {/* Bot Answer Bubble */}
                    <Flex fillWidth horizontal="start">
                      <Flex
                        paddingY="s"
                        paddingX="m"
                        radius="m"
                        style={{
                          background: "var(--neutral-alpha-weak)",
                          maxWidth: "85%",
                          borderBottomLeftRadius: "var(--radius-xs)",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        <Text variant="body-default-m" onBackground="neutral-strong">
                          {parseAnswerText(activeFAQ.answer)}
                        </Text>
                      </Flex>
                    </Flex>

                    {/* Related Questions List */}
                    {relatedQuestions.length > 0 && (
                      <Column
                        fillWidth
                        gap="8"
                        className={styles.questionsList}
                        style={{ marginTop: "8px" }}
                      >
                        {relatedQuestions.map((faq) => (
                          <button
                            key={faq.id}
                            type="button"
                            className={styles.questionButton}
                            onClick={() => handleQuestionSelect(faq.id)}
                          >
                            {faq.question}
                          </button>
                        ))}
                      </Column>
                    )}

                    {/* Back Button */}
                    <Button
                      variant="tertiary"
                      size="s"
                      className={styles.backButton}
                      onClick={handleReset}
                    >
                      {backButtonLabel}
                    </Button>
                  </Column>
                );
              })()
            )}
          </div>
        </Column>
      )}

      {/* Floating Toggle Button */}
      <div ref={triggerRef} className={styles.floatingButton}>
        <IconButton
          icon={isOpen ? "x" : "message"}
          variant="secondary"
          size="l"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Erick Chatbot"
        />
      </div>
    </div>
  );
};
