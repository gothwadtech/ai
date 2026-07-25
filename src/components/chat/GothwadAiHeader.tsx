import React from "react";
import { 
  Menu, SlidersHorizontal, ChevronDown, Plus, Sparkles, Cpu, Settings2, X, ChevronRight
} from "lucide-react";

export interface GothwadAiHeaderProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  activeModelLabel: string;
  onOpenModelMenu: () => void;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
  onNewSession: () => void;
  accentColor: string;
  isMobile?: boolean;
  onOpenMobileMenu?: () => void;
  onClosePanel?: () => void;
}

export default function GothwadAiHeader({
  title = "Gothwad Tech AI",
  subtitle = "Universal AI Engine",
  badgeText = "PRO",
  activeModelLabel,
  onOpenModelMenu,
  showSidebar,
  onToggleSidebar,
  showSettings,
  onToggleSettings,
  onNewSession,
  accentColor,
  isMobile = false,
  onOpenMobileMenu,
  onClosePanel,
}: GothwadAiHeaderProps) {
  return (
    <header className="pt-1 pb-0.5 px-2 sm:px-3 shrink-0 bg-transparent relative z-20 w-full select-none">
      <div className="max-w-3xl mx-auto w-full">
        {/* Glassmorphic Capsule Header Bar */}
        <div className="relative flex items-center justify-between gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 rounded-2xl px-2 h-[54px] transition-all shadow-2xl w-full">
          
          {/* Left Cluster: Sidebar Menu Button + Branding + Model Selector */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Sidebar Toggle Button for Desktop or Mobile */}
            {isMobile && onOpenMobileMenu ? (
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="w-8 h-8 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center group"
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
            ) : onToggleSidebar ? (
              <button
                type="button"
                onClick={onToggleSidebar}
                className={`w-8 h-8 rounded-xl border transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center group ${
                  showSidebar
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-inner"
                    : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 hover:border-zinc-700"
                }`}
                title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              >
                <Menu className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
            ) : null}

            {/* AI Logo & Branding Badge */}
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, #3b82f6 50%, #8b5cf6 100%)`
                }}
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex flex-col min-w-0 hidden sm:flex">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11.5px] font-mono font-bold text-white tracking-wider uppercase leading-none truncate">
                    {title}
                  </span>
                  {badgeText && (
                    <span className="px-1.5 py-0.2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-[8px] font-mono font-bold text-blue-300 rounded uppercase tracking-widest leading-none">
                      {badgeText}
                    </span>
                  )}
                </div>
                <span className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-widest truncate mt-1">
                  {subtitle}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-zinc-800 shrink-0 hidden md:block" />

            {/* Model Selector Capsule Button */}
            <button
              type="button"
              onClick={onOpenModelMenu}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/90 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer active:scale-95 min-w-0 max-w-[170px] sm:max-w-[240px] shadow-sm group"
              title="Switch Active AI Engine Model"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate font-mono font-bold tracking-tight text-[10px] uppercase">
                {activeModelLabel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-auto group-hover:text-zinc-300 transition-colors" />
            </button>
          </div>

          {/* Right Cluster: Plus New Session + Settings / Parameters Toggle + Close Panel */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Create New Session Plus Button */}
            <button
              type="button"
              onClick={onNewSession}
              className="h-8 px-2.5 bg-zinc-950/80 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-sm group"
              title="Start New Chat Session"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" style={{ color: accentColor }} />
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider hidden lg:inline">
                New Chat
              </span>
            </button>

            {/* Settings / System Parameters Toggle Button */}
            {onToggleSettings && (
              <button
                type="button"
                onClick={onToggleSettings}
                className={`w-8 h-8 rounded-xl transition-all shrink-0 flex items-center justify-center border cursor-pointer active:scale-95 relative group ${
                  showSettings
                    ? "border-purple-500/50 text-purple-300 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                    : "border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-850 hover:border-zinc-700"
                }`}
                title={showSettings ? "Close System Settings" : "Open System Settings & Parameters"}
              >
                <Settings2 className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
                {showSettings && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-zinc-900" />
                )}
              </button>
            )}

            {/* Panel Close Button (if applicable) */}
            {onClosePanel && (
              <button
                type="button"
                onClick={onClosePanel}
                className="w-8 h-8 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
                title="Close AI Companion Panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
