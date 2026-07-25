import React, { useRef, useEffect, useState } from "react";
import { 
  Send, Plus, ArrowUp, Mic, MicOff, Paperclip, AlertCircle, Loader2, RotateCcw, LayoutGrid
} from "lucide-react";
import { GrixFileNode } from "../../types/github";
import ChatInputQuickActions from "./ChatInputQuickActions";
import ChatInputAttachedFiles, { AttachedFile } from "./ChatInputAttachedFiles";

export interface GothwadAiInputProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  onSend: (customPrompt?: string) => void;
  accentColor: string;
  placeholder?: string;
  
  // Quick Actions & Active File
  activeFile?: GrixFileNode | null;
  
  // Attachments
  attachedFiles?: AttachedFile[];
  setAttachedFiles?: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  
  // Selectors for Models & Agents
  selectedModel?: string;
  popularModels?: Array<{ value: string; label: string; provider?: string }>;
  onModelChange?: (val: string) => void;
  selectedAgent?: "engineer" | "explainer" | "bug_hunter" | "architect" | "planner" | "agentic" | "designer";
  setSelectedAgent?: (val: any) => void;
  agents?: any;
  keyStatus?: "custom" | "server" | "missing";
}

export default function GothwadAiInput({
  input,
  setInput,
  isLoading,
  onSend,
  accentColor,
  placeholder = "Ask Gothwad AI...",
  activeFile,
  attachedFiles = [],
  setAttachedFiles,
  selectedModel,
  popularModels,
  onModelChange,
  selectedAgent,
  setSelectedAgent,
  agents,
  keyStatus
}: GothwadAiInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea to fit content nicely
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${newHeight}px`;
  }, [input]);

  // Handle keydown for submit on Enter (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  // Handle Speech Recognition dictation
  const startListening = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser. Please try Chrome, Safari, or Edge.");
        return;
      }

      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(input ? `${input} ${transcript}` : transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Handle File Upload
  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setAttachedFiles) return;

    if (file.size > 250000) {
      alert("⚠️ File is too large. Please select a file smaller than 250KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newFile: AttachedFile = {
        name: file.name,
        content: content || ""
      };
      setAttachedFiles((prev) => {
        if (prev.some((f) => f.name === file.name)) return prev;
        return [...prev, newFile];
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const removeAttachedFile = (name: string) => {
    if (setAttachedFiles) {
      setAttachedFiles((prev) => prev.filter((f) => f.name !== name));
    }
  };

  return (
    <div className="pt-0.5 pb-1 px-2 sm:px-3 shrink-0 bg-transparent relative z-20 w-full select-none">
      {/* Quick Action Chips for Active File */}
      {activeFile && (
        <ChatInputQuickActions
          activeFile={activeFile}
          isLoading={isLoading}
          onSend={onSend}
        />
      )}

      {/* Attached Code Files list */}
      <ChatInputAttachedFiles
        attachedFiles={attachedFiles}
        onRemoveFile={removeAttachedFile}
      />

      <div className="max-w-3xl mx-auto w-full relative">
        {/* Gemini-Style Capsule Form Container */}
        <div 
          className={`relative border rounded-2xl bg-zinc-900/90 backdrop-blur-md p-2 flex flex-col space-y-1.5 transition-colors duration-200 shadow-xl ${
            isFocused 
              ? "border-zinc-700/90 bg-zinc-900" 
              : "border-zinc-800/80 bg-zinc-900/80"
          }`}
        >
          {/* Main Input Row */}
          <div className="flex items-center gap-2 w-full">
            {/* Attachment / Plus Trigger */}
            <div className="flex items-center gap-1 shrink-0">
              {setAttachedFiles ? (
                <>
                  <button
                    type="button"
                    onClick={handleFileAttachClick}
                    disabled={isLoading}
                    className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                    title="Attach local file (up to 250KB)"
                  >
                    <Plus className="w-4 h-4 text-zinc-300" />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.js,.ts,.tsx,.jsx,.html,.css,.json,.md,.xml"
                  />
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  disabled={!input}
                  className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-xl disabled:opacity-30 transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                  title="Reset Text"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                agents && selectedAgent && agents[selectedAgent]
                  ? `Ask ${agents[selectedAgent].name}...`
                  : placeholder
              }
              disabled={isLoading}
              className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm font-sans focus:outline-none resize-none select-text leading-snug no-scrollbar py-2 px-1 min-h-[36px] max-h-[180px] my-auto"
              style={{ caretColor: accentColor }}
            />

            {/* Microphone & Send Button Cluster */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Voice Microphone Input */}
              {!input.trim() && (
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-90 ${
                    isListening
                      ? "bg-rose-950/40 border-rose-800 text-rose-400 animate-pulse"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Voice dictation"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Submit Send Button */}
              <button
                type="button"
                onClick={() => input.trim() && !isLoading && onSend()}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-xl transition-all flex items-center justify-center border ${
                  input.trim() && !isLoading
                    ? "cursor-pointer active:scale-90 hover:scale-105 border-transparent text-white shadow-md"
                    : "cursor-not-allowed opacity-30 bg-zinc-950 border-zinc-800 text-zinc-600"
                }`}
                style={{
                  backgroundColor: input.trim() && !isLoading ? accentColor : undefined
                }}
                title="Send Message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                ) : (
                  <ArrowUp className="w-4 h-4 font-bold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
