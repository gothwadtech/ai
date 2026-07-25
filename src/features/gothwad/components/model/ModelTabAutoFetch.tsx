import React from "react";
import { Key, Globe, Loader2, Zap, CheckCircle2, Search, CheckSquare, Square, Download } from "lucide-react";
import { PROVIDERS, FetchedModel } from "../../../../services/providerModels";

interface ModelTabAutoFetchProps {
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  providerKeyInput: string;
  setProviderKeyInput: (val: string) => void;
  providerEndpointInput: string;
  setProviderEndpointInput: (val: string) => void;
  isFetchingModels: boolean;
  fetchError: string | null;
  importSuccessMsg: string | null;
  fetchedModels: FetchedModel[];
  selectedFetchedIds: Set<string>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterType: "all" | "free" | "coding";
  setFilterType: (val: "all" | "free" | "coding") => void;
  filteredFetchedModels: FetchedModel[];
  onRunAutoFetch: () => void;
  onToggleSelectFetchedModel: (id: string) => void;
  onSelectAllFiltered: () => void;
  onDeselectAll: () => void;
  onImportSelected: () => void;
  accentColor: string;
}

export default function ModelTabAutoFetch({
  selectedProviderId,
  setSelectedProviderId,
  providerKeyInput,
  setProviderKeyInput,
  providerEndpointInput,
  setProviderEndpointInput,
  isFetchingModels,
  fetchError,
  importSuccessMsg,
  fetchedModels,
  selectedFetchedIds,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filteredFetchedModels,
  onRunAutoFetch,
  onToggleSelectFetchedModel,
  onSelectAllFiltered,
  onDeselectAll,
  onImportSelected,
  accentColor,
}: ModelTabAutoFetchProps) {
  const activeProviderObj = PROVIDERS.find((p) => p.id === selectedProviderId) || PROVIDERS[0];

  return (
    <div className="space-y-3.5 font-sans">
      <div className="space-y-1.5">
        <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>1. Select AI Provider</span>
          <span className="text-[8px] text-zinc-500">{PROVIDERS.length} Supported</span>
        </label>
        
        <select
          value={selectedProviderId}
          onChange={(e) => setSelectedProviderId(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono text-[11px] cursor-pointer"
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.badge} {p.name}
            </option>
          ))}
        </select>
        <p className="text-[9px] text-zinc-500 leading-relaxed">
          {activeProviderObj.desc}
        </p>
      </div>

      <div className="space-y-2 bg-zinc-950/50 border border-zinc-850/80 rounded-xl p-2.5">
        {activeProviderObj.requiresKey && (
          <div className="space-y-1">
            <label className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Key className="w-2.5 h-2.5" />
              {activeProviderObj.name} API Key
            </label>
            <input
              type="password"
              placeholder={activeProviderObj.keyPlaceholder}
              value={providerKeyInput}
              onChange={(e) => setProviderKeyInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono text-[10px]"
            />
          </div>
        )}

        {!activeProviderObj.requiresKey && activeProviderObj.keyStorageKey && (
          <div className="space-y-1">
            <label className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Key className="w-2.5 h-2.5" />
              API Key (Optional)
            </label>
            <input
              type="password"
              placeholder={activeProviderObj.keyPlaceholder}
              value={providerKeyInput}
              onChange={(e) => setProviderKeyInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono text-[10px]"
            />
          </div>
        )}

        {(selectedProviderId === "custom" || selectedProviderId === "ollama") && (
          <div className="space-y-1">
            <label className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              Endpoint URL
            </label>
            <input
              type="text"
              placeholder="http://localhost:11434/api/tags"
              value={providerEndpointInput}
              onChange={(e) => setProviderEndpointInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono text-[10px]"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onRunAutoFetch}
          disabled={isFetchingModels}
          className="w-full mt-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all cursor-pointer text-[10px] active:scale-98 disabled:opacity-50"
        >
          {isFetchingModels ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Fetching Live Models...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Fetch Models from {activeProviderObj.name}</span>
            </>
          )}
        </button>
      </div>

      {fetchError && (
        <div className="bg-rose-950/40 border border-rose-900/60 text-rose-300 p-2.5 rounded-xl text-[9.5px] leading-relaxed">
          ✕ {fetchError}
        </div>
      )}

      {importSuccessMsg && (
        <div className="bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 p-2.5 rounded-xl text-[9.5px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {fetchedModels.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-zinc-850">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono font-bold text-zinc-200">
              Fetched {fetchedModels.length} Models
            </span>
            <span className="text-[8.5px] text-amber-400 font-bold">
              {selectedFetchedIds.size} Selected
            </span>
          </div>

          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search e.g. llama, deepseek, free, coding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-7 pr-2.5 text-zinc-200 text-[10px] focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[8.5px] font-mono">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                filterType === "all" ? "bg-zinc-750 text-white font-bold" : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All ({fetchedModels.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("free")}
              className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                filterType === "free" ? "bg-zinc-750 text-emerald-300 font-bold" : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Free Only
            </button>
            <button
              type="button"
              onClick={() => setFilterType("coding")}
              className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                filterType === "coding" ? "bg-zinc-750 text-indigo-300 font-bold" : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Coding / Reasoning
            </button>
          </div>

          <div className="flex items-center justify-between text-[8.5px] text-zinc-500 font-mono">
            <button
              type="button"
              onClick={onSelectAllFiltered}
              className="hover:text-zinc-300 cursor-pointer underline"
            >
              Select All Filtered ({filteredFetchedModels.length})
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="hover:text-zinc-300 cursor-pointer underline"
            >
              Deselect All
            </button>
          </div>

          <div className="space-y-1 max-h-[220px] overflow-y-auto no-scrollbar border border-zinc-850 rounded-xl p-1.5 bg-zinc-950/40">
            {filteredFetchedModels.map((m) => {
              const isChecked = selectedFetchedIds.has(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onToggleSelectFetchedModel(m.id)}
                  className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                    isChecked
                      ? "bg-zinc-850/80 border-amber-500/30 text-zinc-100"
                      : "bg-transparent border-transparent hover:bg-zinc-900/50 text-zinc-400"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-amber-400">
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-zinc-600" />}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold text-zinc-200 truncate">{m.name}</span>
                      <span className="text-[7.5px] font-bold px-1 rounded bg-zinc-900 text-zinc-400 shrink-0">
                        {m.tag}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 truncate">{m.id}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onImportSelected}
            disabled={selectedFetchedIds.size === 0}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-zinc-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-md disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
          >
            <Download className="w-4 h-4" />
            <span>Import Selected ({selectedFetchedIds.size})</span>
          </button>
        </div>
      )}
    </div>
  );
}
