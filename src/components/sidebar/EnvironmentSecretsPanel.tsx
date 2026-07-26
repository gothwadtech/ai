import React, { useState, useEffect } from "react";
import { 
  Key, Plus, Trash2, Eye, EyeOff, Check, 
  Copy, Download, Upload, Lock, X, Menu
} from "lucide-react";
import { safeStorage } from "../../utils/safeStorage";
import GlobalStudioHeader from "../GlobalStudioHeader";

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
  onBack?: () => void;
  onToggleSidebar?: () => void;
}

export default function EnvironmentSecretsPanel({
  accentColor = "#375a7f",
  customApiKey = "",
  onSetCustomApiKey,
  groqApiKey = "",
  onSetGroqApiKey,
  onBack,
  onToggleSidebar
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
      { key: "API_KEY", value: customApiKey || safeStorage.getItem("gothwad_openrouter_api_key") || "", description: "Active API key", isCustom: false },
      { key: "VITE_API_BASE_URL", value: "https://api.gothwad.ai/v1", description: "Default proxy target URL", isCustom: false }
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
      
      const apiKeySecret = secrets.find(s => s.key === "API_KEY" || s.key === "OPENROUTER_API_KEY");
      if (apiKeySecret && onSetCustomApiKey) {
        onSetCustomApiKey(apiKeySecret.value);
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
      return [...prev, { key: formattedKey, value: newValue, description: newDesc || "Environment variable", isCustom: true }];
    });

    setNewKey("");
    setNewValue("");
    setNewDesc("");
    setShowAddModal(false);
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
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.substring(1, v.length - 1);
        }
        if (k) {
          const idx = parsedSecrets.findIndex(s => s.key === k);
          if (idx >= 0) {
            parsedSecrets[idx] = { ...parsedSecrets[idx], value: v };
          } else {
            parsedSecrets.push({ key: k, value: v, description: "Imported variable", isCustom: true });
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
    <div className="w-full font-sans select-none flex flex-col h-full overflow-hidden">
      
      {/* Top Floating Global Studio Header */}
      <GlobalStudioHeader
        title="ENVIRONMENT SELECT"
        badge="Manage your keys"
        onToggleSidebar={onToggleSidebar}
        rightContent={
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Plus Icon Button */}
            <button
              type="button"
              onClick={() => {
                setNewKey("");
                setNewValue("");
                setNewDesc("");
                setShowAddModal(true);
              }}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
              title="Add New Secret"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Import Icon Button */}
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
              title="Import .env"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Export / Copy .env Icon Button */}
            <button
              type="button"
              onClick={() => copyToClipboard(exportEnvFormat())}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
              title="Export / Copy .env"
            >
              {copiedEnv ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        }
      />

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Search Bar & Filter */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys..."
              className="w-full bg-zinc-900 border border-zinc-850 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2 text-[10.5px] font-mono focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>

          {/* Secrets List */}
      <div className="space-y-2">
        {filteredSecrets.length === 0 ? (
          <div className="bg-zinc-930/40 border border-dashed border-zinc-850 rounded-xl p-8 text-center space-y-2">
            <Lock className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="text-xs font-mono text-zinc-400 font-bold">No keys found</p>
            <p className="text-[10px] font-mono text-zinc-600 max-w-sm mx-auto">
              Add environment variables using the plus (+) button above.
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
                        Set
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
                    placeholder={`Value for ${item.key}...`}
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-[10.5px] font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-650 transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
        </div>
      </div>

      {/* Add Secret Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Add Key</h3>
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
                  placeholder="e.g. API_KEY"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Value</label>
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter key value..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Description (Optional)</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short description..."
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
                  Save Key
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
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Import .env Block</h3>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <textarea
                value={envTextImport}
                onChange={(e) => setEnvTextImport(e.target.value)}
                placeholder={`KEY_NAME=value\nANOTHER_KEY=value`}
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
                  Import Keys
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
