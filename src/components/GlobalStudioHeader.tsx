import React from "react";
import { LucideIcon, Menu, SlidersHorizontal } from "lucide-react";

interface GlobalStudioHeaderProps {
  title: string;
  badge?: React.ReactNode;
  badgeColor?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  iconClassName?: string;
  iconBoxClassName?: string;
  rightContent?: React.ReactNode;
  onToggleSidebar?: () => void;
  onToggleSettings?: () => void;
  showSettingsActive?: boolean;
}

export default function GlobalStudioHeader({
  title,
  badge,
  rightContent,
  onToggleSidebar,
  onToggleSettings,
  showSettingsActive = true
}: GlobalStudioHeaderProps) {
  return (
    <div className="pt-1 pb-0.5 px-2 sm:px-3 shrink-0 w-full select-none">
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative border border-zinc-800/80 rounded-2xl bg-zinc-900/90 backdrop-blur-md px-2 h-[54px] flex items-center justify-between gap-2 shadow-xl w-full">
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
              title="Toggle Menu / Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          <div className="flex flex-col min-w-0">
            <h2 className="text-[11.5px] font-mono font-bold tracking-tight text-zinc-100 uppercase leading-none truncate">
              {title}
            </h2>
            {badge && (
              <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5 truncate">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {rightContent}
          {onToggleSettings && (
            <button
              onClick={onToggleSettings}
              className={`p-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0 ${
                showSettingsActive ? "text-white border-zinc-700 bg-zinc-850" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Toggle Parameters Sidebar"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

