import React from "react";
import SoftwareAiHeader from "../../../../components/chat/SoftwareAiHeader";
import { GrixFileNode } from "../../../../types/github";

interface ChatHeaderProps {
  onToggle: () => void;
  clearChat: () => void;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  selectedAgent: "engineer" | "explainer" | "bug_hunter" | "architect" | "planner" | "agentic" | "designer";
  setSelectedAgent: (val: any) => void;
  agents: any;
  activeFile: GrixFileNode | null;
  fileSystemTree: GrixFileNode[];
  getFlatFilePaths: (nodes: GrixFileNode[]) => string[];
  accentColor: string;
  selectedModel: string;
  popularModels: Array<{ value: string; label: string; provider?: string }>;
  onModelChange: (val: string) => void;
  onNewSession: () => void;
  isMobile?: boolean;
  onOpenMenu?: () => void;
}

export default function ChatHeader({
  onToggle,
  showSettings,
  setShowSettings,
  accentColor,
  selectedModel,
  popularModels,
  onModelChange,
  onNewSession,
  isMobile = false,
  onOpenMenu
}: ChatHeaderProps) {
  const getModelLabel = (modelVal: string) => {
    const found = popularModels.find((m) => m.value === modelVal);
    if (found) return found.label.replace(" (Free)", "").replace(" (Standard)", "");
    return modelVal.split("/").pop() || modelVal;
  };

  return (
    <SoftwareAiHeader
      title="Gothwad AI Companion"
      activeModelLabel={getModelLabel(selectedModel)}
      modelsList={popularModels}
      onSelectModel={onModelChange}
      showSettings={showSettings}
      onToggleSettings={() => setShowSettings(!showSettings)}
      onNewSession={onNewSession}
      accentColor={accentColor}
      isMobile={isMobile}
      onOpenMobileMenu={onOpenMenu}
      onClosePanel={onToggle}
    />
  );
}



