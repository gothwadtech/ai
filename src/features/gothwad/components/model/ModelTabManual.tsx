import React from "react";
import { PlusCircle } from "lucide-react";

interface ModelTabManualProps {
  customModelId: string;
  setCustomModelId: (val: string) => void;
  customModelName: string;
  setCustomModelName: (val: string) => void;
  customModelDesc: string;
  setCustomModelDesc: (val: string) => void;
  customError: string | null;
  onAddCustomModel: () => void;
  accentColor: string;
}

export default function ModelTabManual({
  customModelId,
  setCustomModelId,
  customModelName,
  setCustomModelName,
  customModelDesc,
  setCustomModelDesc,
  customError,
  onAddCustomModel,
  accentColor,
}: ModelTabManualProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs no-scrollbar">
      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Model Identifier ID *
        </label>
        <input
          type="text"
          value={customModelId}
          onChange={(e) => setCustomModelId(e.target.value)}
          placeholder="e.g. meta-llama/llama-3-8b-instruct"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 font-mono text-[11px] outline-none focus:border-zinc-650"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Display Label *
        </label>
        <input
          type="text"
          value={customModelName}
          onChange={(e) => setCustomModelName(e.target.value)}
          placeholder="e.g. Llama 3 8B Instruct"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 font-mono text-[11px] outline-none focus:border-zinc-650"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Description (Optional)
        </label>
        <textarea
          rows={2}
          value={customModelDesc}
          onChange={(e) => setCustomModelDesc(e.target.value)}
          placeholder="Short summary of capability..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-[11px] outline-none focus:border-zinc-650 resize-none"
        />
      </div>

      {customError && (
        <div className="text-[10px] text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2 rounded-xl">
          {customError}
        </div>
      )}

      <button
        type="button"
        onClick={onAddCustomModel}
        className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-zinc-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-md mt-2"
        style={{ backgroundColor: accentColor }}
      >
        <PlusCircle className="w-4 h-4" />
        <span>Register Custom Model</span>
      </button>
    </div>
  );
}
