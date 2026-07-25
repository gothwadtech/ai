import React, { useState, useEffect } from "react";
import { Cpu, X, Plus, Zap } from "lucide-react";
import { safeStorage } from "../../../utils/safeStorage";
import { PROVIDERS, fetchModelsFromProvider, FetchedModel } from "../../../services/providerModels";
import ModelTabEngines from "./model/ModelTabEngines";
import ModelTabManual from "./model/ModelTabManual";
import ModelTabAutoFetch from "./model/ModelTabAutoFetch";

export interface GothwadModelItem {
  id: string;
  name: string;
  desc: string;
  tag: string;
  isCustom?: boolean;
}

export const BASE_SUPPORTED_MODELS: GothwadModelItem[] = [
  { name: "Gemini 2.5 Flash", id: "google/gemini-2.5-flash", desc: "Super-fast generalist & multimodal", tag: "Fastest" },
  { name: "DeepSeek R1 Reasoning", id: "deepseek/deepseek-r1", desc: "Complex mathematical, code, and logic reasoning", tag: "Thinking" },
  { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet", desc: "Elite coding assistance & beautiful prose", tag: "Premium" },
  { name: "Llama 3.3 70B Instruct", id: "meta-llama/llama-3.3-70b-instruct", desc: "High-context conversational balance", tag: "Open Source" },
  { name: "Qwen 2.5 Coder 32B", id: "qwen/qwen-2.5-coder-32b-instruct", desc: "Specialist in syntax and software bugs", tag: "Coding" }
];

interface GothwadModelProps {
  accentColor: string;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

type TabType = "engines" | "auto_fetch" | "manual";

export default function GothwadModel({
  accentColor,
  selectedModel,
  onSelectModel,
  onClose,
  isOpen
}: GothwadModelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("engines");

  const [customModels, setCustomModels] = useState<GothwadModelItem[]>(() => {
    try {
      const saved = safeStorage.getItem("gothwad_custom_models");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [customModelId, setCustomModelId] = useState("");
  const [customModelName, setCustomModelName] = useState("");
  const [customModelDesc, setCustomModelDesc] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  const [selectedProviderId, setSelectedProviderId] = useState<string>("openrouter");
  const [providerKeyInput, setProviderKeyInput] = useState<string>("");
  const [providerEndpointInput, setProviderEndpointInput] = useState<string>("");
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedModels, setFetchedModels] = useState<FetchedModel[]>([]);
  const [selectedFetchedIds, setSelectedFetchedIds] = useState<Set<string>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "free" | "coding">("all");
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const p = PROVIDERS.find(p => p.id === selectedProviderId) || PROVIDERS[0];
    const savedKey = p.keyStorageKey ? safeStorage.getItem(p.keyStorageKey) || "" : "";
    setProviderKeyInput(savedKey);
    setProviderEndpointInput(p.defaultEndpoint);
    setFetchError(null);
  }, [selectedProviderId]);

  useEffect(() => {
    try {
      safeStorage.setItem("gothwad_custom_models", JSON.stringify(customModels));
    } catch (e) {}
  }, [customModels]);

  if (!isOpen) return null;

  const handleAddCustomModel = () => {
    if (!customModelId.trim()) {
      setCustomError("Model ID is required.");
      return;
    }
    if (!customModelName.trim()) {
      setCustomError("Display label is required.");
      return;
    }

    const trimmedId = customModelId.trim();
    const isDuplicate = 
      BASE_SUPPORTED_MODELS.some(m => m.id === trimmedId) || 
      customModels.some(m => m.id === trimmedId);

    if (isDuplicate) {
      setCustomError("A model with this ID is already registered.");
      return;
    }

    const newModel: GothwadModelItem = {
      id: trimmedId,
      name: customModelName.trim(),
      desc: customModelDesc.trim() || "User registered custom AI engine.",
      tag: "Custom",
      isCustom: true
    };

    setCustomModels(prev => [...prev, newModel]);
    onSelectModel(trimmedId);

    setCustomModelId("");
    setCustomModelName("");
    setCustomModelDesc("");
    setCustomError(null);
    setActiveTab("engines");
  };

  const handleDeleteCustomModel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomModels(prev => prev.filter(m => m.id !== id));
    if (selectedModel === id) {
      onSelectModel(BASE_SUPPORTED_MODELS[0].id);
    }
  };

  const handleRunAutoFetch = async () => {
    setIsFetchingModels(true);
    setFetchError(null);
    setImportSuccessMsg(null);
    setFetchedModels([]);
    setSelectedFetchedIds(new Set());

    const p = PROVIDERS.find(prov => prov.id === selectedProviderId);

    if (providerKeyInput.trim() && p?.keyStorageKey) {
      safeStorage.setItem(p.keyStorageKey, providerKeyInput.trim());
    }

    try {
      const models = await fetchModelsFromProvider(
        selectedProviderId,
        providerKeyInput,
        providerEndpointInput
      );
      setFetchedModels(models);

      const defaultSelected = new Set<string>();
      models.slice(0, 30).forEach(m => defaultSelected.add(m.id));
      setSelectedFetchedIds(defaultSelected);

      if (models.length === 0) {
        setFetchError("No models were returned by the provider API.");
      }
    } catch (err: any) {
      setFetchError(err.message || "Failed to fetch models from provider.");
    } finally {
      setIsFetchingModels(false);
    }
  };

  const toggleSelectFetchedModel = (id: string) => {
    setSelectedFetchedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFetchedModels = fetchedModels.filter(m => {
    const matchesSearch = 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "free") {
      return m.isFree || m.id.includes(":free") || m.tag === "Free";
    }
    if (filterType === "coding") {
      const lower = m.id.toLowerCase();
      return lower.includes("code") || lower.includes("coder") || lower.includes("deepseek") || lower.includes("llama-3.3") || lower.includes("qwen") || lower.includes("sonnet");
    }
    return true;
  });

  const handleSelectAllFiltered = () => {
    setSelectedFetchedIds(prev => {
      const next = new Set(prev);
      filteredFetchedModels.forEach(m => next.add(m.id));
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedFetchedIds(new Set());
  };

  const handleImportSelected = () => {
    const modelsToImport = fetchedModels.filter(m => selectedFetchedIds.has(m.id));
    if (modelsToImport.length === 0) return;

    const existingIds = new Set([
      ...BASE_SUPPORTED_MODELS.map(m => m.id),
      ...customModels.map(m => m.id)
    ]);

    const newItems: GothwadModelItem[] = [];

    modelsToImport.forEach(m => {
      if (!existingIds.has(m.id)) {
        newItems.push({
          id: m.id,
          name: m.name,
          desc: m.desc,
          tag: m.tag || "Auto",
          isCustom: true
        });
        existingIds.add(m.id);
      }
    });

    if (newItems.length > 0) {
      setCustomModels(prev => [...prev, ...newItems]);
      onSelectModel(newItems[0].id);
    }

    setImportSuccessMsg(`Successfully imported ${newItems.length} models!`);
    setTimeout(() => {
      setActiveTab("engines");
      setImportSuccessMsg(null);
    }, 1200);
  };

  const allModels = [...BASE_SUPPORTED_MODELS, ...customModels];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] transition-opacity duration-150 animate-fade-in" 
        onClick={onClose} 
      />
      
      <div 
        className="fixed left-0 top-0 bottom-0 w-[340px] max-w-[90vw] bg-zinc-900 border-r border-zinc-850 z-[101] shadow-2xl flex flex-col h-full animate-slide-in-left select-none overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-13 px-4 flex items-center justify-between border-b border-zinc-850 bg-zinc-930/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Cpu className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-200 truncate">
              Engine Model Hub
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 rounded-lg cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center p-2 border-b border-zinc-850 bg-zinc-950/40 gap-1 shrink-0 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab("engines")}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "engines"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50"
            }`}
          >
            <Cpu className="w-3 h-3" style={activeTab === "engines" ? { color: accentColor } : {}} />
            <span>Active ({allModels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auto_fetch")}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "auto_fetch"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50"
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Auto-Fetch</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "manual"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50"
            }`}
            title="Manual Add"
          >
            <Plus className="w-3 h-3" />
            <span>Custom</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-4 text-xs">
          {activeTab === "engines" && (
            <ModelTabEngines
              allModels={allModels}
              selectedModel={selectedModel}
              accentColor={accentColor}
              onSelectModel={onSelectModel}
              onDeleteCustomModel={handleDeleteCustomModel}
            />
          )}

          {activeTab === "auto_fetch" && (
            <ModelTabAutoFetch
              selectedProviderId={selectedProviderId}
              setSelectedProviderId={setSelectedProviderId}
              providerKeyInput={providerKeyInput}
              setProviderKeyInput={setProviderKeyInput}
              providerEndpointInput={providerEndpointInput}
              setProviderEndpointInput={setProviderEndpointInput}
              isFetchingModels={isFetchingModels}
              fetchError={fetchError}
              importSuccessMsg={importSuccessMsg}
              fetchedModels={fetchedModels}
              selectedFetchedIds={selectedFetchedIds}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filteredFetchedModels={filteredFetchedModels}
              onRunAutoFetch={handleRunAutoFetch}
              onToggleSelectFetchedModel={toggleSelectFetchedModel}
              onSelectAllFiltered={handleSelectAllFiltered}
              onDeselectAll={handleDeselectAll}
              onImportSelected={handleImportSelected}
              accentColor={accentColor}
            />
          )}

          {activeTab === "manual" && (
            <ModelTabManual
              customModelId={customModelId}
              setCustomModelId={setCustomModelId}
              customModelName={customModelName}
              setCustomModelName={setCustomModelName}
              customModelDesc={customModelDesc}
              setCustomModelDesc={setCustomModelDesc}
              customError={customError}
              onAddCustomModel={handleAddCustomModel}
              accentColor={accentColor}
            />
          )}
        </div>
      </div>
    </>
  );
}
