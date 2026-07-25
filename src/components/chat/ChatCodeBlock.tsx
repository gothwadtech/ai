import React from "react";
import { Copy, Check, Play } from "lucide-react";

interface ChatCodeBlockProps {
  language?: string;
  content: string;
  blockId: string;
  copiedId: string | null;
  onCopyText: (text: string, id: string) => void;
  onApplyToEditor?: (code: string, id: string) => void;
}

export default function ChatCodeBlock({
  language,
  content,
  blockId,
  copiedId,
  onCopyText,
  onApplyToEditor,
}: ChatCodeBlockProps) {
  return (
    <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-left shadow-lg">
      <div className="bg-zinc-900 px-3 py-1.5 flex items-center justify-between border-b border-zinc-800 text-[10px] text-zinc-500">
        <span className="text-[9.5px] font-bold text-zinc-400 lowercase">{language || "typescript"}</span>
        <div className="flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={() => onCopyText(content, blockId)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy code"
          >
            {copiedId === blockId ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-bold">copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>copy</span>
              </>
            )}
          </button>

          {onApplyToEditor && (
            <button
              type="button"
              onClick={() => onApplyToEditor(content, blockId)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer font-bold text-amber-500"
              title="Apply code directly to active workspace file"
            >
              <Play className="w-3 h-3" />
              <span>apply</span>
            </button>
          )}
        </div>
      </div>

      <pre className="p-3 text-[11px] overflow-x-auto leading-relaxed max-h-72 scrollbar-thin select-text">
        <code className="text-zinc-100">{content}</code>
      </pre>
    </div>
  );
}
