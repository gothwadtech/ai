import { safeStorage } from "../utils/safeStorage";

export interface FetchedModel {
  id: string;
  name: string;
  desc: string;
  tag: string;
  provider: string;
  isFree?: boolean;
  contextLength?: number;
}

export interface ProviderInfo {
  id: string;
  name: string;
  badge: string;
  defaultEndpoint: string;
  keyStorageKey?: string;
  requiresKey: boolean;
  keyPlaceholder?: string;
  desc: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    badge: "🌐 All LLMs",
    defaultEndpoint: "https://openrouter.ai/api/v1/models",
    keyStorageKey: "gothwad_ai_key",
    requiresKey: false,
    keyPlaceholder: "sk-or-v1-... (Optional for public list)",
    desc: "Fetch hundreds of AI models (Claude, DeepSeek, GPT-4o, Llama, Gemini, Qwen, etc.)"
  },
  {
    id: "groq",
    name: "Groq LPU",
    badge: "⚡ Ultra-Fast",
    defaultEndpoint: "https://api.groq.com/openai/v1/models",
    keyStorageKey: "gothwad_groq_key",
    requiresKey: true,
    keyPlaceholder: "gsk_...",
    desc: "Fetch ultra-fast open weights models (Llama 3.3, DeepSeek R1, Gemma 2, Mixtral)"
  },
  {
    id: "nvidia",
    name: "NVIDIA AI",
    badge: "🟢 Nemotron & Free",
    defaultEndpoint: "https://openrouter.ai/api/v1/models",
    keyStorageKey: "gothwad_ai_key",
    requiresKey: false,
    keyPlaceholder: "sk-or-v1-... or NVIDIA Key",
    desc: "Fetch NVIDIA Nemotron & high-performance enterprise scale models"
  },
  {
    id: "openai",
    name: "OpenAI",
    badge: "🧠 GPT & o1/o3",
    defaultEndpoint: "https://api.openai.com/v1/models",
    keyStorageKey: "gothwad_openai_key",
    requiresKey: true,
    keyPlaceholder: "sk-proj-...",
    desc: "Fetch official OpenAI model list (GPT-4o, o1, o3-mini, GPT-4 Turbo)"
  },
  {
    id: "gemini",
    name: "Google Gemini",
    badge: "💎 Gemini 2.5",
    defaultEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    keyStorageKey: "gothwad_gemini_key",
    requiresKey: true,
    keyPlaceholder: "AIzaSy...",
    desc: "Fetch Google's Gemini models (Gemini 2.5 Flash, Gemini 2.5 Pro)"
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    badge: "🦙 Local AI",
    defaultEndpoint: "http://localhost:11434/api/tags",
    requiresKey: false,
    keyPlaceholder: "No API key required for local Ollama",
    desc: "Fetch models running locally on your computer via Ollama"
  },
  {
    id: "custom",
    name: "Custom OpenAI API",
    badge: "⚙️ Custom URL",
    defaultEndpoint: "http://localhost:8000/v1/models",
    keyStorageKey: "gothwad_custom_provider_key",
    requiresKey: false,
    keyPlaceholder: "Bearer token if required...",
    desc: "Fetch models from any OpenAI-compatible custom server endpoint (/v1/models)"
  }
];

export async function fetchModelsFromProvider(
  providerId: string,
  customApiKey?: string,
  customEndpoint?: string
): Promise<FetchedModel[]> {
  const provider = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];
  const apiKey = customApiKey?.trim() || (provider.keyStorageKey ? safeStorage.getItem(provider.keyStorageKey)?.trim() : "");
  const endpoint = customEndpoint?.trim() || provider.defaultEndpoint;

  if (providerId === "openrouter") {
    return fetchOpenRouterModels(apiKey, endpoint);
  } else if (providerId === "groq") {
    return fetchGroqModels(apiKey, endpoint);
  } else if (providerId === "nvidia") {
    return fetchNvidiaModels(apiKey, endpoint);
  } else if (providerId === "openai") {
    return fetchOpenAIModels(apiKey, endpoint);
  } else if (providerId === "gemini") {
    return fetchGeminiModels(apiKey, endpoint);
  } else if (providerId === "ollama") {
    return fetchOllamaModels(endpoint);
  } else {
    return fetchCustomOpenAIModels(apiKey, endpoint);
  }
}

