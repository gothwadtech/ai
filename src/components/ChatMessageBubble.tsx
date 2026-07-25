import React from "react";
import { Copy, Check } from "lucide-react";
import { parseMarkdown } from "./chat/markdownParser";
import ChatCodeBlock from "./chat/ChatCodeBlock";
import ChatFormattedText from "./chat/ChatFormattedText";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date | number | string;
  agent?: string;
  keyStatus?: "custom" | "server" | "missing";
  durationSec?: number;
}

const MODELS_MAP = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B" },
  { value: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron 550B" },
  { value: "deepseek/deepseek-r1:free", label: "DeepSeek R1" },
  { value: "qwen/qwen-2.5-coder-32b-instruct:free", label: "Qwen 2.5 Coder" },
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" }
];

function getModelLabel(modelKey: string | undefined): string {
  if (!modelKey) return "Gothwad AI";
  const found = MODELS_MAP.find(m => m.value === modelKey);
  if (found) return found.label;
  
  const parts = modelKey.split("/");
  let name = parts[parts.length - 1];
  if (name.includes(":")) {
    name = name.split(":")[0];
  }
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface ChatMessageBubbleProps {
  msg: Message;
  accentColor: string;
  agents?: any;
  selectedAgent?: string;
  copiedId: string | null;
  onCopyText: (text: string, id: string) => void;
  onApplyToEditor?: (code: string, id: string) => void;
  isMobile?: boolean;
}

export default function ChatMessageBubble({
  msg,
  copiedId,
  onCopyText,
  onApplyToEditor,
}: ChatMessageBubbleProps) {
  const isUser = msg.role === "user";

  return (
    <div className="flex flex-col w-full space-y-3 pb-8 border-b-2 border-zinc-800/80 last:border-b-0">
      {/* Header Avatar and Label Row */}
      <div className={`flex items-center gap-1.5 px-1 select-none ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm bg-transparent">
          <img 
            src="/icon-512.png" 
            alt={isUser ? "User" : getModelLabel(msg.agent)} 
            className="w-full h-full object-cover filter brightness-110" 
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-zinc-200">
          {isUser ? "USER" : getModelLabel(msg.agent)}
        </span>
        {!isUser && (
          <span className="ml-2 text-[10px] font-mono font-extrabold uppercase tracking-wider text-zinc-200">
            WORKED FOR {msg.durationSec !== undefined ? msg.durationSec : "0.0"} SECONDS
          </span>
        )}
      </div>

      {/* Message Body Bubble */}
      <div className={`w-full ${isUser ? "flex justify-end" : ""}`}>
        {isUser ? (
          <div className="bg-zinc-900/85 border border-zinc-800 text-zinc-100 rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] sm:max-w-xl shadow-md select-text text-sm sm:text-[14.5px] leading-relaxed mb-1">
            {msg.content}
          </div>
        ) : (
          <div className="bg-transparent text-zinc-300 p-0 w-full select-text leading-relaxed">
            {parseMarkdown(msg.content).map((block, idx) => {
              if (block.type === "code") {
                const blockId = `${msg.id}-block-${idx}`;
                return (
                  <ChatCodeBlock
                    key={idx}
                    language={block.language}
                    content={block.content}
                    blockId={blockId}
                    copiedId={copiedId}
                    onCopyText={onCopyText}
                    onApplyToEditor={onApplyToEditor}
                  />
                );
              }

              return <ChatFormattedText key={idx} content={block.content} />;
            })}

            {/* Key Status Indicator */}
            {msg.keyStatus && (
              <div className="mt-2.5 pt-1.5 border-t border-zinc-850/60 flex items-center justify-between text-[8px] font-mono select-none text-zinc-500">
                <span className="flex items-center gap-1">
                  {msg.keyStatus === "custom" ? (
                    <span className="text-emerald-400 font-bold bg-emerald-950/20 px-1 py-0.5 rounded border border-emerald-900/30">
                      🟢 Active: Custom OpenRouter API Key (Unlimited Usage)
                    </span>
                  ) : msg.keyStatus === "server" ? (
                    <span className="text-blue-400 font-bold bg-blue-950/20 px-1 py-0.5 rounded border border-blue-900/30">
                      🔵 Active: Server Environment (.env) Key
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-bold bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
                      ⚪ Active: Default Server Key
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Timestamp & Copy Meta */}
        <div className={`flex items-center gap-3 px-1.5 text-[9.5px] font-mono text-zinc-550 ${isUser ? "justify-end" : ""}`}>
          <span>
            {msg.timestamp instanceof Date 
              ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          </span>
          {!isUser && (
            <button
              type="button"
              onClick={() => onCopyText(msg.content, msg.id)}
              className="hover:text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedId === msg.id ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
