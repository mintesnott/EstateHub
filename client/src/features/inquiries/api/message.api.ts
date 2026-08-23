import { api } from "@/lib/axios";

import type {
  CreateMessageInput,
  MessageResponse,
  MarkReadResponse,
} from "../types/message.types";

// Client/Agent: send a message on an inquiry's conversation
export async function createMessage(
  inquiryId: string,
  payload: CreateMessageInput,
): Promise<MessageResponse["data"]> {
  const response = await api.post<MessageResponse>(
    `/inquiries/${inquiryId}/messages`,
    payload,
  );

  return response.data.data;
}

// Client/Agent: mark the other party's messages as read
export async function markMessagesAsRead(
  inquiryId: string,
): Promise<MarkReadResponse["data"]> {
  const response = await api.patch<MarkReadResponse>(
    `/inquiries/${inquiryId}/messages/read`,
  );

  return response.data.data;
}