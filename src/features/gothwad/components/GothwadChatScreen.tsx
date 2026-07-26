import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, User, Code2, Cpu, Info, Terminal, Copy, Check, RotateCw, ThumbsUp, ThumbsDown,
  Zap, Bug, ShieldCheck, Palette, BookOpen, ArrowRight, Sparkles, FileText, GraduationCap,
  Calculator, CheckSquare, Download, Play, Eye, X, Monitor, Smartphone, RefreshCw, Archive
} from "lucide-react";
import { GothwadSession, Message } from "./LeftSidebar";
import { SUPPORTED_MODELS } from "./RightSidebar";
import Markdown from "react-markdown";
import { exportToPdf, downloadZipFromMarkdown, extractCodeBlocks } from "../../../utils/exporterUtils";

// Preset Prompt Cards - Versatile for all users
const SUGGESTED_PROMPTS = [
  {
    icon: <FileText className="w-4 h-4 text-emerald-400" />,
    title: "Environmental Essay / PDF",
    desc: "Comprehensive report on causes, impacts & solutions",
    prompt: "Write a detailed, well-structured essay on Environmental Pollution covering its types, causes, ecological impacts, and sustainable solutions that can be exported or printed as a clean report PDF."
  },
  {
    icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
    title: "NEET Exam 20 PYQs",
    desc: "20 Previous Year Questions with detailed answers",
    prompt: "Provide 20 important Previous Year Questions (PYQs) for the NEET Biology & Physics exam with complete step-by-step solutions and explanations."
  },
  {
    icon: <Code2 className="w-4 h-4 text-indigo-400" />,
    title: "React + Vite App Code",
    desc: "Full multi-component starter project structure",
    prompt: "Generate a complete React + Vite TypeScript web app code with Tailwind CSS styling, responsive layout, and clean component modularity."
  },
  {
    icon: <Calculator className="w-4 h-4 text-sky-400" />,
    title: "Calculator Web App",
    desc: "Feature-rich scientific & basic calculator UI",
    prompt: "Build a modern interactive Calculator web app with standard operations, history log, keyboard shortcuts, and clean dark mode styling using React & Tailwind."
  },
  {
    icon: <CheckSquare className="w-4 h-4 text-purple-400" />,
    title: "Daily Task Manager",
    desc: "To-do lists, daily goals & habit tracking UI",
    prompt: "Create a clean Daily Task & Habit Tracker web app where users can add tasks, set priority levels, mark completion, and view daily productivity stats."
  },
  {
    icon: <Sparkles className="w-4 h-4 text-rose-400" />,
    title: "Professional Email Draft",
    desc: "Formal business proposals, leave requests & cover letters",
    prompt: "Draft a clear, professional email template for a formal business project proposal and job application cover letter."
  }
];

interface GothwadChatScreenProps {
  activeSession: GothwadSession | null;
  accentColor: string;
  generating: boolean;
  setInputText: (text: string) => void;
  onRetryMessage?: (messageId: string) => Promise<void> | void;
}

