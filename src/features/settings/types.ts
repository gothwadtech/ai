export interface SettingsProps {
  themeMode: "system" | "dark" | "light";
  onThemeModeChange: (mode: "system" | "dark" | "light") => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  uiScale: number;
  onUiScaleChange: (scale: number) => void;
  desktopMode?: boolean;
  onDesktopModeChange?: (enabled: boolean) => void;
  token?: string | null;
  onLogout?: () => void;
  disconnectGitHub?: () => Promise<void>;
  onClearAppData?: () => void;
  user?: any;
  sbUser?: any;
  customApiKey: string;
  onSetCustomApiKey: (key: string) => void;
  groqApiKey: string;
  onSetGroqApiKey: (key: string) => void;
  appModels: any[];
  onUpdateAppModels: (models: any[]) => void;
}
