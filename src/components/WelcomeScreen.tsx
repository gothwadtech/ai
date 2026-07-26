import React from "react";
import { FolderGit2, FileCode2 } from "lucide-react";

interface WelcomeScreenProps {
  token: string | null;
  user: any;
  selectedRepo: any;
  selectedBranch: string;
  onSelectSection: (section: any) => void;
  onTriggerOAuth: () => void;
  onTogglePreview?: () => void;
  previewOpen?: boolean;
}

export default function WelcomeScreen({
  token,
  user,
  selectedRepo,
  selectedBranch,
  onSelectSection,
  onTriggerOAuth,
  onTogglePreview,
  previewOpen
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 bg-zinc-950 flex flex-col justify-center items-center p-6 sm:p-12 font-sans select-none overflow-y-auto no-scrollbar">
      <div className="max-w-md w-full text-center space-y-4 my-auto">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-lg">
          <FileCode2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold font-mono text-zinc-200">
            {selectedRepo ? selectedRepo.name : "No File Open"}
          </h2>
          <p className="text-xs text-zinc-500 font-sans">
            Select a file from the sidebar explorer to view or edit code.
          </p>
        </div>
        {selectedRepo && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onSelectSection("explorer")}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 font-mono text-xs px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Browse Explorer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

