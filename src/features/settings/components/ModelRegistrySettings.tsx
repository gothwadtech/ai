import React, { useState } from "react";
import { Plus, Trash2, RotateCcw, Cpu } from "lucide-react";

interface ModelRegistrySettingsProps {
  appModels: any[];
  onUpdateAppModels: (models: any[]) => void;
  accentColor: string;
}

const DEFAULT_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "Fast, multi-modal, great for general tasks.", categories: ["chats", "software"] },
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (Free)", desc: "State-of-the-art open model with high intelligence.", categories: ["chats", "software"] },
  { value: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron 550B (Free)", desc: "Massive scale model for complex structural answers.", categories: ["chats", "software"] },
  { value: "deepseek/deepseek-r1:free", label: "DeepSeek R1 Reasoning (Free)", desc: "Advanced reasoning and step-by-step thinking.", categories: ["chats", "software"] },
  { value: "qwen/qwen-2.5-coder-32b-instruct:free", label: "Qwen 2.5 Coder (Free)", desc: "Optimized for programming and logic syntax.", categories: ["chats", "software"] },
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", desc: "Top-tier developer model for precise refactoring.", categories: ["chats", "software"] },
  { value: "deepseek/deepseek-chat", label: "DeepSeek V3 (Cheap Paid)", desc: "Standard intelligence general purpose model.", categories: ["software"] },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro (Standard)", desc: "Highly intelligent model, optimized for reasoning.", categories: ["software"] }
];

export default function ModelRegistrySettings({
  appModels = [],
  onUpdateAppModels,
  accentColor,
}: ModelRegistrySettingsProps) {
  const [newModelValue, setNewModelValue] = useState("");
  const [newModelLabel, setNewModelLabel] = useState("");
  const [newModelDesc, setNewModelDesc] = useState("");
  const [newModelChats, setNewModelChats] = useState(true);
  const [newModelSoftware, setNewModelSoftware] = useState(true);

  const handleResetModels = () => {
    if (window.confirm("Reset model registry to system defaults?")) {
      onUpdateAppModels(DEFAULT_MODELS);
    }
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelValue.trim() || !newModelLabel.trim()) return;

    const categories: ("chats" | "software")[] = [];
    if (newModelChats) categories.push("chats");
    if (newModelSoftware) categories.push("software");

    const newEntry = {
      value: newModelValue.trim(),
      label: newModelLabel.trim(),
      desc: newModelDesc.trim() || "Custom model configuration",
      categories: categories.length > 0 ? categories : ["chats", "software"],
    };

    onUpdateAppModels([...appModels, newEntry]);
    setNewModelValue("");
    setNewModelLabel("");
    setNewModelDesc("");
  };

  const handleDeleteModel = (value: string) => {
    onUpdateAppModels(appModels.filter((m) => m.value !== value));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Models & Custom Registry</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Configure available LLM models for Chat and Software Builder.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetModels}
          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Add New Custom Model Form */}
      <form onSubmit={handleAddModel} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide block">
          Add OpenRouter / Custom Model
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newModelValue}
            onChange={(e) => setNewModelValue(e.target.value)}
            placeholder="Model Identifier (e.g. openai/gpt-4o)"
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            required
          />
          <input
            type="text"
            value={newModelLabel}
            onChange={(e) => setNewModelLabel(e.target.value)}
            placeholder="Display Name (e.g. GPT-4o)"
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <input
          type="text"
          value={newModelDesc}
          onChange={(e) => setNewModelDesc(e.target.value)}
          placeholder="Short description (optional)"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={newModelChats}
                onChange={(e) => setNewModelChats(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-0"
              />
              <span>Chat AI</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={newModelSoftware}
                onChange={(e) => setNewModelSoftware(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-0"
              />
              <span>Software Builder</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Model</span>
          </button>
        </div>
      </form>

      {/* Models List */}
      <div className="space-y-2">
        {appModels.map((m) => (
          <div
            key={m.value}
            className="p-3 bg-zinc-900/50 border border-zinc-850 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-750 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-200 truncate">{m.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-950 text-zinc-500 border border-zinc-800 rounded uppercase">
                  {m.value}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">{m.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteModel(m.value)}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              title="Remove model"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
