import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMessage, markMessagesAsRead } from "./message.api";

import type { CreateMessageInput } from "../types/message.types";

// Send a message — invalidates the inquiry detail so the new message
// and updated inquiry.status (PENDING/RESPONDED) both refresh.
export function useSendMessage(inquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMessageInput) => createMessage(inquiryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries", "me"] });
    },
  });
}

export function useMarkMessagesAsRead(inquiryId: string) {
  return useMutation({
    mutationFn: () => markMessagesAsRead(inquiryId),
  });
}