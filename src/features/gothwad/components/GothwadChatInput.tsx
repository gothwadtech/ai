import React from "react";
import GothwadStyleInputBar from "../../../components/chat/GothwadStyleInputBar";

interface GothwadChatInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  generating: boolean;
  accentColor: string;
  activeModelName: string;
  temperature: number;
}

export default function GothwadChatInput({
  inputText,
  setInputText,
  onSubmit,
  generating,
  accentColor,
  activeModelName
}: GothwadChatInputProps) {
  const handleSend = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    onSubmit(fakeEvent);
  };

  return (
    <GothwadStyleInputBar
      input={inputText}
      setInput={setInputText}
      isLoading={generating}
      onSend={handleSend}
      accentColor={accentColor}
      placeholder={`Ask ${activeModelName}...`}
    />
  );
}


