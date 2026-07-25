import React, { useState } from "react";
import GothwadChatHeader from "./GothwadChatHeader";
import LeftSidebar from "./LeftSidebar";
import RightSidebar, { SUPPORTED_MODELS } from "./RightSidebar";
import GothwadChatInput from "./GothwadChatInput";
import GothwadChatScreen from "./GothwadChatScreen";
import GothwadModel from "./GothwadModel";
import { safeStorage } from "../../../utils/safeStorage";
import { useGothwadStudioSessions } from "../hooks/useGothwadStudioSessions";

interface GothwadStudioProps {
  accentColor: string;
  customApiKey?: string;
  onToggleSidebar?: () => void;
}

export default function GothwadStudio({ accentColor, customApiKey, onToggleSidebar }: GothwadStudioProps) {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    inputText,
    handleUpdateInputText,
    generating,
    updateActiveSessionParam,
    handleNewSession,
    handleDeleteSession,
    handleClearSessions,
    handleSendMessage
  } = useGothwadStudioSessions(customApiKey);

  const [showHeaderModelMenu, setShowHeaderModelMenu] = useState(false);
  const [showParametersPanel, setShowParametersPanel] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1280;
    }
    return true;
  });
  const [showLeftSidebar, setShowLeftSidebar] = useState(() => {
    try {
      const override = safeStorage.getItem("gothwad_gothwad_ai_show_left_sidebar");
      if (override === "false") {
        safeStorage.removeItem("gothwad_gothwad_ai_show_left_sidebar");
        return false;
      }
    } catch (e) {}

    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const activeModelLabel = SUPPORTED_MODELS.find(m => m.id === activeSession?.model)?.name || "Gemini 2.5 Flash";

  return (
    <div className="flex-1 flex h-full bg-zinc-950 text-zinc-100 overflow-hidden relative font-sans">
      {showLeftSidebar && (
        <LeftSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(session) => setActiveSessionId(session.id)}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onClearSessions={handleClearSessions}
          accentColor={accentColor}
          onToggleSidebar={() => setShowLeftSidebar(false)}
          onOpenPrimarySidebar={onToggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950/40 relative">
        <GothwadChatHeader
          activeModelLabel={activeModelLabel}
          showLeftSidebar={showLeftSidebar}
          setShowLeftSidebar={setShowLeftSidebar}
          setShowHeaderModelMenu={setShowHeaderModelMenu}
          onNewSession={handleNewSession}
          showParametersPanel={showParametersPanel}
          setShowParametersPanel={setShowParametersPanel}
          accentColor={accentColor}
          onToggleSidebar={onToggleSidebar}
        />

        <GothwadChatScreen
          activeSession={activeSession}
          generating={generating}
          accentColor={accentColor}
          setInputText={handleUpdateInputText}
        />

        <GothwadChatInput
          inputText={inputText}
          setInputText={handleUpdateInputText}
          generating={generating}
          onSubmit={handleSendMessage}
          accentColor={accentColor}
          activeModelName={activeModelLabel}
          temperature={activeSession?.temperature ?? 0.7}
        />
      </div>

      {showParametersPanel && (
        <RightSidebar
          accentColor={accentColor}
          systemPrompt={activeSession?.systemPrompt ?? ""}
          setSystemPrompt={(p) => updateActiveSessionParam("systemPrompt", p)}
          temperature={activeSession?.temperature ?? 0.7}
          setTemperature={(t) => updateActiveSessionParam("temperature", t)}
          maxTokens={activeSession?.maxTokens ?? 2048}
          setMaxTokens={(t) => updateActiveSessionParam("maxTokens", t)}
          topP={activeSession?.topP ?? 0.9}
          setTopP={(p) => updateActiveSessionParam("topP", p)}
          onClose={() => setShowParametersPanel(false)}
        />
      )}

      {showHeaderModelMenu && (
        <GothwadModel
          isOpen={true}
          accentColor={accentColor}
          selectedModel={activeSession?.model || "google/gemini-2.5-flash"}
          onSelectModel={(modelValue) => updateActiveSessionParam("model", modelValue)}
          onClose={() => setShowHeaderModelMenu(false)}
        />
      )}
    </div>
  );
}
