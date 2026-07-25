import React from "react";
import SettingsView from "../../features/settings/components/SettingsView";
import { SettingsProps } from "../../features/settings/types";

export interface SettingsPanelProps extends SettingsProps {
  showCompactTitle?: boolean;
  onSelectSection?: (section: any) => void;
}

export default function SettingsPanel(props: SettingsPanelProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950/60 overflow-hidden">
      <SettingsView {...props} />
    </div>
  );
}
