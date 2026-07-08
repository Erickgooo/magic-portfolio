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
  const [messages, setMessages] = useState<Message[]>([{ sender: "bot", text: initialGreeting }]);
  const [activeOptions, setActiveOptions] = useState<FAQItem[]>(faqData);
  const [showBackOption, setShowBackOption] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages log inside the container only
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

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

  const handleQuestionSelect = (faq: FAQItem) => {
    // Add user question message
    setMessages((prev) => [...prev, { sender: "user", text: faq.question }]);

    // Add bot answer message after a tiny delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: faq.answer }]);

      // Compute related options
      const related = faq.relatedIds
        .map((rId) => faqData.find((item) => item.id === rId))
        .filter((item): item is FAQItem => !!item);

      setActiveOptions(related);
      setShowBackOption(true);
    }, 300);
  };

  const handleReset = () => {
    setMessages((prev) => [...prev, { sender: "user", text: backButtonLabel }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: initialGreeting }]);
      setActiveOptions(faqData);
      setShowBackOption(false);
    }, 300);
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

          {/* Messages Log */}
          <div ref={messagesContainerRef} className={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <Flex key={index} fillWidth horizontal={msg.sender === "bot" ? "start" : "end"}>
                <Flex
                  paddingY="s"
                  paddingX="m"
                  radius="m"
                  style={{
                    background: msg.sender === "bot" ? "var(--neutral-alpha-weak)" : "var(--brand-solid)",
                    maxWidth: "85%",
                    borderBottomLeftRadius: msg.sender === "bot" ? "var(--radius-xs)" : undefined,
                    borderBottomRightRadius: msg.sender === "user" ? "var(--radius-xs)" : undefined,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  <Text
                    variant="body-default-m"
                    onBackground={msg.sender === "bot" ? "neutral-strong" : "brand-strong"}
                  >
                    {msg.sender === "bot" ? parseAnswerText(msg.text) : msg.text}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </div>

          {/* Suggested Interactive Option Buttons */}
          <Column fillWidth>
            <div className={styles.questionsList}>
              {activeOptions.map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  className={styles.questionButton}
                  onClick={() => handleQuestionSelect(faq)}
                >
                  {faq.question}
                </button>
              ))}
            </div>

            {showBackOption && (
              <Button
                variant="tertiary"
                size="s"
                className={styles.backButton}
                onClick={handleReset}
              >
                {backButtonLabel}
              </Button>
            )}
          </Column>
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
