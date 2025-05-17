import { useRef, useEffect } from "react";
import type { Message } from "../types/index";
import MessageDisplay from "./MessageDisplay";

interface ChatInterfaceProps {
  messages: Message[];
  messageStream: string;
  Analysis: () => React.ReactNode;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
}

const ChatInterface = ({
  messages,
  messageStream,
  Analysis,
  inputRef,
  input,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messageStream]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef?.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Focus input on mount
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mt-4 overflow-y-auto space-y-4">
        {messages.map((message, index) =>
          message.role === "system" ? null : message.role === "analysis" ? (
            <Analysis key={index} />
          ) : (
            <MessageDisplay key={index} message={message} />
          )
        )}
        {messageStream.length > 0 && (
          <MessageDisplay
            message={{ role: "assistant", content: messageStream }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatInterface;
