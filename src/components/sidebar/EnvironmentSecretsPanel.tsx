import React, { useState, useEffect } from "react";
import { 
  Key, Plus, Trash2, Eye, EyeOff, ShieldCheck, Check, 
  Copy, Download, Upload, AlertCircle, RefreshCw, Lock, Sparkles
} from "lucide-react";
import { safeStorage } from "../../utils/safeStorage";

export interface SecretItem {
  key: string;
  value: string;
  description?: string;
  isCustom?: boolean;
}

interface EnvironmentSecretsPanelProps {
  accentColor?: string;
  customApiKey?: string;
  onSetCustomApiKey?: (key: string) => void;
  groqApiKey?: string;
  onSetGroqApiKey?: (key: string) => void;
}

const DEFAULT_PRESETS: { key: string; label: string; placeholder: string; desc: string }[] = [
  { key: "OPENROUTER_API_KEY", label: "OpenRouter API Key", placeholder: "sk-or-v1-...", desc: "Required for Gothwad AI & OpenRouter LLMs" },
  { key: "GROQ_API_KEY", label: "Groq API Key", placeholder: "gsk_...", desc: "Fast inference models via Groq Cloud" },
  { key: "GEMINI_API_KEY", label: "Google Gemini Key", placeholder: "AIzaSy...", desc: "Gemini 2.0 & Flash API capabilities" },
  { key: "GITHUB_TOKEN", label: "GitHub Personal Token", placeholder: "ghp_...", desc: "GitHub repository sync & commit actions" },
  { key: "VITE_API_BASE_URL", label: "API Base URL", placeholder: "https://api.example.com", desc: "Client-side backend proxy target" },
  { key: "STRIPE_SECRET_KEY", label: "Stripe Secret Key", placeholder: "sk_test_...", desc: "Payment checkout proxy key" },
  { key: "FIREBASE_API_KEY", label: "Firebase Web API Key", placeholder: "AIzaSy...", desc: "Firestore & Authentication credentials" }
];