// 1. OpenRouter Models Fetcher
async function fetchOpenRouterModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  const url = endpoint || "https://openrouter.ai/api/v1/models";
  const headers: Record<string, string> = {
    "HTTP-Referer": "https://aistudio.gothwadtech.com",
    "X-Title": "Gothwad Tech AI"
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`OpenRouter models API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawList: any[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  return rawList.map(item => {
    const isFree = item.id?.includes(":free") || (item.pricing && parseFloat(item.pricing.prompt || "0") === 0);
    const tag = isFree ? "Free" : (item.id?.startsWith("deepseek") ? "Reasoning" : "OpenRouter");
    const ctx = item.context_length ? `${Math.round(item.context_length / 1024)}k ctx` : "";
    
    return {
      id: item.id,
      name: item.name || item.id,
      desc: item.description ? item.description.slice(0, 120) + "..." : `OpenRouter model ${ctx}`,
      tag: tag,
      provider: "openrouter",
      isFree: isFree,
      contextLength: item.context_length
    };
  });
}

// 2. Groq Models Fetcher
async function fetchGroqModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  const key = apiKey || safeStorage.getItem("gothwad_groq_key");
  if (!key) {
    throw new Error("Groq API Key is required to fetch Groq models. Please enter your Groq key (gsk_...).");
  }

  const url = endpoint || "https://api.groq.com/openai/v1/models";
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${key}`
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API returned HTTP ${res.status}: ${errText.slice(0, 100)}`);
  }

  const data = await res.json();
  const rawList: any[] = Array.isArray(data?.data) ? data.data : [];

  return rawList
    .filter(item => item.id && !item.id.includes("whisper") && !item.id.includes("tts"))
    .map(item => ({
      id: `groq/${item.id}`,
      name: `Groq ${item.id}`,
      desc: `Ultra-fast inference hosted on Groq hardware (${item.owned_by || "groq"})`,
      tag: "Groq Fast",
      provider: "groq",
      isFree: true
    }));
}

// 3. NVIDIA Models Fetcher
async function fetchNvidiaModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  // Fetch from OpenRouter filtered by nvidia/ or free models
  try {
    const openRouterModels = await fetchOpenRouterModels(apiKey, endpoint);
    const nvidiaList = openRouterModels.filter(m => m.id.toLowerCase().includes("nvidia") || m.id.toLowerCase().includes("nemotron"));
    if (nvidiaList.length > 0) return nvidiaList;
  } catch (e) {}

  // Fallback if openrouter fails: return static nvidia list
  return [
    { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "Nemotron-3 Ultra 550B", desc: "Massive scale model for complex structural answers.", tag: "NVIDIA", provider: "nvidia", isFree: true },
    { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron-3 Super 120B", desc: "Supercharged LLM optimized for high intelligence.", tag: "NVIDIA", provider: "nvidia", isFree: true },
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron-3 Nano 30B", desc: "Efficient light-weight companion.", tag: "NVIDIA", provider: "nvidia", isFree: true },
    { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", name: "Nemotron-3 Nano Omni 30B", desc: "Omni-reasoning and deep logical processing.", tag: "NVIDIA", provider: "nvidia", isFree: true },
    { id: "nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano 9B v2", desc: "Highly optimized lightweight reasoning model.", tag: "NVIDIA", provider: "nvidia", isFree: true },
    { id: "nvidia/nemotron-nano-12b-v2-vl:free", name: "Nemotron Nano 12B v2 VL", desc: "Lightweight multi-modal vision and language model.", tag: "NVIDIA", provider: "nvidia", isFree: true }
  ];
}

// 4. OpenAI Models Fetcher
async function fetchOpenAIModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  const key = apiKey || safeStorage.getItem("gothwad_openai_key");
  if (!key) {
    throw new Error("OpenAI API Key is required to fetch OpenAI models.");
  }

  const url = endpoint || "https://api.openai.com/v1/models";
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${key}`
    }
  });

  if (!res.ok) {
    throw new Error(`OpenAI API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawList: any[] = Array.isArray(data?.data) ? data.data : [];

  return rawList
    .filter(m => m.id && (m.id.startsWith("gpt") || m.id.startsWith("o1") || m.id.startsWith("o3") || m.id.startsWith("chatgpt")))
    .map(m => ({
      id: `openai/${m.id}`,
      name: `OpenAI ${m.id}`,
      desc: `Official OpenAI model (${m.owned_by || "openai"})`,
      tag: "OpenAI",
      provider: "openai"
    }));
}

// 5. Google Gemini Models Fetcher
async function fetchGeminiModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  const key = apiKey || safeStorage.getItem("gothwad_gemini_key");
  if (!key) {
    throw new Error("Google Gemini API Key is required to fetch Gemini models.");
  }

  const url = `${endpoint || "https://generativelanguage.googleapis.com/v1beta/models"}?key=${key}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Google Gemini API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawList: any[] = Array.isArray(data?.models) ? data.models : [];

  return rawList
    .filter(m => m.name && m.supportedGenerationMethods?.includes("generateContent"))
    .map(m => {
      const modelId = m.name.replace(/^models\//, "");
      return {
        id: `google/${modelId}`,
        name: m.displayName || modelId,
        desc: m.description ? m.description.slice(0, 120) : "Google Gemini multimodal AI model",
        tag: "Gemini",
        provider: "gemini"
      };
    });
}

// 6. Ollama Local Models Fetcher
async function fetchOllamaModels(endpoint?: string): Promise<FetchedModel[]> {
  const baseUrl = endpoint || "http://localhost:11434/api/tags";
  
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rawList: any[] = Array.isArray(data?.models) ? data.models : [];

    return rawList.map(m => ({
      id: `ollama/${m.name}`,
      name: `Ollama ${m.name}`,
      desc: `Local LLM running on your machine (${m.details?.parameter_size || "local"})`,
      tag: "Local",
      provider: "ollama",
      isFree: true
    }));
  } catch (e: any) {
    throw new Error(`Unable to connect to Ollama at ${baseUrl}. Make sure Ollama is running locally. (${e.message || "Connection refused"})`);
  }
}

// 7. Custom OpenAI-Compatible Models Fetcher
async function fetchCustomOpenAIModels(apiKey?: string, endpoint?: string): Promise<FetchedModel[]> {
  const url = endpoint || "http://localhost:8000/v1/models";
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Custom API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawList: any[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  return rawList.map(m => ({
    id: m.id,
    name: m.name || m.id,
    desc: m.description || `Custom endpoint model (${url})`,
    tag: "Custom",
    provider: "custom"
  }));
}
