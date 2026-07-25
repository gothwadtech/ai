import React, { useState } from "react";
import { Key, Cpu, Sliders, User, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { SettingsProps } from "../types";
import ApiKeysSettings from "./ApiKeysSettings";
import ModelRegistrySettings from "./ModelRegistrySettings";
import AppearanceSettings from "./AppearanceSettings";
import AccountSettings from "./AccountSettings";

type TabType = "apikeys" | "models" | "appearance" | "account";

export default function SettingsView({
  themeMode,
  onThemeModeChange,
  accentColor,
  onAccentColorChange,
  fontFamily,
  onFontFamilyChange,
  uiScale,
  onUiScaleChange,
  desktopMode,
  onDesktopModeChange,
  token,
  onLogout,
  disconnectGitHub,
  onClearAppData,
  user,
  customApiKey,
  onSetCustomApiKey,
  groqApiKey,
  onSetGroqApiKey,
  appModels = [],
  onUpdateAppModels,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("apikeys");

  const TABS = [
    { id: "apikeys" as const, label: "API Keys & Credentials", icon: Key },
    { id: "models" as const, label: "AI Models Registry", icon: Cpu },
    { id: "appearance" as const, label: "Appearance & Theme", icon: Sliders },
    { id: "account" as const, label: "Account & Storage", icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      {/* Top Header Navigation */}
      <header className="h-14 px-4 bg-zinc-900/90 border-b border-zinc-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/chat";
              }
            }}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #3b82f6 100%)` }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Gothwad Studio Settings
              </h1>
              <p className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-tight">
                Global Workspace Preferences
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Storage</span>
          </span>
        </div>
      </header>

      {/* Main Settings Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-6xl w-full mx-auto p-4 md:p-6 gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-zinc-850 pb-3 md:pb-0 md:pr-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs text-left transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-zinc-850 text-white font-bold border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={isActive ? { color: accentColor } : undefined}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-6">
          {activeTab === "apikeys" && (
            <ApiKeysSettings
              customApiKey={customApiKey}
              onSetCustomApiKey={onSetCustomApiKey}
              groqApiKey={groqApiKey}
              onSetGroqApiKey={onSetGroqApiKey}
              accentColor={accentColor}
            />
          )}

          {activeTab === "models" && (
            <ModelRegistrySettings
              appModels={appModels}
              onUpdateAppModels={onUpdateAppModels}
              accentColor={accentColor}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettings
              themeMode={themeMode}
              onThemeModeChange={onThemeModeChange}
              accentColor={accentColor}
              onAccentColorChange={onAccentColorChange}
              fontFamily={fontFamily}
              onFontFamilyChange={onFontFamilyChange}
              uiScale={uiScale}
              onUiScaleChange={onUiScaleChange}
              desktopMode={desktopMode}
              onDesktopModeChange={onDesktopModeChange}
            />
          )}

          {activeTab === "account" && (
            <AccountSettings
              token={token}
              user={user}
              onLogout={onLogout}
              disconnectGitHub={disconnectGitHub}
              onClearAppData={onClearAppData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
