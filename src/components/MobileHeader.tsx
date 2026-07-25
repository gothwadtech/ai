import React from "react";
import { Menu, Sparkles } from "lucide-react";

interface MobileHeaderProps {
  isDarkActive: boolean;
  accentColor: string;
  selectedRepo: { name: string } | null;
  activeFile: { name: string } | null;
  token: string | null;
  setIsLeftDrawerOpen: (open: boolean) => void;
  handleThemeModeChange: (mode: "light" | "dark" | "system") => void;
  selectRepo: (repo: any) => void;
  logout: () => void;
  onSwitchToProjectsAI?: () => void;
}

export default function MobileHeader({
  accentColor,
  selectedRepo,
  setIsLeftDrawerOpen,
  onSwitchToProjectsAI
}: MobileHeaderProps) {
  return (
    <div className="pt-1 pb-0.5 px-2 sm:px-3 shrink-0 z-40 select-none w-full">
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative border border-zinc-800/80 rounded-2xl bg-zinc-900/90 backdrop-blur-md px-2 h-[54px] flex items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger Button to Open Drawer */}
        <button 
          onClick={() => setIsLeftDrawerOpen(true)}
          className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Repository Pill */}
        {selectedRepo ? (
          <div 
            className="flex items-center gap-1.5 bg-zinc-950 text-zinc-300 border px-2 py-1 rounded-lg text-[9px] font-mono font-bold truncate max-w-[120px]"
            style={{ borderColor: `${accentColor}25` }}
          >
            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="truncate">{selectedRepo.name}</span>
          </div>
        ) : (
          <div className="text-[8px] font-mono text-zinc-500 font-bold uppercase tracking-wider bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-850">
            No Repo
          </div>
        )}
      </div>
      </div>
    </div>
  </div>
);
}
