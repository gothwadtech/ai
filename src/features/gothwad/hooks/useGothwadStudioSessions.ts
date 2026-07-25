import { useState, useEffect } from "react";
import { GothwadSession, Message } from "../components/LeftSidebar";
import { safeStorage } from "../../../utils/safeStorage";
import { callAiChat } from "../../../utils/aiClient";

const DEFAULT_SESSION: GothwadSession = {
  id: "1",
  title: "Default Chat Session",
  messages: [
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! Welcome to Gothwad AI Universal Software Studio. 🚀\n\nI am your all-in-one AI software engineer. Tell me your requirements and I will write, structure, and refine the code for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: "google/gemini-2.5-flash"
    }
  ],
  systemPrompt: "You are an expert universal AI software engineer powered by Gothwad AI. Provide clean, production-ready code with clear explanations.",
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  model: "google/gemini-2.5-flash",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

export function useGothwadStudioSessions(customApiKey?: string) {
  const [sessions, setSessions] = useState<GothwadSession[]>(() => {
    try {
      const saved = safeStorage.getItem("gothwad_chat_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [DEFAULT_SESSION];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return sessions.length > 0 ? sessions[0].id : null;
  });

  const [inputText, setInputText] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    try {
      safeStorage.setItem("gothwad_chat_sessions", JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId) {
      setInputText(drafts[activeSessionId] || "");
    } else {
      setInputText("");
    }
  }, [activeSessionId]);

  const handleUpdateInputText = (val: string) => {
    setInputText(val);
    if (activeSessionId) {
      setDrafts(prev => ({ ...prev, [activeSessionId]: val }));
    }
  };

  const updateActiveSessionParam = (key: keyof GothwadSession, value: any) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession?.id) {
        return { ...s, [key]: value };
      }
      return s;
    }));
  };

  const handleNewSession = () => {
    const id = Date.now().toString();
    const newSession: GothwadSession = {
      id,
      title: `New Chat Session`,
      messages: [
        {
          id: `welcome-${id}`,
          role: "assistant",
          content: "Starting a new playground chat. Choose your model on the right and ask me anything!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: activeSession?.model || "google/gemini-2.5-flash"
        }
      ],
      systemPrompt: "You are a helpful and intelligent AI assistant powered by Gothwad AI.",
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      model: activeSession?.model || "google/gemini-2.5-flash",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
  };

  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter(s => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleClearSessions = () => {
    try {
      safeStorage.removeItem("gothwad_chat_sessions");
    } catch (e) {}
    setSessions([DEFAULT_SESSION]);
    setActiveSessionId("1");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || generating || !activeSession) return;

    const userText = inputText;
    setInputText("");
    if (activeSessionId) {
      setDrafts(prev => ({ ...prev, [activeSessionId]: "" }));
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const isFirstUserMessage = activeSession.messages.filter(m => m.role === "user").length === 0;
    const nextTitle = isFirstUserMessage 
      ? (userText.length > 25 ? userText.substring(0, 25) + "..." : userText) 
      : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMsg];

    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return { ...s, title: nextTitle, messages: updatedMessages };
      }
      return s;
    }));

    setGenerating(true);

    try {
      let modelToUse = activeSession.model;
      if (modelToUse === "deepseek/deepseek-r1") modelToUse = "deepseek/deepseek-r1:free";
      if (modelToUse === "meta-llama/llama-3.3-70b-instruct") modelToUse = "meta-llama/llama-3.3-70b-instruct:free";

      const clientMessages = updatedMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      const resData = await callAiChat({
        messages: clientMessages,
        selectedAgent: "custom",
        selectedModel: modelToUse,
        customApiKey: customApiKey || undefined,
        systemInstructionOverride: activeSession.systemPrompt,
        temperature: activeSession.temperature,
        maxTokens: activeSession.maxTokens
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: activeSession.model
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return { ...s, messages: [...updatedMessages, assistantMsg] };
        }
        return s;
      }));
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **Gothwad AI Error:** ${err?.message || "Failed to retrieve response."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: activeSession.model
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return { ...s, messages: [...updatedMessages, errorMsg] };
        }
        return s;
      }));
    } finally {
      setGenerating(false);
    }
  };

  return {
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
  };
}
