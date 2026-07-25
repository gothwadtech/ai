import React from "react";
import { User, Github, LogOut, Trash2, CheckCircle2 } from "lucide-react";

interface AccountSettingsProps {
  token?: string | null;
  user?: any;
  onLogout?: () => void;
  disconnectGitHub?: () => Promise<void>;
  onClearAppData?: () => void;
}

export default function AccountSettings({
  token,
  user,
  onLogout,
  disconnectGitHub,
  onClearAppData,
}: AccountSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>Account & System Storage</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Manage active user sessions, GitHub integrations, and local caches.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full border border-zinc-700" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono">
                {user?.login?.[0]?.toUpperCase() || "G"}
              </div>
            )}
            <div>
              <span className="text-xs font-mono font-bold text-white block">
                {user?.login || user?.name || "Gothwad User"}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 block">
                {user?.email || "Connected via OAuth"}
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* GitHub Integration Status */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Github className="w-5 h-5 text-zinc-200" />
            <div>
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase block">GitHub Integration</span>
              <span className="text-[10px] text-zinc-400 block">
                {token ? "Connected and authorized for repository syncing" : "Not connected"}
              </span>
            </div>
          </div>

          {token && disconnectGitHub && (
            <button
              type="button"
              onClick={() => disconnectGitHub()}
              className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Clear Cache / Data */}
      {onClearAppData && (
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase block">Clear Local Storage</span>
              <p className="text-[10px] text-zinc-400">Reset saved preferences and cached session states.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear local application data?")) {
                  onClearAppData();
                }
              }}
              className="px-3 py-1.5 bg-zinc-950 hover:bg-red-950 text-zinc-400 hover:text-red-300 border border-zinc-800 hover:border-red-800/50 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
