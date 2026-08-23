import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useSendMessage } from "../api/message.queries";

interface MessageComposerProps {
  inquiryId: string;
}

export function MessageComposer({ inquiryId }: MessageComposerProps) {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useSendMessage(inquiryId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    mutate(
      { content: trimmed },
      {
        onSuccess: () => setContent(""),
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err.response?.data?.message ?? "Failed to send message");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-4">
      <input
        type="text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Type a message..."
        maxLength={5000}
        className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm outline-none focus:border-secondary"
      />

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}