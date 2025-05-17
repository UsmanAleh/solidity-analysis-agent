import type { Message } from "../types/index";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";

interface MessageDisplayProps {
  message: Message;
}

interface RegExpMatchWithGroups {
  [key: number]: string;
  index: number;
  input: string;
  groups?: { [key: string]: string };
  0: string;
}

const MessageDisplay = ({ message }: MessageDisplayProps) => {
  const [formattedContent, setFormattedContent] = useState<React.ReactNode[]>(
    [],
  );

  useEffect(() => {
    const formatContent = () => {
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const parts: React.ReactNode[] = [];

      // Split content by code blocks first
      let lastIndex = 0;
      let codeMatch: RegExpMatchWithGroups | null;
      const contentCopy = message.content;

      while (
        (codeMatch = codeBlockRegex.exec(
          contentCopy,
        ) as RegExpMatchWithGroups | null) !== null
      ) {
        // Process text before code block (might contain think tags)
        if (codeMatch.index > lastIndex) {
          const textBeforeCode = contentCopy.substring(
            lastIndex,
            codeMatch.index,
          );
          parts.push(...processThinkTags(textBeforeCode));
        }

        // Add code block
        const language = codeMatch?.[1] || "javascript";
        parts.push(
          <div
            key={`code-${codeMatch?.index}`}
            className="overflow-hidden border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span>{language}</span>
              <button
                onClick={() => {
                  if (codeMatch) navigator.clipboard.writeText(codeMatch[2]);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{ margin: 0, borderRadius: 0 }}
            >
              {codeMatch[2]}
            </SyntaxHighlighter>
          </div>,
        );

        lastIndex = codeMatch.index + codeMatch[0].length;
      }

      // Process remaining text after all code blocks
      if (lastIndex < contentCopy.length) {
        const remainingText = contentCopy.substring(lastIndex);
        parts.push(...processThinkTags(remainingText));
      }

      return parts.length > 0
        ? parts
        : [
            <span key="text-full">
              {message.content.split("\n\n").join("\n")}
            </span>,
          ];
    };

    // Helper function to process text with think tags
    const processThinkTags = (text: string): React.ReactNode[] => {
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
      const result: React.ReactNode[] = [];

      let lastIndex = 0;
      let match: RegExpMatchWithGroups | null;

      while (
        (match = thinkRegex.exec(text) as RegExpMatchWithGroups | null) !== null
      ) {
        // Add text before think tag
        if (match.index > lastIndex) {
          result.push(
            <span key={`text-${lastIndex}`}>
              {text.substring(lastIndex, match.index).split("\n").join("")}
            </span>,
          );
        }

        // Add styled think tag content
        result.push(
          <p
            key={`think-${match.index}`}
            className="my-2 border-l-2 border-blue-500 px-4 py-2 text-sm italic"
          >
            {match[1].split("\n").join("")}
          </p>,
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after all think tags
      if (lastIndex < text.length) {
        result.push(
          <span key={`text-end-${lastIndex}`} className="mt-4 text-sm">
            {text.substring(lastIndex).split("\n\n").join("\n")}
          </span>,
        );
      }

      return result.length > 0
        ? [
            <span
              key={`p-${Date.now()}-${Math.random()}`}
              className="mx-0 py-0"
            >
              {result}
            </span>,
          ]
        : [
            <span
              key={`p-${Date.now()}-${Math.random()}`}
              className="mx-0 py-0"
            >
              {text}
            </span>,
          ];
    };

    setFormattedContent(formatContent());
  }, [message.content]);

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] ${
          isUser
            ? "rounded-lg bg-gray-700 px-4"
            : "rounded-lg border border-gray-700 px-4"
        }`}
      >
        <div className={"prose max-w-none p-4"}>{formattedContent}</div>
      </div>
    </div>
  );
};

export default MessageDisplay;
