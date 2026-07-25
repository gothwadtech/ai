import React from "react";
import GothwadStyleInputBar from "./chat/GothwadStyleInputBar";
import { GrixFileNode } from "../types/github";
import { AttachedFile } from "./chat/ChatInputAttachedFiles";

interface ChatInputBarProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  onSend: (customPrompt?: string) => void;
  selectedModel: string;
  accentColor: string;
  
  customMediaActions?: boolean;
  onAttachmentTrigger?: (sourceName: string) => void;
  temperature?: number;
  maxTokens?: number;
  
  quickModes?: boolean;
  selectedAgent?: "engineer" | "explainer" | "bug_hunter" | "architect" | "planner" | "agentic" | "designer";
  setSelectedAgent?: (val: "engineer" | "explainer" | "bug_hunter" | "architect" | "planner" | "agentic" | "designer") => void;
  agents?: any;
  activeFile?: GrixFileNode | null;
  popularModels?: Array<{ value: string; label: string; provider?: string }>;
  onModelChange?: (val: string) => void;
  attachedFiles?: AttachedFile[];
  setAttachedFiles?: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  keyStatus?: "custom" | "server" | "missing";
}

export default function ChatInputBar({
  input,
  setInput,
  isLoading,
  onSend,
  selectedModel,
  accentColor,
  selectedAgent,
  setSelectedAgent,
  agents,
  activeFile,
  popularModels,
  onModelChange,
  attachedFiles = [],
  setAttachedFiles,
  keyStatus
}: ChatInputBarProps) {
  return (
    <GothwadStyleInputBar
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      onSend={onSend}
      accentColor={accentColor}
      placeholder="Ask Gothwad AI Companion..."
      activeFile={activeFile}
      attachedFiles={attachedFiles}
      setAttachedFiles={setAttachedFiles}
      selectedModel={selectedModel}
      popularModels={popularModels}
      onModelChange={onModelChange}
      selectedAgent={selectedAgent}
      setSelectedAgent={setSelectedAgent}
      agents={agents}
      keyStatus={keyStatus}
    />
  );
}


