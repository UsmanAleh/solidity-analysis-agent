export interface Message {
  role: "user" | "assistant" | "analysis" | "system";
  content: string;
}

export interface SmartContract {
  name: string;
  code: string;
  language: string;
}

export interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  suggestions: Suggestion[];
  summary: string;
}

export interface Vulnerability {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  location: string;
  recommendation: string;
}

export interface Suggestion {
  type: string;
  description: string;
  location: string;
  code?: string;
}
