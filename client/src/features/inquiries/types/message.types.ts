import type { Message, PaginationMeta } from "./inquiry.types";

export interface CreateMessageInput {
  content: string;
  metadata?: Record<string, string | number | boolean | null> | null;
}

export interface MessageResponse {
  success: boolean;
  message?: string;
  data: Message;
}

export interface MessagesResponse {
  success: boolean;
  count: number;
  meta: PaginationMeta;
  data: Message[];
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
  data: { count: number };
}