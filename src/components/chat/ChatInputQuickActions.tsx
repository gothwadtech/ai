import React from "react";
import { BookOpen, Bug } from "lucide-react";
import { GrixFileNode } from "../../types/github";

interface ChatInputQuickActionsProps {
  activeFile: GrixFileNode | null;
  isLoading: boolean;
  onSend: (customPrompt?: string) => void;
}

export default function ChatInputQuickActions({
  activeFile,
  isLoading,
  onSend,
}: ChatInputQuickActionsProps) {
  if (!activeFile || !onSend) return null;

  return (
    <div className="max-w-3xl mx-auto w-full mb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-500 shrink-0">
        File Actions ({activeFile.name}):
      </span>
      <button
        type="button"
        disabled={isLoading}
        onClick={() =>
          onSend(`Explain the contents of this active file: ${activeFile.name}. Give a clear, detailed breakdown.`)
        }
        className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-850/80 text-[10px] font-mono text-zinc-300 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow-xs"
      >
        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">Explain File</span>
      </button>
      <button
        type="button"
        disabled={isLoading}
        onClick={() =>
          onSend(
            `Audit and scan the active file: ${activeFile.name} for bugs, edge-cases, memory leaks, or logical errors. Suggest direct code fixes.`
          )
        }
        className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-850/80 text-[10px] font-mono text-zinc-300 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow-xs"
      >
        <Bug className="w-3.5 h-3.5 text-rose-400" />
        <span className="font-semibold">Audit Bugs</span>
      </button>
    </div>
  );
}
