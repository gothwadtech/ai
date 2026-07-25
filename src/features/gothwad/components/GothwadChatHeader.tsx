import React from "react";
import SoftwareAiHeader from "../../../components/chat/SoftwareAiHeader";

interface GothwadChatHeaderProps {
  activeModelLabel: string;
  setShowHeaderModelMenu: (open: boolean) => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  showParametersPanel: boolean;
  setShowParametersPanel: (show: boolean) => void;
  onNewSession: () => void;
  accentColor: string;
  onToggleSidebar?: () => void;
}

export default function GothwadChatHeader({
  activeModelLabel,
  setShowHeaderModelMenu,
  showLeftSidebar,
  setShowLeftSidebar,
  showParametersPanel,
  setShowParametersPanel,
  onNewSession,
  accentColor,
  onToggleSidebar
}: GothwadChatHeaderProps) {
  return (
    <SoftwareAiHeader
      title="Gothwad Tech AI"
      activeModelLabel={activeModelLabel}
      onOpenModelMenu={() => setShowHeaderModelMenu(true)}
      onToggleSidebar={onToggleSidebar}
      showHistory={showLeftSidebar}
      onToggleHistory={() => setShowLeftSidebar(!showLeftSidebar)}
      showSettings={showParametersPanel}
      onToggleSettings={() => setShowParametersPanel(!showParametersPanel)}
      onNewSession={onNewSession}
      accentColor={accentColor}
    />
  );
}



