"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Flex, Column, Row, Text, Heading, IconButton, Icon } from "@once-ui-system/core";
import { faqData, initialGreeting, chatbotTitle } from "@/resources/faqChatbot";
import styles from "./FaqChatbot.module.scss";

// ── Constants ────────────────────────────────────────────────────────────────

const SESSION_LIMIT = 8;
const MSG_MAX_CHARS = 300;
const LINKEDIN_URL = "https://www.linkedin.com/in/erick-mahecha/";
const EMAIL = "santiagomahecha2328@gmail.com";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActiveView {
  question: string;
  answer: string;
}

// ── Module-level sub-components (NEVER inside FaqChatbot body) ───────────────

interface SuggestedQuestionsProps {
  exclude?: string;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (question: string) => void;
  disabled: boolean;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  exclude,
  collapsed,
  onToggle,
  onSelect,
  disabled,
}) => {
  const questions = faqData.filter((faq) => faq.question !== exclude);

  return (
    <div className={styles.suggestedWrapper}>
      <button
        type="button"
        className={styles.suggestedToggle}
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <span>Suggested questions</span>
        <Icon name={collapsed ? "chevronDown" : "chevronUp"} size="xs" />
      </button>

      {!collapsed && (
        <Column fillWidth gap="8" className={styles.questionsList}>
          {questions.map((faq) => (
            <button
              key={faq.id}
              type="button"
              className={styles.questionButton}
              onClick={() => onSelect(faq.question)}
              disabled={disabled}
            >
              {faq.question}
            </button>
          ))}
        </Column>
      )}
    </div>
  );
};

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isLimited: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  isLimited,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className={styles.inputArea}>
      {isLimited ? (
        <Text variant="body-default-s" onBackground="neutral-weak" style={{ textAlign: "center" }}>
          You&apos;ve reached the message limit for this session —{" "}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "var(--brand-solid)" }}
          >
            reach out directly!
          </a>
        </Text>
      ) : (
        <Row gap="8" fillWidth vertical="center">
          <input
            className={styles.textInput}
            type="text"
            placeholder="Ask me anything about Erick..."
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MSG_MAX_CHARS))}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={MSG_MAX_CHARS}
            aria-label="Type your question"
          />
          <button
            type="button"
            className={styles.sendButton}
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
          >
            <Icon name="arrowRight" size="s" />
          </button>
        </Row>
      )}
    </div>
  );
};

// ── Markdown parser (module-level pure function) ──────────────────────────────

function parseAnswerText(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    const lineParts: React.ReactNode[] = [];
    let idx = 0;
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
      const matchText = match[0];
      const matchIdx = match.index;
      if (matchIdx > idx) lineParts.push(line.substring(idx, matchIdx));

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

    if (idx < line.length) lineParts.push(line.substring(idx));

    return (
      <span
        key={lIdx}
        style={{ display: "block", minHeight: line.trim() === "" ? "8px" : "unset" }}
      >
        {lineParts}
      </span>
    );
  });
}

// ── Bubble styles ─────────────────────────────────────────────────────────────

