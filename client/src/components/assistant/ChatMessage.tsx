import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "chat-message rounded-lg px-4 py-3 mb-3 max-w-[80%]",
        isUser
          ? "user-message bg-blue-50 mr-auto rounded-tl-sm"
          : "ai-message bg-white ml-auto rounded-tr-sm"
      )}
    >
      <p className="whitespace-pre-line text-right" dir="rtl">{message}</p>
    </div>
  );
}
