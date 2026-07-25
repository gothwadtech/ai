import React from "react";
import { FileText, X } from "lucide-react";

export interface AttachedFile {
  name: string;
  content: string;
}

interface ChatInputAttachedFilesProps {
  attachedFiles: AttachedFile[];
  onRemoveFile: (name: string) => void;
}

export default function ChatInputAttachedFiles({
  attachedFiles,
  onRemoveFile,
}: ChatInputAttachedFilesProps) {
  if (attachedFiles.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto w-full mb-2.5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
      {attachedFiles.map((file) => (
        <div
          key={file.name}
          className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 text-[10px] font-mono px-3 py-1 rounded-full shadow-sm shrink-0 select-none"
        >
          <FileText className="w-3 h-3 text-indigo-400" />
          <span className="font-medium max-w-[150px] truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemoveFile(file.name)}
            className="p-0.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
            title="Remove attachment"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