const userBubbleStyle: React.CSSProperties = {
  background: "var(--brand-solid)",
  maxWidth: "85%",
  borderBottomRightRadius: "var(--radius-xs)",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const botBubbleStyle: React.CSSProperties = {
  background: "var(--neutral-alpha-weak)",
  maxWidth: "85%",
  borderBottomLeftRadius: "var(--radius-xs)",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

// ── Main component ────────────────────────────────────────────────────────────

export const FaqChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsCollapsed, setSuggestionsCollapsed] = useState(true);
  const [msgCount, setMsgCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(sessionStorage.getItem("chatbot_msg_count") ?? "0");
    }
    return 0;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isLimited = msgCount >= SESSION_LIMIT;

  // Auto scroll to top on view change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [activeView, isOpen]);

  // Click outside to close
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ── API call ────────────────────────────────────────────────────────────────

  const askGemini = async (question: string) => {
    if (isLimited || isLoading || !question.trim()) return;

    // Collapse suggestions when a question is asked
    setSuggestionsCollapsed(true);
    setIsLoading(true);
    setActiveView({ question, answer: "" });

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (res.status === 429) {
        setActiveView({
          question,
          answer:
            `You've reached the message limit for this session — feel free to reach out directly!\n\n` +
            `• [Email](mailto:${EMAIL})\n• [LinkedIn](${LINKEDIN_URL})`,
        });
        setMsgCount(SESSION_LIMIT);
        sessionStorage.setItem("chatbot_msg_count", String(SESSION_LIMIT));
        return;
      }

      const data = await res.json();

      if (data.error || !data.reply) {
        setActiveView({
          question,
          answer:
            `Something went wrong on my end. You can reach Erick directly at:\n\n` +
            `• [Email](mailto:${EMAIL})\n• [LinkedIn](${LINKEDIN_URL})`,
        });
        return;
      }

      const newCount = msgCount + 1;
      setMsgCount(newCount);
      sessionStorage.setItem("chatbot_msg_count", String(newCount));
      setActiveView({ question, answer: data.reply });
    } catch {
      setActiveView({
        question,
        answer:
          `Something went wrong on my end. You can reach Erick directly at:\n\n` +
          `• [Email](mailto:${EMAIL})\n• [LinkedIn](${LINKEDIN_URL})`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitInput = () => {
    const q = inputText.trim();
    if (!q) return;
    setInputText("");
    askGemini(q);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef} className={styles.chatbotWrapper}>
      {/* Chatbot Panel */}
      {isOpen && (
        <Column ref={containerRef} className={styles.chatbotContainer} padding="16" radius="l" gap="16">
          {/* Header */}
          <Row fillWidth vertical="center" horizontal="between" className={styles.header}>
            <Row gap="8" vertical="center">
              <Image
                src="/images/chatbot/chatbot-icon.png"
                alt="Erick Chatbot"
                width={32}
                height={32}
                className={styles.headerIcon}
                priority
              />
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
            {activeView === null ? (
              /* ── Home screen ── */
              <Column gap="12" fillWidth>
                <Flex fillWidth horizontal="start">
                  <Flex paddingY="s" paddingX="m" radius="m" style={botBubbleStyle}>
                    <Text variant="body-default-m" onBackground="neutral-strong">
                      {initialGreeting}
                    </Text>
                  </Flex>
                </Flex>

                <SuggestedQuestions
                  collapsed={suggestionsCollapsed}
                  onToggle={() => setSuggestionsCollapsed((c) => !c)}
                  onSelect={(q) => askGemini(q)}
                  disabled={isLimited || isLoading}
                />
              </Column>
            ) : (
              /* ── Active Q&A screen ── */
              <Column gap="12" fillWidth>
                {/* User question */}
                <Flex fillWidth horizontal="end">
                  <Flex paddingY="s" paddingX="m" radius="m" style={userBubbleStyle}>
                    <Text variant="body-default-m" onBackground="brand-strong">
                      {activeView.question}
                    </Text>
                  </Flex>
                </Flex>

                {/* Bot answer / loading */}
                <Flex fillWidth horizontal="start">
                  <Flex paddingY="s" paddingX="m" radius="m" style={botBubbleStyle}>
                    {isLoading ? (
                      <Text
                        variant="body-default-m"
                        onBackground="neutral-weak"
                        style={{ fontStyle: "italic" }}
                      >
                        Erick Chatbot is typing…
                      </Text>
                    ) : (
                      <Text variant="body-default-m" onBackground="neutral-strong">
                        {parseAnswerText(activeView.answer)}
                      </Text>
                    )}
                  </Flex>
                </Flex>

                {/* Suggested questions (collapsed by default after answering) */}
                {!isLoading && (
                  <SuggestedQuestions
                    exclude={activeView.question}
                    collapsed={suggestionsCollapsed}
                    onToggle={() => setSuggestionsCollapsed((c) => !c)}
                    onSelect={(q) => askGemini(q)}
                    disabled={isLimited || isLoading}
                  />
                )}
              </Column>
            )}
          </div>

          {/* Input area — always visible at bottom */}
          <InputArea
            value={inputText}
            onChange={setInputText}
            onSubmit={handleSubmitInput}
            disabled={isLoading}
            isLimited={isLimited}
          />
        </Column>
      )}

      {/* Floating Toggle Button */}
      <div ref={triggerRef} className={styles.floatingButton}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Erick Chatbot"
        >
          {isOpen ? (
            <Icon name="x" size="m" />
          ) : (
            <Image
              src="/images/chatbot/chatbot-icon.png"
              alt="Erick Chatbot"
              width={64}
              height={64}
              className={styles.avatarIcon}
              priority
            />
          )}
        </button>
      </div>
    </div>
  );
};
