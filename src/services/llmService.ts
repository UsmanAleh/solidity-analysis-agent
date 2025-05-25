import * as webllm from "@mlc-ai/web-llm";
import type { Message, SmartContract, AnalysisResult } from "../types";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

function isSafariOrIOS(userAgent = navigator.userAgent) {
  const isIOS = /iP(hone|od|ad)/.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  return isIOS || isSafari;
}

class LLMService {
  private chat: webllm.MLCEngine | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        const model = isSafariOrIOS() ? "Qwen3-0.6B-q4f16_1-MLC" : "Qwen3-0.6B-q0f16-MLC";
        this.chat = await webllm.CreateMLCEngine(model, {
          initProgressCallback: (progress) => {
            console.log("Model initialization progress:", progress);
          },
        });

        this.isInitialized = true;
        console.log("LLM initialized successfully");
      } catch (error) {
        console.error("Failed to initialize LLM:", error);
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  async generateResponse(
    messages: Message[],
    callBack: (response: string) => void
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.chat) {
      throw new Error("Chat module not initialized");
    }

    try {
      let preprocessedHistory = messages.map((msg) => {
        if (msg.role === "assistant") {
          const thinkRegex = /<think>.*?<\/think>\n?\n?/s;
          const contentWithoutThink = msg
            .content!.replace(thinkRegex, "")
            .trim();
          return { ...msg, content: contentWithoutThink };
        }
        return msg;
      });

      preprocessedHistory = preprocessedHistory.filter(
        (msg) => msg.role !== "analysis"
      );

      const completion = await this.chat.chat.completions.create({
        messages: preprocessedHistory as ChatCompletionMessageParam[],
        stream: true,
        stream_options: { include_usage: true },
      });

      let response = "";
      const interval = setInterval(() => {
        callBack(response);
      }, 200);

      for await (const chunk of completion) {
        if (chunk.choices?.[0]?.delta?.content) {
          const content = chunk.choices[0].delta.content;
          if (content) {
            response += content;
          }
        }
      }

      clearInterval(interval);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }

  async analyzeSmartContract(contract: SmartContract): Promise<AnalysisResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.chat) {
      throw new Error("Chat module not initialized");
    }

    try {
      const prompt = `
        Analyze the following ${contract.language} smart contract for security vulnerabilities, 
        optimization opportunities, and best practices:
        
        \`\`\`${contract.language}
        ${contract.code}
        \`\`\`
        
        Provide a detailed analysis in JSON format with the following structure:
        {
          "vulnerabilities": [
            {
              "type": "string",
              "severity": "low|medium|high|critical",
              "description": "string",
              "location": "string",
              "recommendation": "string"
            }
          ],
          "suggestions": [
            {
              "type": "string",
              "description": "string",
              "location": "string",
              "code": "string (optional)"
            }
          ],
          "summary": "string"
        }
      `;

      const messages = [{ role: "user" as const, content: prompt }];

      const response = await this.chat.chat.completions.create({
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const jsonText = response.choices[0].message.content || "{}";

      try {
        const result = JSON.parse(jsonText);
        return result as AnalysisResult;
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        throw new Error("Failed to parse analysis results");
      }
    } catch (error) {
      console.error("Error analyzing smart contract:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const llmService = new LLMService();
export default llmService;
