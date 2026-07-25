import React, { useState } from "react";
import { Key, Eye, EyeOff, Check, ExternalLink, Cpu } from "lucide-react";

interface ApiKeysSettingsProps {
  customApiKey: string;
  onSetCustomApiKey: (key: string) => void;
  groqApiKey: string;
  onSetGroqApiKey: (key: string) => void;
  accentColor: string;
}

export default function ApiKeysSettings({
  customApiKey,
  onSetCustomApiKey,
  groqApiKey,
  onSetGroqApiKey,
  accentColor,
}: ApiKeysSettingsProps) {
  const [showOpenRouter, setShowOpenRouter] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [savedRouterMessage, setSavedRouterMessage] = useState(false);
  const [savedGroqMessage, setSavedGroqMessage] = useState(false);

  const handleSaveRouter = () => {
    setSavedRouterMessage(true);
    setTimeout(() => setSavedRouterMessage(false), 2000);
  };

  const handleSaveGroq = () => {
    setSavedGroqMessage(true);
    setTimeout(() => setSavedGroqMessage(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>API Credentials & AI Keys</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Provide your custom API keys for unlimited rate limits and model acceleration.
        </p>
      </div>

      {/* OpenRouter API Key */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
              OR
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase">OpenRouter Key</span>
              <p className="text-[10px] text-zinc-400">Powers all LLMs & Software Builder models</p>
            </div>
          </div>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Get Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="relative flex items-center">
          <input
            type={showOpenRouter ? "text" : "password"}
            value={customApiKey}
            onChange={(e) => onSetCustomApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 pr-20 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowOpenRouter(!showOpenRouter)}
            className="absolute right-12 text-zinc-500 hover:text-zinc-300 p-1"
          >
            {showOpenRouter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleSaveRouter}
            className="absolute right-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer"
          >
            {savedRouterMessage ? <Check className="w-3 h-3 text-white" /> : "Save"}
          </button>
        </div>
      </div>

      {/* Groq API Key */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase">Groq LPU Key</span>
              <p className="text-[10px] text-zinc-400">Ultra-fast inference speed</p>
            </div>
          </div>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-mono text-orange-400 hover:underline flex items-center gap-1"
          >
            <span>Get Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="relative flex items-center">
          <input
            type={showGroq ? "text" : "password"}
            value={groqApiKey}
            onChange={(e) => onSetGroqApiKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 pr-20 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowGroq(!showGroq)}
            className="absolute right-12 text-zinc-500 hover:text-zinc-300 p-1"
          >
            {showGroq ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleSaveGroq}
            className="absolute right-2 px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer"
          >
            {savedGroqMessage ? <Check className="w-3 h-3 text-white" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
