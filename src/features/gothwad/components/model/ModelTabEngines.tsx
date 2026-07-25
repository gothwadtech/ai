import React from "react";
import { Cpu, Check, Trash2 } from "lucide-react";
import { GothwadModelItem } from "../GothwadModel";

interface ModelTabEnginesProps {
  allModels: GothwadModelItem[];
  selectedModel: string;
  accentColor: string;
  onSelectModel: (id: string) => void;
  onDeleteCustomModel: (id: string, e: React.MouseEvent) => void;
}

export default function ModelTabEngines({
  allModels,
  selectedModel,
  accentColor,
  onSelectModel,
  onDeleteCustomModel,
}: ModelTabEnginesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
      {allModels.map((m) => {
        const isSelected = selectedModel === m.id;
        return (
          <div
            key={m.id}
            onClick={() => onSelectModel(m.id)}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 relative group ${
              isSelected
                ? "bg-zinc-800/80 border-zinc-650 shadow-md"
                : "bg-zinc-930/50 border-zinc-850 hover:border-zinc-750 hover:bg-zinc-900/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                <span className="text-xs font-bold text-zinc-100 truncate">{m.name}</span>
                {m.tag && (
                  <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-750 text-zinc-400 font-mono shrink-0">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {m.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => onDeleteCustomModel(m.id, e)}
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                    title="Delete custom model"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {isSelected && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-zinc-950 shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans line-clamp-2">{m.desc}</p>
            <div className="text-[8.5px] font-mono text-zinc-500 truncate pt-0.5">{m.id}</div>
          </div>
        );
      })}
    </div>
  );
}
