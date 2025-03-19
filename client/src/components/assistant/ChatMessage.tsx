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
          ? "user-message bg-blue-50 dark:bg-blue-900/30 mr-auto rounded-tl-sm"
          : "ai-message bg-white dark:bg-slate-700 ml-auto rounded-tr-sm"
      )}
    >
      <p className="whitespace-pre-line text-right dark:text-gray-50" dir="rtl">{message}</p>
    </div>
  );
}
