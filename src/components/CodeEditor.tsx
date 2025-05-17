import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SmartContract } from "../types/index";

interface CodeEditorProps {
  contract: SmartContract;
  onContractChange: (contract: SmartContract) => void;
}

const CodeEditor = ({ contract, onContractChange }: CodeEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(contract.code);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditableCode(contract.code);
  }, [contract.code]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onContractChange({
      ...contract,
      code: editableCode,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCode(contract.code);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contract.code);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onContractChange({
          ...contract,
          code: text,
        });
      }
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-[12px] border border-gray-700 bg-gray-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between border-b border-gray-700 px-4 py-2 md:flex-nowrap">
        <div className="flex items-center">
          <span className="font-medium text-gray-100">{contract.name}</span>
          <span className="ml-2 rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-blue-300">
            {contract.language.charAt(0).toUpperCase() +
              contract.language.slice(1)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-200 shadow-sm transition-colors hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-200 shadow-sm transition-colors hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300 shadow-sm transition-colors hover:bg-gray-600"
                title="Edit code"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="ml-1 hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300 shadow-sm transition-colors hover:bg-gray-600"
                title="Copy to clipboard"
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
                <span className="ml-1 hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={handlePaste}
                className="flex items-center rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300 shadow-sm transition-colors hover:bg-gray-600"
                title="Paste from clipboard"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="ml-1 hidden sm:inline">Paste</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="w-full resize-none border-0 bg-gray-900 px-4 py-2 font-mono text-sm text-gray-100"
            rows={contract.code.split("\n").length}
            spellCheck="false"
          />
        ) : (
          <div className="h-full overflow-auto">
            <SyntaxHighlighter
              language={contract.language}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{ margin: 0, height: "100%" }}
            >
              {contract.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
