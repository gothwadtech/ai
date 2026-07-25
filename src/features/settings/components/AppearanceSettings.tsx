import React, { useState } from "react";
import { Sliders, Monitor, Sun, Moon, Tv, Smartphone, Maximize2, Check, RotateCcw } from "lucide-react";

interface AppearanceSettingsProps {
  themeMode: "system" | "dark" | "light";
  onThemeModeChange: (mode: "system" | "dark" | "light") => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  uiScale: number;
  onUiScaleChange: (scale: number) => void;
  desktopMode?: boolean;
  onDesktopModeChange?: (enabled: boolean) => void;
}

const ACCENT_COLORS = [
  { label: "Gothwad Blue", value: "#3b82f6" },
  { label: "Violet Neon", value: "#8b5cf6" },
  { label: "Emerald Cyber", value: "#10b981" },
  { label: "Amber Pulse", value: "#f59e0b" },
  { label: "Rose Quartz", value: "#f43f5e" },
  { label: "Cyan Stream", value: "#06b6d4" },
];

const FONTS = [
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { label: "Fira Code", value: "Fira Code, monospace" },
  { label: "Inter / Sans", value: "Inter, sans-serif" },
  { label: "System Default", value: "system-ui, sans-serif" },
];

const TV_SCALE_PRESETS = [
  { label: "40% (PC View on TV)", value: 0.4, desc: "Ultra-compact view for big screens" },
  { label: "50% (Smart TV PC View)", value: 0.5, desc: "Optimal 1080p / 4K TV scale" },
  { label: "60% (Compact TV)", value: 0.6, desc: "For set-top boxes & TV browsers" },
  { label: "75% (TV Medium)", value: 0.75, desc: "Balanced large TV display" },
  { label: "100% (Standard View)", value: 1.0, desc: "Standard 1:1 default scaling" },
  { label: "125% (TV Large Text)", value: 1.25, desc: "High legibility for distance reading" },
];

export default function AppearanceSettings({
  themeMode,
  onThemeModeChange,
  accentColor,
  onAccentColorChange,
  fontFamily,
  onFontFamilyChange,
  uiScale,
  onUiScaleChange,
  desktopMode = false,
  onDesktopModeChange,
}: AppearanceSettingsProps) {
  const [scaleText, setScaleText] = useState(Math.round(uiScale * 100).toString());

  const handleApplyScale = () => {
    const parsed = parseInt(scaleText, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(30, Math.min(200, parsed));
      onUiScaleChange(clamped / 100);
      setScaleText(clamped.toString());
    } else {
      setScaleText(Math.round(uiScale * 100).toString());
    }
  };

  const handlePresetSelect = (scale: number) => {
    onUiScaleChange(scale);
    setScaleText(Math.round(scale * 100).toString());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Appearance & Personalization</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Customize studio theme colors, TV options, fonts, and interface density.
        </p>
      </div>

      {/* TV & Screen Display Modes */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wide block">
                TV & Large Screen Options
              </span>
              <span className="text-[11px] text-zinc-400">
                Configure Smart TV scale presets, PC view on TV, and desktop mode layout.
              </span>
            </div>
          </div>

          {onDesktopModeChange && (
            <button
              type="button"
              onClick={() => onDesktopModeChange(!desktopMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                desktopMode
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Site: {desktopMode ? "ON" : "OFF"}</span>
            </button>
          )}
        </div>

        {/* TV Quick Device Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              handlePresetSelect(0.5);
              if (onDesktopModeChange && !desktopMode) onDesktopModeChange(true);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              uiScale === 0.5 && desktopMode
                ? "bg-emerald-950/40 border-emerald-500 text-white shadow-md"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-100">Smart TV Mode</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">50% Scale</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                Full PC Desktop view on TV & 4K screens
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              handlePresetSelect(0.6);
              if (onDesktopModeChange && !desktopMode) onDesktopModeChange(true);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              uiScale === 0.6
                ? "bg-blue-950/40 border-blue-500 text-white shadow-md"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-100">Compact TV Box</span>
                <span className="text-[10px] font-mono text-blue-400 font-bold">60% Scale</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                Optimized for Set-top boxes & TV Browsers
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              handlePresetSelect(1.0);
              if (onDesktopModeChange && !desktopMode) onDesktopModeChange(true);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              uiScale === 1.0 && desktopMode
                ? "bg-purple-950/40 border-purple-500 text-white shadow-md"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-100">Desktop Standard</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">100% Scale</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                Standard PC Workspace layout
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              handlePresetSelect(1.0);
              if (onDesktopModeChange && desktopMode) onDesktopModeChange(false);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              !desktopMode
                ? "bg-amber-950/40 border-amber-500 text-white shadow-md"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-100">Mobile Responsive</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Touch Mode</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                Responsive mobile layout
              </p>
            </div>
          </button>
        </div>

        {/* TV Zoom & Scaling Grid */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide block">
            TV & Display Scale Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TV_SCALE_PRESETS.map((preset) => {
              const isSelected = Math.abs(uiScale - preset.value) < 0.02;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-bold">{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-sans mt-1">{preset.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Mode Selector */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide block">
          Theme Mode
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "dark", label: "Dark", icon: Moon },
            { id: "light", label: "Light", icon: Sun },
            { id: "system", label: "System", icon: Monitor },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = themeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onThemeModeChange(mode.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide block">
          Studio Accent Highlight
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ACCENT_COLORS.map((col) => {
            const isSelected = accentColor.toLowerCase() === col.value.toLowerCase();
            return (
              <button
                key={col.value}
                type="button"
                onClick={() => onAccentColorChange(col.value)}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected ? "border-white bg-zinc-850" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: col.value }} />
                <span className="text-[9px] font-mono text-zinc-300 truncate w-full text-center">{col.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography & Custom Scaling */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide block mb-2">
            Workspace Typography
          </span>
          <select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide block">
              Custom Zoom / UI Scale Percentage ({Math.round(uiScale * 100)}%)
            </span>
            <button
              type="button"
              onClick={() => handlePresetSelect(1.0)}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset 100%</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={scaleText}
              onChange={(e) => setScaleText(e.target.value)}
              className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
              placeholder="100"
            />
            <button
              type="button"
              onClick={handleApplyScale}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono transition-all cursor-pointer font-bold"
            >
              Apply Scale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

