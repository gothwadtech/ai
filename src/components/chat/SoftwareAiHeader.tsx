import React, { useState } from "react";
import { Menu, ChevronDown, Plus, SlidersHorizontal, X, Check, Cpu, History } from "lucide-react";

export interface SoftwareAiHeaderModelOption {
  value: string;
  label: string;
  desc?: string;
  tag?: string;
}

export interface SoftwareAiHeaderProps {
  title?: string;
  activeModelLabel: string;
  
  // Model Menu triggers / Popover options
  onOpenModelMenu?: () => void; // Used if parent opens custom modal (like GothwadModel)
  modelsList?: SoftwareAiHeaderModelOption[]; // Used if header renders built-in dropdown
  onSelectModel?: (modelValue: string) => void;
  
  // Navigation & Sidebars
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  onOpenMobileMenu?: () => void;

  // Recent Conversations History Sidebar
  showHistory?: boolean;
  onToggleHistory?: () => void;
  
  // Session & Settings Controls
  showSettings?: boolean;
  onToggleSettings?: () => void;
  onNewSession: () => void;
  onClosePanel?: () => void;
  
  accentColor?: string;
}

export default function SoftwareAiHeader({
  title = "Gothwad AI Companion",
  activeModelLabel,
  onOpenModelMenu,
  modelsList = [],
  onSelectModel,
  showSidebar,
  onToggleSidebar,
  isMobile = false,
  onOpenMobileMenu,
  showHistory,
  onToggleHistory,
  showSettings,
  onToggleSettings,
  onNewSession,
  onClosePanel,
  accentColor = "#3b82f6"
}: SoftwareAiHeaderProps) {
  const [internalDropdownOpen, setInternalDropdownOpen] = useState(false);

  const handleModelButtonClick = () => {
    if (onOpenModelMenu) {
      onOpenModelMenu();
    } else if (modelsList.length > 0) {
      setInternalDropdownOpen(!internalDropdownOpen);
    }
  };

  return (
    <header className="relative shrink-0 select-none w-full pt-1 pb-0.5 px-2 sm:px-3 z-30">
      {/* Standard Width Container matching Chat Input Bar */}
      <div className="max-w-3xl mx-auto w-full">
        {/* Curved Capsule Header Container */}
        <div className="relative border border-zinc-800/80 rounded-2xl bg-zinc-900/90 backdrop-blur-md px-2 h-[54px] flex items-center justify-between gap-2 shadow-xl">
        {/* Left Section: Menu trigger + Title & Model Selector */}
        {/* Left Section: Menu trigger + Title & Model Selector */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Mobile Menu Trigger */}
          {isMobile && onOpenMobileMenu ? (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          ) : onToggleSidebar ? (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center ${
                showSidebar
                  ? "bg-zinc-850 border-zinc-700 text-zinc-100"
                  : "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
              title="Toggle Primary Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          ) : null}

          {/* Title & Model Dropdown Trigger */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-[11.5px] font-mono font-bold tracking-tight text-zinc-100 uppercase truncate">
              {title}
            </h2>

            <div className="relative mt-0.5">
              <button
                type="button"
                onClick={handleModelButtonClick}
                className="flex items-center gap-1 text-[8.5px] font-mono text-zinc-400 hover:text-zinc-200 uppercase tracking-wider select-none transition-all duration-150 cursor-pointer group"
                title="Change AI Engine Model"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate max-w-[150px] sm:max-w-[220px] font-semibold text-zinc-300 group-hover:text-white">
                  {activeModelLabel}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-500 shrink-0 ml-0.5 group-hover:text-zinc-300 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* History / Sessions Toggle */}
          {onToggleHistory && (
            <button
              type="button"
              onClick={onToggleHistory}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0 ${
                showHistory
                  ? "bg-zinc-850 border-zinc-700 text-white shadow-inner"
                  : "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
              title="Toggle Chat History & Sessions"
            >
              <History className="w-4 h-4" />
            </button>
          )}

          {/* Create New Session (+) Button */}
          <button
            type="button"
            onClick={onNewSession}
            className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-xs"
            title="Create New Conversation"
          >
            <Plus className="w-4 h-4" style={{ color: accentColor }} />
          </button>

          {/* Parameters / Settings Sidebar Toggle */}
          {onToggleSettings && (
            <button
              type="button"
              onClick={onToggleSettings}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0 ${
                showSettings
                  ? "bg-zinc-850 border-zinc-700 text-white shadow-inner"
                  : "bg-zinc-950 hover:bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
              title="Toggle Parameters & System Prompt"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Close Panel Button */}
          {onClosePanel && (
            <button
              type="button"
              onClick={onClosePanel}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Built-in Model Dropdown Popover (if modelsList is provided) */}
      {internalDropdownOpen && modelsList.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setInternalDropdownOpen(false)}
          />
          <div className="absolute top-13 left-3 sm:left-4 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 w-64 shadow-2xl z-50 flex flex-col font-mono text-[10px] animate-fade-in">
            <div className="px-2.5 py-1.5 text-[8.5px] font-mono font-extrabold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-400" />
                Select AI Engine
              </span>
              <span className="text-emerald-400 font-bold">{modelsList.length}</span>
            </div>
            
            <div className="max-h-64 overflow-y-auto no-scrollbar space-y-0.5">
              {modelsList.map((m) => {
                const cleanLabel = m.label.replace(" (Free)", "").replace(" (Standard)", "");
                const isSelected = activeModelLabel.toLowerCase() === cleanLabel.toLowerCase() || activeModelLabel === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      if (onSelectModel) onSelectModel(m.value);
                      setInternalDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-zinc-850 text-zinc-100 font-bold border border-zinc-750 shadow-xs"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate text-[10px]">{cleanLabel}</span>
                      {m.desc && <span className="text-[8px] text-zinc-500 truncate">{m.desc}</span>}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
