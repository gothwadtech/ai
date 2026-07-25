export interface TableRow {
  cells: string[];
}

export interface SubBlock {
  type: "paragraph" | "header" | "bullet-list" | "ordered-list" | "table" | "hr" | "empty";
  level?: number;
  items?: string[];
  headers?: string[];
  rows?: TableRow[];
  content?: string;
}

export interface ContentBlock {
  type: "text" | "code";
  content: string;
  language?: string;
}

export function parseMarkdown(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const regex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      blocks.push({ type: "text", content: textBefore });
    }
    blocks.push({
      type: "code",
      language: match[1] || "typescript",
      content: match[2]
    });
    lastIndex = regex.lastIndex;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText || blocks.length === 0) {
    blocks.push({ type: "text", content: remainingText || " " });
  }

  return blocks;
}

export function parseTextContent(text: string): SubBlock[] {
  const lines = text.split("\n");
  const subBlocks: SubBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      subBlocks.push({ type: "hr" });
      i++;
      continue;
    }

    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      subBlocks.push({
        type: "header",
        level: headerMatch[1].length,
        content: headerMatch[2]
      });
      i++;
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableHeaders = trimmed.split("|").map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith("|") && nextLine.includes("-")) {
          i += 2;
          const rows: TableRow[] = [];
          
          while (i < lines.length) {
            const rowLine = lines[i].trim();
            if (rowLine.startsWith("|") && rowLine.endsWith("|")) {
              const cells = rowLine.split("|").map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
              rows.push({ cells });
              i++;
            } else {
              break;
            }
          }
          
          subBlocks.push({
            type: "table",
            headers: tableHeaders,
            rows
          });
          continue;
        }
      }
    }

    if (/^[\*\-\+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const itemMatch = itemLine.match(/^[\*\-\+]\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }
      subBlocks.push({ type: "bullet-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const itemMatch = itemLine.match(/^\d+\.\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }
      subBlocks.push({ type: "ordered-list", items });
      continue;
    }

    subBlocks.push({ type: "paragraph", content: line });
    i++;
  }

  return subBlocks;
}
