export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date | string | number;
  agent?: string;
  keyStatus?: "custom" | "server" | "missing";
  modelUsed?: string;
  isStreaming?: boolean;
}