// Custom CodeBlock Component for elegant code rendering with Copy, Preview & Download support
function CodeBlock({ 
  language, 
  code, 
  onPreviewCode 
}: { 
  language: string; 
  code: string; 
  onPreviewCode?: (code: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPreviewable = ["html", "jsx", "tsx", "js", "javascript", "svg"].includes(language.toLowerCase());

  return (
    <div className="my-4 border border-zinc-800/90 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs text-zinc-300 shadow-xl">
      <div className="bg-zinc-900/80 px-3.5 py-2 border-b border-zinc-850 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10.5px] text-zinc-300 font-bold uppercase tracking-wider">{language || "code"}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isPreviewable && onPreviewCode && (
            <button
              type="button"
              onClick={() => onPreviewCode(code)}
              className="text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-lg hover:bg-emerald-900/50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
              title="Preview UI Live in Sandbox"
            >
              <Eye className="w-3 h-3" />
              <span>Preview UI</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded hover:bg-zinc-800/80 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto no-scrollbar max-h-[420px] bg-zinc-950/90 leading-relaxed text-[13px]">
        <pre className="whitespace-pre">{code.trim()}</pre>
      </div>
    </div>
  );
}

// Function to parse and render message content with Claude AI-style high-fidelity Markdown support
function MarkdownContent({ 
  content, 
  onPreviewCode 
}: { 
  content: string; 
  onPreviewCode?: (code: string) => void;
}) {
  return (
    <div className="markdown-body text-zinc-200 text-[15px] leading-[1.75] tracking-[0.01em] space-y-3 font-sans">
      <Markdown
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeContent = String(children).replace(/\n$/, "");
            const isBlock = className && className.startsWith("language-");
            
            if (isBlock) {
              return (
                <CodeBlock
                  language={match ? match[1] : "code"}
                  code={codeContent}
                  onPreviewCode={onPreviewCode}
                />
              );
            }
            
            if (codeContent.includes("\n")) {
              return (
                <CodeBlock
                  language="code"
                  code={codeContent}
                  onPreviewCode={onPreviewCode}
                />
              );
            }

            return (
              <code className="bg-zinc-850/90 text-amber-300 px-1.5 py-0.5 rounded-md font-mono text-[12.5px] border border-zinc-750/60 mx-0.5 select-text" {...props}>
                {children}
              </code>
            );
          },
          p({ children }: any) {
            return <p className="mb-3.5 last:mb-0 leading-[1.75] text-zinc-200 text-[15px] select-text">{children}</p>;
          },
          strong({ children }: any) {
            return <strong className="font-semibold text-zinc-100">{children}</strong>;
          },
          em({ children }: any) {
            return <em className="italic text-zinc-300">{children}</em>;
          },
          ul({ children }: any) {
            return <ul className="list-disc list-inside pl-3 mb-3.5 space-y-1.5 text-zinc-200 text-[15px]">{children}</ul>;
          },
          ol({ children }: any) {
            return <ol className="list-decimal list-inside pl-3 mb-3.5 space-y-1.5 text-zinc-200 text-[15px]">{children}</ol>;
          },
          li({ children }: any) {
            return <li className="leading-[1.7] text-zinc-200 mb-1">{children}</li>;
          },
          h1({ children }: any) {
            return <h1 className="text-[20px] font-bold text-white border-b border-zinc-800/80 pb-2 mt-6 mb-3.5 tracking-tight">{children}</h1>;
          },
          h2({ children }: any) {
            return <h2 className="text-[17px] font-semibold text-zinc-100 mt-5 mb-2.5 tracking-tight">{children}</h2>;
          },
          h3({ children }: any) {
            return <h3 className="text-[15px] font-semibold text-zinc-200 mt-4 mb-2">{children}</h3>;
          },
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-3 border-amber-500/80 bg-amber-500/5 pl-4 pr-3 py-2.5 rounded-r-xl italic text-zinc-300 text-[14.5px] my-4 shadow-inner">
                {children}
              </blockquote>
            );
          },
          table({ children }: any) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40 no-scrollbar">
                <table className="w-full text-left border-collapse text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }: any) {
            return <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">{children}</thead>;
          },
          th({ children }: any) {
            return <th className="p-3 border-r border-zinc-800/50 last:border-r-0 font-bold">{children}</th>;
          },
          td({ children }: any) {
            return <td className="p-3 text-zinc-200 border-r border-zinc-800/30 last:border-r-0 border-b border-zinc-850/40 last:border-b-0">{children}</td>;
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

// Live Interactive Sandbox Preview Modal Component
function LiveSandboxModal({ code, onClose }: { code: string; onClose: () => void }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [key, setKey] = useState(0);

  // Generate HTML srcDoc for iframe
  const generateSrcDoc = () => {
    const isSvg = code.trim().startsWith("<svg");
    const isHtml = code.toLowerCase().includes("<html") || code.toLowerCase().includes("<!doctype");

    if (isSvg) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #09090b; }
            </style>
          </head>
          <body>${code}</body>
        </html>
      `;
    }

    if (isHtml) {
      return code;
    }

    // Default JSX/React/Tailwind wrapper
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 16px; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${code}

              // Auto mount if App or Component exported/defined
              if (typeof App !== 'undefined') {
                ReactDOM.createRoot(document.getElementById('root')).render(<App />);
              } else if (typeof Calculator !== 'undefined') {
                ReactDOM.createRoot(document.getElementById('root')).render(<Calculator />);
              } else if (typeof TaskManager !== 'undefined') {
                ReactDOM.createRoot(document.getElementById('root')).render(<TaskManager />);
              }
            } catch (err) {
              document.getElementById('root').innerHTML = '<div style="color: #ef4444; font-family: monospace; padding: 20px; background: #18181b; border-radius: 10px;"><strong>Preview Runtime Error:</strong><br/><br/>' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 animate-[fadeIn_0.15s_ease-out]">
      <div className="w-full max-w-5xl h-[88vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Gothwad Live UI Sandbox
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Interactive Browser Runtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Modes */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${device === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${device === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => setKey(prev => prev + 1)}
              className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Reload Sandbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-zinc-950 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-300 border border-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Iframe Container */}
        <div className="flex-1 bg-zinc-900/50 p-4 flex items-center justify-center overflow-hidden">
          <div className={`h-full bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl transition-all duration-300 ${device === "mobile" ? "w-[380px]" : "w-full"}`}>
            <iframe
              key={key}
              srcDoc={generateSrcDoc()}
              className="w-full h-full border-none"
              title="Gothwad UI Sandbox"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GothwadChatScreen({
  activeSession,
  accentColor,
  generating,
  setInputText,
  onRetryMessage
}: GothwadChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [likedMsgId, setLikedMsgId] = useState<string | null>(null);
  const [dislikedMsgId, setDislikedMsgId] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages?.length, generating]);

  // Handle previewing extracted code or code block
  const handleTriggerLivePreview = (text: string) => {
    const blocks = extractCodeBlocks(text);
    if (blocks.length > 0) {
      setPreviewCode(blocks[0].code);
    } else {
      setPreviewCode(text);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar relative font-sans">
      {/* Live Sandbox Preview Modal */}
      {previewCode && (
        <LiveSandboxModal
          code={previewCode}
          onClose={() => setPreviewCode(null)}
        />
      )}

      {!activeSession ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <Bot className="w-12 h-12 text-zinc-700 animate-pulse" style={{ color: accentColor }} />
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">No Active Chat Session</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Click the "New Chat Playground" button in the sidebar to start a new dynamic conversation thread!
          </p>
        </div>
      ) : activeSession.messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
          <p className="text-center">
            Type a message below to start your Gothwad AI workstation session.
          </p>
        </div>
      ) : activeSession.messages.length === 1 && activeSession.messages[0].id.startsWith("welcome") ? (
        /* Welcome Prompt Cards Grid (Sleek Capsule Style) */
        <div className="max-w-2xl mx-auto pt-4 space-y-4 font-sans select-none">
          {/* Curved Rectangular Box Header */}
          <div className="relative flex items-center justify-between gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 rounded-2xl px-4 py-3 shadow-2xl w-full">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #3b82f6 100%)` }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                SUGGESTED PROMPTS
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 rounded-xl">
              6 Presets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(item.prompt)}
                className="relative flex items-center justify-between gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-3.5 shadow-xl hover:bg-zinc-850/80 transition-all cursor-pointer group active:scale-[0.98] w-full text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0 group-hover:scale-105 group-hover:border-zinc-600 transition-all">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-500 group-hover:text-zinc-200 group-hover:border-zinc-700 flex items-center justify-center shrink-0 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Active Message List */
        <div className="max-w-3xl mx-auto space-y-8">
          {activeSession.messages.map((msg) => {
            const isAssistant = msg.role === "assistant";
            return (
              <div 
                key={msg.id} 
                className={`flex ${isAssistant ? "justify-start" : "justify-end"} animate-[fadeIn_0.15s_ease-out]`}
              >
                {/* Chat Bubble / Text Block */}
                <div className={`flex flex-col space-y-1.5 ${isAssistant ? "w-full" : "max-w-[85%]"}`}>
                  {/* Model Name and timestamp info row */}
                  <div className={`flex items-center gap-2 text-[9px] font-mono text-zinc-500 ${isAssistant ? "justify-start" : "justify-end"} select-none`}>
                    {isAssistant && (
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider">
                        {msg.model?.split("/").pop() || "Gothwad AI"}
                      </span>
                    )}
                    {!isAssistant && <span className="text-zinc-400 font-semibold">User</span>}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {isAssistant ? (
                    // Assistant View: Plain text background, Claude AI markdown rendering
                    <div className="bg-transparent text-zinc-200 border-none px-0 py-1">
                      <MarkdownContent 
                        content={msg.content} 
                        onPreviewCode={(code) => setPreviewCode(code)}
                      />
                      
                      {/* Visible light separator line at the end of the response */}
                      <div className="w-full h-px bg-zinc-850/60 mt-4 mb-2" />
                      
                      {/* Powerful Action Tools Bar underneath the separator */}
                      <div className="flex flex-wrap items-center gap-2 select-none py-1">
                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            setCopiedMsgId(msg.id);
                            setTimeout(() => setCopiedMsgId(null), 2000);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-850/60 bg-zinc-900/40 hover:bg-zinc-900 text-[10.5px] font-mono text-zinc-400 hover:text-zinc-200 transition-all active:scale-95 cursor-pointer"
                          title="Copy text response"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Export PDF Report Tool */}
                        <button
                          type="button"
                          onClick={() => exportToPdf(msg.content)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-900/40 bg-emerald-950/20 hover:bg-emerald-900/40 text-[10.5px] font-mono text-emerald-400 hover:text-emerald-300 transition-all active:scale-95 cursor-pointer"
                          title="Export or Print Response as PDF Document"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PDF Report</span>
                        </button>

                        {/* Export ZIP Project Tool */}
                        <button
                          type="button"
                          onClick={() => downloadZipFromMarkdown(msg.content)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-900/40 bg-indigo-950/20 hover:bg-indigo-900/40 text-[10.5px] font-mono text-indigo-400 hover:text-indigo-300 transition-all active:scale-95 cursor-pointer"
                          title="Download Code / Project as ZIP Archive"
                        >
                          <Archive className="w-3.5 h-3.5 text-indigo-400" />
                          <span>ZIP Project</span>
                        </button>

                        {/* Live UI Sandbox Tool */}
                        <button
                          type="button"
                          onClick={() => handleTriggerLivePreview(msg.content)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-900/40 bg-sky-950/20 hover:bg-sky-900/40 text-[10.5px] font-mono text-sky-400 hover:text-sky-300 transition-all active:scale-95 cursor-pointer"
                          title="Preview Code / UI Live in Sandbox"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Live UI</span>
                        </button>

                        {/* Retry / Regenerate button */}
                        <button
                          type="button"
                          onClick={() => onRetryMessage && onRetryMessage(msg.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-850/60 bg-zinc-900/40 hover:bg-zinc-900 text-[10.5px] font-mono text-zinc-400 hover:text-zinc-200 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                          title="Regenerate this response"
                          disabled={generating}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>

                        {/* Thumbs Up feedback */}
                        <button
                          type="button"
                          onClick={() => {
                            setLikedMsgId(likedMsgId === msg.id ? null : msg.id);
                            setDislikedMsgId(null);
                          }}
                          className={`flex items-center justify-center p-1.5 rounded-lg border transition-all active:scale-90 cursor-pointer ${
                            likedMsgId === msg.id
                              ? "border-emerald-800/45 bg-emerald-950/20 text-emerald-400"
                              : "border-zinc-850/40 bg-zinc-900/30 text-zinc-500 hover:text-zinc-300"
                          }`}
                          title="Good response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Thumbs Down feedback */}
                        <button
                          type="button"
                          onClick={() => {
                            setDislikedMsgId(dislikedMsgId === msg.id ? null : msg.id);
                            setLikedMsgId(null);
                          }}
                          className={`flex items-center justify-center p-1.5 rounded-lg border transition-all active:scale-90 cursor-pointer ${
                            dislikedMsgId === msg.id
                              ? "border-rose-800/45 bg-rose-950/20 text-rose-400"
                              : "border-zinc-850/40 bg-zinc-900/30 text-zinc-500 hover:text-rose-400"
                          }`}
                          title="Bad response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Spacer/separation line if user posts another message */}
                      <div className="w-full h-px bg-zinc-900/50 mt-3 last:hidden" />
                    </div>
                  ) : (
                    // User View: Beautiful card bubble matching AI's former container
                    <div className="bg-zinc-900/50 border border-zinc-850 text-zinc-100 px-4 py-3 rounded-2xl shadow-sm">
                      <p className="whitespace-pre-wrap leading-relaxed text-[14.5px]">{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Streaming/Generating Thinking Indicator */}
          {generating && (
            <div className="flex justify-start">
              <div className="flex flex-col space-y-1.5 w-full">
                <div className="text-[9px] font-mono text-zinc-650 uppercase tracking-wide">
                  {activeSession.model.split("/").pop()?.toUpperCase()} THINKING...
                </div>
                <div className="bg-transparent py-1 flex items-center gap-2.5">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-zinc-550 font-mono">
                    {activeSession.model === "deepseek/deepseek-r1" ? "Formulating step-by-step reasoning steps..." : "Analyzing semantic intent..."}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll reference target */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
