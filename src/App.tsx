import "./App.css";
import { useState, useEffect, useRef } from "react";
import ChatInterface from "./components/ChatInterface";
import CodeEditor from "./components/CodeEditor";
import AnalysisResults from "./components/AnalysisResults";
import type { Message, SmartContract, AnalysisResult } from "./types/index";
import llmService from "./services/llmService";
import sampleContracts from "./utils/sampleContracts";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a smart contract analysis agent, aim to find vulnerabilities and suggest improvements for the contract. That is your only purpose.",
    },
    {
      role: "assistant",
      content:
        "Hello 👋\nI'm your smart contract analysis assistant. You can upload a contract for analysis, or select one of the sample contracts to get started.",
    },
  ]);
  const [messageStream, setMessageStream] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedContract, setSelectedContract] = useState<SmartContract>(
    sampleContracts[0],
  );
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null,
  );
  const [input, setInput] = useState("");
  console.log("🚀 ~ App ~ input:", input);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initLLM = async () => {
      try {
        await llmService.initialize();
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize LLM:", error);
        setInitError(
          "Failed to initialize the LLM. Please check your connection and try again.",
        );
        setIsInitializing(false);
      }
    };

    initLLM();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    setIsProcessing(true);
    try {
      const response = await llmService.generateResponse(
        [...messages, userMessage],
        (response) => {
          setMessageStream(response);
        },
      );

      setMessageStream("");
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContractChange = (contract: SmartContract) => {
    setSelectedContract(contract);
    setAnalysisResults(null);
  };

  const handleContractSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selected = sampleContracts.find((c) => c.name === event.target.value);
    if (selected) {
      setSelectedContract(selected);
      setAnalysisResults(null);
    }
  };

  const analyzeContract = async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    setMessages((prev) => prev.filter((msg) => msg.role !== "analysis"));

    try {
      const userMessage: Message = {
        role: "user",
        content: `Analyze this ${selectedContract.language} contract named "${selectedContract.name}"`,
      };

      const analysisMessage: Message = {
        role: "analysis",
        content: ``,
      };

      setMessages((prev) => [...prev, userMessage, analysisMessage]);

      const results = await llmService.analyzeSmartContract(selectedContract);
      setAnalysisResults(results);

      const assistantMessage: Message = {
        role: "assistant",
        content: `I've analyzed the ${selectedContract.name} contract. Here's what I found:\n \n${results.summary} I've identified ${results.vulnerabilities.length} vulnerabilities and ${results.suggestions.length} suggestions for improvement.`,
      };

      setMessages((prev) => [
        ...prev.slice(0, -1),
        assistantMessage,
        analysisMessage,
      ]);
    } catch (error) {
      console.error("Error analyzing contract:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error while analyzing the contract. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      const userMessage = input.trim();
      setInput("");
      await handleSendMessage(userMessage);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8 text-center text-gray-100 shadow-lg">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <h2 className="mb-3 text-xl font-semibold">
            Initializing - Hang tight!
          </h2>
          <p className="text-gray-300">
            We're loading the language model for you. It can take a while when
            we first visit this page to populate the cache. Later refreshes will
            become faster.
          </p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8 text-center text-gray-100 shadow-lg">
          <div className="mb-6 rounded-lg border border-red-800 bg-gray-700 p-6 text-red-300">
            <svg
              className="mx-auto mb-3 h-10 w-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="mb-3 text-xl font-semibold">Initialization Error</h2>
            <p>{initError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <div className="absolute fixed top-0 right-0 left-0 mb-4 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 shadow-lg">
        <header className="bg-gray-800 text-white shadow-lg">
          <div className="container py-4">
            <h2 className="m-0 text-2xl font-bold">Solidity Analysis Agent</h2>
          </div>
        </header>

        <div className="flex items-center justify-center gap-4">
          <div>
            <select
              id="contract-select"
              value={selectedContract.name}
              onChange={handleContractSelect}
              className="h-10 rounded-lg border border-gray-600 bg-gray-700 pl-1 text-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {sampleContracts.map((contract) => (
                <option key={contract.name} value={contract.name}>
                  {contract.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={analyzeContract}
              disabled={isAnalyzing}
              className={`mt-3 w-full rounded-lg border border-blue-500 px-6 py-2.5 font-medium text-blue-300 shadow-sm transition-all sm:mt-0 sm:w-auto ${
                isAnalyzing
                  ? "cursor-not-allowed bg-gray-700 text-gray-400"
                  : "hover:bg-gray-700 hover:text-blue-200 hover:shadow"
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  Analyzing...
                </span>
              ) : (
                "Analyze Contract"
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto mt-24 mb-32 flex-1 gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-md">
            <div className="flex-1 overflow-auto p-4">
              <CodeEditor
                contract={selectedContract}
                onContractChange={handleContractChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-700 bg-gray-800 px-4 shadow-md">
          <ChatInterface
            messages={messages}
            messageStream={messageStream}
            inputRef={inputRef}
            input={input}
            Analysis={() => (
              <div className="my-4 shadow-md">
                <AnalysisResults
                  results={analysisResults}
                  isLoading={isAnalyzing}
                />
              </div>
            )}
          />
        </div>
      </main>

      <footer className="fixed bottom-0 z-10 w-full shadow-md">
        <form onSubmit={handleSubmit} className="">
          <div className="h-4 w-full bg-gradient-to-b from-transparent to-gray-900 backdrop-blur-[1px]"></div>
          <div className="flex w-full items-center justify-center space-y-3 border-gray-700 bg-gray-900 px-4 pb-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your smart contract..."
              disabled={isProcessing}
              rows={2}
              className="container mt-2 resize-none self-center rounded-xl bg-gray-700 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isProcessing) {
                    handleSubmit(e);
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={isProcessing || input.trim().length === 0}
              style={{
                cursor:
                  isProcessing || input.trim().length === 0
                    ? "not-allowed"
                    : "pointer",
                backgroundColor: "#2b2b2b",
                border: "1px solid #737373",
              }}
              className={`relative left-[-48px] flex h-10 w-10 items-center justify-center rounded-lg ${
                isProcessing || input.trim().length === 0
                  ? "cursor-not-allowed text-gray-500"
                  : "text-blue-300 hover:bg-gray-700"
              }`}
            >
              ➤
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default App;
