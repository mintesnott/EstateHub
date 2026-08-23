import prisma from "../../config/database.js";
import type { Prisma } from "../../generated/prisma/client.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../errors/index.js";
import type { CreateMessageInput, MessageQueryInput } from "./message.validation.js";
import { calculateResponseDeadline } from "../../utils/inquiry.utils.js";

async function getInquiryWithAccess(
  inquiryId: string,
  userId: string,
  userRole: string
) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      property: { select: { agentId: true } },
      conversation: true,
    },
  });

  if (!inquiry) throw new NotFoundError("Inquiry not found");

  if (userRole === "CLIENT" && inquiry.clientId !== userId) {
    throw new ForbiddenError("Access denied to this inquiry");
  }
  if (userRole === "AGENT" && inquiry.property.agentId !== userId) {
    throw new ForbiddenError(
      "Access denied. You can only access inquiries for your own properties."
    );
  }
  // ADMIN is allowed to read

  return inquiry;
}

export const createMessage = async (
  inquiryId: string,
  senderId: string,
  senderRole: "CLIENT" | "AGENT" | "ADMIN",
  payload: CreateMessageInput
) => {
  if (senderRole === "ADMIN") {
    throw new ForbiddenError("Admins cannot participate in inquiry conversations");
  }

  const inquiry = await getInquiryWithAccess(inquiryId, senderId, senderRole);

  if (["CANCELED", "CLOSED", "BREACHED"].includes(inquiry.status)) {
    throw new BadRequestError(
      `Cannot send messages on an inquiry with status ${inquiry.status}`
    );
  }

  // Ensure conversation exists (safety net – should already exist)
  let conversationId = inquiry.conversation?.id;
  if (!conversationId) {
    const conv = await prisma.conversation.create({
      data: { inquiryId },
    });
    conversationId = conv.id;
  }

  const now = new Date();

  // Agent → RESPONDED + clear deadline
  // Client → PENDING + reset deadline
  const inquiryUpdateData =
    senderRole === "AGENT"
      ? {
          status: "RESPONDED" as const,
          responseDeadline: null,
        }
      : {
          status: "PENDING" as const,
          responseDeadline: calculateResponseDeadline(now),
        };

  const [message] = await prisma.$transaction([
  prisma.message.create({
    data: {
      conversationId,
      senderId,
      content: payload.content,
      metadata: (payload.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  }),
  prisma.inquiry.update({
    where: { id: inquiryId },
    data: inquiryUpdateData,
  }),
]);

  return message;
};

export const getMessages = async (
  inquiryId: string,
  userId: string,
  userRole: string,
  query: MessageQueryInput
) => {
  const inquiry = await getInquiryWithAccess(inquiryId, userId, userRole);

  if (!inquiry.conversation) {
    return {
      messages: [],
      meta: { total: 0, page: query.page, limit: query.limit, totalPages: 0 },
    };
  }

  const { page = 1, limit = 50 } = query;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId: inquiry.conversation.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    }),
    prisma.message.count({
      where: { conversationId: inquiry.conversation.id },
    }),
  ]);

  return {
    messages,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const markMessagesAsRead = async (
  inquiryId: string,
  userId: string,
  userRole: string,
) => {
  const inquiry = await getInquiryWithAccess(inquiryId, userId, userRole);

  if (!inquiry.conversation) {
    return { count: 0 };
  }

  const result = await prisma.message.updateMany({
    where: {
      conversationId: inquiry.conversation.id,
      senderId: { not: userId }, // only mark messages from the OTHER party
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return { count: result.count };
};