import React from "react";
import { Cloud, UploadCloud, Mic, Camera, Youtube, Image } from "lucide-react";

interface MediaAttachmentMenuProps {
  onClose: () => void;
  onTrigger: (sourceName: string) => void;
}

export default function MediaAttachmentMenu({
  onClose,
  onTrigger,
}: MediaAttachmentMenuProps) {
  const handleItemClick = (sourceName: string) => {
    onTrigger(sourceName);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-11 left-0 bg-zinc-950 border border-zinc-800/95 rounded-2xl p-1.5 w-48 shadow-2xl z-50 flex flex-col font-sans text-[11px]">
        <div className="px-2.5 py-1 text-[8px] font-mono font-extrabold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 mb-1">
          Workspace Tools
        </div>
        <button
          type="button"
          onClick={() => handleItemClick("Google Drive")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <Cloud className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-medium">Google Drive Sync</span>
        </button>
        <button
          type="button"
          onClick={() => handleItemClick("File Upload")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <UploadCloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium">Direct File Upload</span>
        </button>
        <button
          type="button"
          onClick={() => handleItemClick("Audio Recorder")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="font-medium">Record Audio Memo</span>
        </button>
        <button
          type="button"
          onClick={() => handleItemClick("Camera Feed")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium">Live Camera Feed</span>
        </button>
        <button
          type="button"
          onClick={() => handleItemClick("YouTube Video Link")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <Youtube className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="font-medium">Import YouTube Notes</span>
        </button>
        <button
          type="button"
          onClick={() => handleItemClick("Sample Mock Media")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl text-left cursor-pointer transition-colors"
        >
          <Image className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium">Preload Demo Assets</span>
        </button>
      </div>
    </>
  );
}
