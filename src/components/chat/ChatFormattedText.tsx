import React from "react";
import { parseTextContent, SubBlock } from "./markdownParser";

function renderBold(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-bold text-white">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    parts.push(remaining);
  }

  return parts;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const backtickRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = backtickRegex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      parts.push(...renderBold(textBefore));
    }
    parts.push(
      <code
        key={`code-${match.index}`}
        className="bg-zinc-950 px-1.5 py-0.5 rounded text-amber-500 font-mono text-xs border border-zinc-900 select-text"
      >
        {match[1]}
      </code>
    );
    lastIndex = backtickRegex.lastIndex;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    parts.push(...renderBold(remaining));
  }

  return parts;
}

interface ChatFormattedTextProps {
  content: string;
}

export default function ChatFormattedText({ content }: ChatFormattedTextProps) {
  const subBlocks = parseTextContent(content);

  const renderSubBlock = (block: SubBlock, blockIdx: number) => {
    switch (block.type) {
      case "header":
        if (block.level === 1) {
          return (
            <h1 key={blockIdx} className="text-white font-extrabold text-base sm:text-lg font-mono mt-4 mb-2 pb-1 border-b border-zinc-800">
              {renderInline(block.content || "")}
            </h1>
          );
        }
        if (block.level === 2) {
          return (
            <h2 key={blockIdx} className="text-zinc-50 font-bold text-sm sm:text-base font-mono mt-3 mb-2 pb-1 border-b border-zinc-800">
              {renderInline(block.content || "")}
            </h2>
          );
        }
        if (block.level === 3) {
          return (
            <h3 key={blockIdx} className="text-zinc-100 font-bold text-sm mt-3 mb-1">
              {renderInline(block.content || "")}
            </h3>
          );
        }
        return (
          <h4 key={blockIdx} className="text-zinc-200 font-bold text-xs sm:text-sm mt-2 mb-1">
            {renderInline(block.content || "")}
          </h4>
        );

      case "bullet-list":
        return (
          <div key={blockIdx} className="my-2 space-y-1">
            {block.items?.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-start gap-2 text-zinc-200 py-0.5 leading-relaxed font-sans pl-2">
                <span className="text-zinc-500 shrink-0 font-bold select-none mt-1 text-xs">•</span>
                <span className="flex-1 text-zinc-200 text-sm">{renderInline(item)}</span>
              </div>
            ))}
          </div>
        );

      case "ordered-list":
        return (
          <div key={blockIdx} className="my-2 space-y-1">
            {block.items?.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-start gap-2 text-zinc-200 py-0.5 leading-relaxed font-sans pl-2">
                <span className="text-zinc-500 shrink-0 font-mono font-bold select-none text-xs min-w-[14px] text-right mt-0.5">
                  {itemIdx + 1}.
                </span>
                <span className="flex-1 text-zinc-200 text-sm">{renderInline(item)}</span>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div key={blockIdx} className="my-4 overflow-x-auto rounded-lg border border-zinc-850 bg-zinc-900/40 no-scrollbar">
            <table className="w-full text-left border-collapse text-xs sm:text-sm select-text">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/45 text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                  {block.headers?.map((h, hIdx) => (
                    <th key={hIdx} className="p-2.5 font-bold border-r border-zinc-850/50 last:border-r-0">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows?.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-zinc-850/40 last:border-b-0 odd:bg-zinc-900/30 hover:bg-zinc-850/20 transition-all">
                    {row.cells.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-zinc-200 align-top border-r border-zinc-850/30 last:border-r-0 leading-relaxed">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "hr":
        return <hr key={blockIdx} className="my-4 border-zinc-850" />;

      case "empty":
        return <div key={blockIdx} className="h-2" />;

      case "paragraph":
      default:
        const lines = (block.content || "").split("\n");
        return (
          <div key={blockIdx} className="my-1.5 space-y-1">
            {lines.map((line, lIdx) => (
              <p key={lIdx} className="text-zinc-200 leading-relaxed font-sans text-sm select-text break-words whitespace-pre-wrap">
                {renderInline(line)}
              </p>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-1.5 select-text">
      {subBlocks.map((tb, tbIdx) => renderSubBlock(tb, tbIdx))}
    </div>
  );
}