export default function EnvironmentSecretsPanel({
  accentColor = "#375a7f",
  customApiKey = "",
  onSetCustomApiKey,
  groqApiKey = "",
  onSetGroqApiKey
}: EnvironmentSecretsPanelProps) {
  // Load secrets from safeStorage
  const [secrets, setSecrets] = useState<SecretItem[]>(() => {
    try {
      const saved = safeStorage.getItem("gothwad_env_secrets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial secrets list
    return [
      { key: "OPENROUTER_API_KEY", value: customApiKey || safeStorage.getItem("gothwad_openrouter_api_key") || "", description: "Active LLM engine key", isCustom: false },
      { key: "GROQ_API_KEY", value: groqApiKey || safeStorage.getItem("gothwad_groq_api_key") || "", description: "Ultra-fast Groq LLM inference", isCustom: false },
      { key: "VITE_API_BASE_URL", value: "https://api.gothwad.ai/v1", description: "Default proxy backend URL", isCustom: false },
      { key: "NODE_ENV", value: "development", description: "Container runtime mode", isCustom: false }
    ];
  });

  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // New Secret form state
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [envTextImport, setEnvTextImport] = useState("");

  // Sync secrets back to safeStorage & global key setters
  useEffect(() => {
    try {
      safeStorage.setItem("gothwad_env_secrets", JSON.stringify(secrets));
      
      // Keep main API keys in sync
      const openRouterSecret = secrets.find(s => s.key === "OPENROUTER_API_KEY");
      if (openRouterSecret && onSetCustomApiKey) {
        onSetCustomApiKey(openRouterSecret.value);
      }

      const groqSecret = secrets.find(s => s.key === "GROQ_API_KEY");
      if (groqSecret && onSetGroqApiKey) {
        onSetGroqApiKey(groqSecret.value);
      }
    } catch (e) {
      console.error(e);
    }
  }, [secrets, onSetCustomApiKey, onSetGroqApiKey]);

  const toggleVisibility = (key: string) => {
    setVisibleKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdateValue = (key: string, val: string) => {
    setSecrets(prev => prev.map(item => item.key === key ? { ...item, value: val } : item));
  };

  const handleDelete = (key: string) => {
    setSecrets(prev => prev.filter(item => item.key !== key));
  };

  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedKey = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    if (!formattedKey) return;

    setSecrets(prev => {
      const exists = prev.some(item => item.key === formattedKey);
      if (exists) {
        return prev.map(item => item.key === formattedKey ? { ...item, value: newValue, description: newDesc || item.description } : item);
      }
      return [...prev, { key: formattedKey, value: newValue, description: newDesc || "Custom environment variable", isCustom: true }];
    });

    setNewKey("");
    setNewValue("");
    setNewDesc("");
    setShowAddModal(false);
  };

  const handleSelectPreset = (preset: typeof DEFAULT_PRESETS[0]) => {
    setNewKey(preset.key);
    setNewDesc(preset.desc);

    // If key already exists, load current value
    const existing = secrets.find(s => s.key === preset.key);
    if (existing) {
      setNewValue(existing.value);
    } else {
      setNewValue("");
    }
    setShowAddModal(true);
  };

  const handleImportEnvText = () => {
    if (!envTextImport.trim()) return;
    const lines = envTextImport.split("\n");
    const parsedSecrets: SecretItem[] = [...secrets];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        const k = trimmed.substring(0, eqIndex).trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
        let v = trimmed.substring(eqIndex + 1).trim();
        // Remove quotes if present
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.substring(1, v.length - 1);
        }
        if (k) {
          const idx = parsedSecrets.findIndex(s => s.key === k);
          if (idx >= 0) {
            parsedSecrets[idx] = { ...parsedSecrets[idx], value: v };
          } else {
            parsedSecrets.push({ key: k, value: v, description: "Imported from .env", isCustom: true });
          }
        }
      }
    });

    setSecrets(parsedSecrets);
    setEnvTextImport("");
    setShowImportModal(false);
  };

  const copyToClipboard = (text: string, keyName?: string) => {
    navigator.clipboard.writeText(text);
    if (keyName) {
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  const exportEnvFormat = () => {
    return secrets.map(s => `${s.key}=${s.value}`).join("\n");
  };

  const filteredSecrets = secrets.filter(s => 
    s.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-5 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-zinc-930/90 border border-zinc-850 p-4 rounded-xl shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)` }}
            >
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">Environment Secrets & Keys</h3>
                <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active In Preview
                </span>
              </div>
              <p className="text-[9.5px] font-mono text-zinc-500 mt-1">
                Environment variables injected into server process, runtime client & web containers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(exportEnvFormat())}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy all secrets as formatted .env file"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? "Copied .env!" : "Copy .env"}</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Import .env formatted text"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Add Chips */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Quick Presets</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {DEFAULT_PRESETS.map(preset => {
            const isSet = secrets.some(s => s.key === preset.key && s.value.length > 0);
            return (
              <button
                key={preset.key}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg border text-[9.5px] font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSet 
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/30" 
                    : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                }`}
              >
                {isSet ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                <span>{preset.key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter secrets by key name or description..."
          className="flex-1 bg-zinc-900 border border-zinc-850 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2 text-[10.5px] font-mono focus:outline-none focus:border-zinc-700 transition-all"
        />
        <button
          onClick={() => {
            setNewKey("");
            setNewValue("");
            setNewDesc("");
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Secret</span>
        </button>
      </div>

      {/* Secrets List */}
      <div className="space-y-2.5">
        {filteredSecrets.length === 0 ? (
          <div className="bg-zinc-930/40 border border-dashed border-zinc-850 rounded-xl p-8 text-center space-y-2">
            <Lock className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="text-xs font-mono text-zinc-400 font-bold">No secrets found</p>
            <p className="text-[10px] font-mono text-zinc-600 max-w-sm mx-auto">
              Add your API credentials or environment parameters using the "Add Secret" button above.
            </p>
          </div>
        ) : (
          filteredSecrets.map(item => {
            const isVisible = visibleKeys[item.key] || false;
            const hasValue = item.value && item.value.trim().length > 0;

            return (
              <div 
                key={item.key}
                className="bg-zinc-900/80 border border-zinc-850 hover:border-zinc-750 p-3 rounded-xl space-y-2 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-[11px] text-zinc-200 tracking-tight truncate">
                      {item.key}
                    </span>
                    {hasValue ? (
                      <span className="text-[7.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/40 text-emerald-400">
                        Configured
                      </span>
                    ) : (
                      <span className="text-[7.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-900/40 text-amber-400">
                        Empty
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleVisibility(item.key)}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                      title={isVisible ? "Hide value" : "Reveal value"}
                    >
                      {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.value, item.key)}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                      title="Copy value"
                    >
                      {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.key)}
                      className="p-1.5 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete secret"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-[9px] font-mono text-zinc-500 leading-tight">
                    {item.description}
                  </p>
                )}

                {/* Input Value */}
                <div className="relative">
                  <input
                    type={isVisible ? "text" : "password"}
                    value={item.value}
                    onChange={(e) => handleUpdateValue(item.key, e.target.value)}
                    placeholder={`Enter value for ${item.key}...`}
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-[10.5px] font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-650 transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Secret Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Add Environment Variable</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSecret} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Key Name</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. STRIPE_SECRET_KEY"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Secret Value</label>
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter token, API key, or string..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Description (Optional)</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Production Stripe secret credential"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import .env Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Import .env File Block</h3>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Paste raw lines from your <code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-400">.env</code> or <code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-400">.env.local</code> file below. Existing matching keys will be updated automatically.
              </p>

              <textarea
                value={envTextImport}
                onChange={(e) => setEnvTextImport(e.target.value)}
                placeholder={`# Paste .env content here\nOPENROUTER_API_KEY=sk-or-v1-...\nGROQ_API_KEY=gsk_...\nPORT=3000`}
                className="w-full h-40 bg-zinc-950 border border-zinc-800 text-zinc-200 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-650 resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportEnvText}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Parse & Import Secrets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
