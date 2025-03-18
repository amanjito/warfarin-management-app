import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
  isPending?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  suggestions,
  onSuggestionClick,
  disabled = false,
  isPending = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t">
      <div className="flex">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="سوال خود را اینجا بنویسید..."
          className="flex-1 px-4 py-2 focus-visible:ring-[#E91E63]"
          disabled={disabled || isPending}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled || isPending}
          className="ml-2 bg-[#E91E63] hover:bg-[#C2185B]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800"
            onClick={() => onSuggestionClick(suggestion)}
            disabled={disabled || isPending}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
