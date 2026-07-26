import JSZip from "jszip";

/**
 * Utility to extract code blocks from markdown text
 */
export interface ExtractedCodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export function extractCodeBlocks(markdown: string): ExtractedCodeBlock[] {
  const codeBlockRegex = /```(\w+)?(?:\s+:([^\n]+))?\n([\s\S]*?)```/g;
  const blocks: ExtractedCodeBlock[] = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || "txt";
    const filename = match[2] ? match[2].trim() : undefined;
    const code = match[3] ? match[3].trim() : "";
    
    if (code) {
      blocks.push({ language, code, filename });
    }
  }

  return blocks;
}

/**
 * Utility to generate and download a ZIP file from markdown content / code blocks
 */
export async function downloadZipFromMarkdown(content: string, zipName = "gothwad-ai-project.zip") {
  const zip = new JSZip();
  const blocks = extractCodeBlocks(content);

  if (blocks.length > 0) {
    blocks.forEach((block, index) => {
      let ext = "txt";
      switch (block.language.toLowerCase()) {
        case "typescript":
        case "ts":
          ext = "ts";
          break;
        case "tsx":
        case "jsx":
          ext = "tsx";
          break;
        case "javascript":
        case "js":
          ext = "js";
          break;
        case "html":
          ext = "html";
          break;
        case "css":
          ext = "css";
          break;
        case "json":
          ext = "json";
          break;
        case "python":
        case "py":
          ext = "py";
          break;
        case "markdown":
        case "md":
          ext = "md";
          break;
        case "svg":
          ext = "svg";
          break;
        default:
          ext = block.language || "txt";
      }

      const defaultFilename = `file_${index + 1}.${ext}`;
      const fileName = block.filename || (block.language === "html" ? "index.html" : defaultFilename);
      zip.file(fileName, block.code);
    });
  } else {
    // If no code blocks, save the response text as README.md
    zip.file("response.md", content);
  }

  // Generate README in zip with prompt info
  zip.file("README_GOTHWAD.md", `# Exported from Gothwad AI Studio\n\nGenerated at: ${new Date().toLocaleString()}\n\n---\n\n${content}`);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Utility to export markdown / AI response as printable PDF
 */
export function exportToPdf(content: string, title = "Gothwad AI Report") {
  const printWindow = window.open("", "_blank", "width=900,height=800");
  if (!printWindow) {
    alert("Please allow popups to export PDF");
    return;
  }

  // Convert basic markdown formatting to HTML for printing
  const htmlContent = content
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; margin-top: 18px; margin-bottom: 8px; color: #111;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 18px; margin-top: 22px; margin-bottom: 10px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 4px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 22px; margin-top: 24px; margin-bottom: 12px; color: #111; border-bottom: 2px solid #333; padding-bottom: 6px;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; border: 1px solid #e4e4e7; overflow-x: auto; white-space: pre-wrap;">$1</pre>')
    .replace(/`([^`]+)`/g, '<code style="background: #f4f4f5; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #e4e4e7;">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin-bottom: 12px; line-height: 1.6; color: #222;">')
    .replace(/\n/g, '<br/>');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #18181b;
            margin: 0;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
            background: #ffffff;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #18181b;
            padding-bottom: 16px;
            margin-bottom: 28px;
          }
          .title-area h1 {
            font-size: 20px;
            margin: 0;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          .title-area p {
            font-size: 11px;
            color: #71717a;
            margin: 4px 0 0 0;
            font-family: monospace;
          }
          .watermark {
            font-size: 10px;
            font-family: monospace;
            font-weight: bold;
            background: #18181b;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            letter-spacing: 0.05em;
          }
          .content {
            margin-bottom: 40px;
          }
          .footer {
            border-top: 1px solid #e4e4e7;
            padding-top: 12px;
            font-size: 10px;
            color: #a1a1aa;
            display: flex;
            justify-content: space-between;
            font-family: monospace;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #18181b; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
            🖨️ Print / Save as PDF
          </button>
        </div>
        <div class="header">
          <div class="title-area">
            <h1>Gothwad AI Document</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
          <div class="watermark">
            GOTHWAD AI STUDIO
          </div>
        </div>
        <div class="content">
          <p style="margin-bottom: 12px; line-height: 1.6; color: #222;">
            ${htmlContent}
          </p>
        </div>
        <div class="footer">
          <span>Gothwad AI Intelligence Workstation</span>
          <span>Confidential & Private</span>
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
