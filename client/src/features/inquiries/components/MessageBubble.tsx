import type { Message } from "../types/inquiry.types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
        {!isOwnMessage && (
          <span className="mb-1 px-1 text-xs font-medium text-muted-foreground">
            {message.sender.name}
          </span>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isOwnMessage
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm border border-border bg-muted"
          }`}
        >
          {message.content}
        </div>

        <span className="mt-1 px-1 text-xs text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}