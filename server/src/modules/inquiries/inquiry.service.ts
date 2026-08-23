import prisma from "../../config/database.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../errors/index.js";

import type {
  CreateInquiryInput,
  InquiryQueryInput,
} from "./inquiry.validation.js";

import { calculateResponseDeadline } from "../../utils/inquiry.utils.js"

// create inquiry
export const createInquiry = async (
  clientId: string,
  propertyId: string,
  payload: CreateInquiryInput
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      status: true,
      agentId: true,
    },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (property.status !== "AVAILABLE") {
    throw new BadRequestError(
      "Cannot submit inquiry for a property that is not currently available"
    );
  }

  // Prevent multiple active inquiries for the same property
  const existingInquiry = await prisma.inquiry.findFirst({
    where: {
      clientId,
      propertyId,
      status: {
        in: ["PENDING", "RESPONDED"],
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (existingInquiry) {
    throw new BadRequestError(
      `You already have an active inquiry for this property (${existingInquiry.status}). Continue the existing inquiry instead.`
    );
  }

  if (
    payload.budgetMin !== null &&
    payload.budgetMin !== undefined &&
    payload.budgetMax !== null &&
    payload.budgetMax !== undefined &&
    payload.budgetMin > payload.budgetMax
  ) {
    throw new BadRequestError(
      "Minimum budget cannot be greater than maximum budget"
    );
  }

return await prisma.$transaction(async (tx) => {
  const now = new Date();

  const inquiry = await tx.inquiry.create({
    data: {
      clientId,
      propertyId,
      purpose: payload.purpose,
      budgetMin: payload.budgetMin,
      budgetMax: payload.budgetMax,
      preferredMoveInDate: payload.preferredMoveInDate
        ? new Date(payload.preferredMoveInDate)
        : null,
      minBedrooms: payload.minBedrooms,
      minBathrooms: payload.minBathrooms,
      preferredLocation: payload.preferredLocation,
      financingAvailable: payload.financingAvailable,
      viewingRequested: payload.viewingRequested,
      message: payload.message,
      status: "PENDING",
      responseDeadline: calculateResponseDeadline(now),
    },
    include: {
      property: {
        select: { id: true, title: true, city: true, price: true },
      },
    },
  });

  const conversation = await tx.conversation.create({
    data: { inquiryId: inquiry.id },
  });

  if (payload.message && payload.message.trim().length > 0) {
    await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: clientId,
        content: payload.message,
      },
    });
  }

  return inquiry;
});

};

// cancel inquiry --> client
export const cancelInquiry = async (inquiryId: string, clientId: string) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
  });

  if (!inquiry) {
    throw new NotFoundError("Inquiry not found");
  }

  if (inquiry.clientId !== clientId) {
    throw new ForbiddenError("Access denied. You can only cancel your own inquiries.");
  }

  if (inquiry.status === "CANCELED") {
    throw new BadRequestError("Inquiry is already canceled");
  }

  if (inquiry.status === "CLOSED") {
    throw new BadRequestError("Cannot cancel an inquiry that is already closed");
  }

   if (inquiry.status === "RESPONDED") {
    throw new BadRequestError(
      "Cannot cancel an inquiry that has already been responded to"
    );
  }

  if (inquiry.status === "BREACHED") {
    throw new BadRequestError(
      "Cannot cancel an inquiry that has already breached"
    );
  }

  return await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { status: "CANCELED", responseDeadline: null,},
  });
};

//close inquiry 
export const closeInquiry = async (
  inquiryId: string,
  userId: string,
  userRole: "CLIENT" | "AGENT" | "ADMIN"
) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { property: { select: { agentId: true } } },
  });

  if (!inquiry) throw new NotFoundError("Inquiry not found");

  if (userRole === "CLIENT" && inquiry.clientId !== userId) {
    throw new ForbiddenError("You can only close your own inquiries");
  }
  if (userRole === "AGENT" && inquiry.property.agentId !== userId) {
    throw new ForbiddenError(
      "You can only close inquiries for your own properties"
    );
  }
    // ADMIN can still force-close 

  if (["CANCELED", "CLOSED", "BREACHED"].includes(inquiry.status)) {
    throw new BadRequestError(
      `Cannot close an inquiry with status ${inquiry.status}`
    );
  }

  return await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { status: "CLOSED", responseDeadline: null },
  });
};

// get single inquiry
export const getInquiryById = async (
  inquiryId: string,
  userId: string,
  userRole: string
) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      client: { select: { id: true, name: true, email: true, phone: true,}},
      property: { select: { id: true, title: true, city: true, price: true, agentId: true,}},

    conversation: {
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
      },
    },
  },
    },
},
  );

  if (!inquiry) {
    throw new NotFoundError("Inquiry not found");
  }

  if (userRole === "CLIENT" && inquiry.clientId !== userId) {
    throw new ForbiddenError("Access denied to this inquiry");
  }

  if (userRole === "AGENT" && inquiry.property.agentId !== userId) {
    throw new ForbiddenError(
      "Access denied. You can only view inquiries for your own properties."
    );
  }

  return inquiry;
};

// get list inquiries --> role scoped
export const getAllInquiries = async (
  userId: string,
  userRole: string,
  query: InquiryQueryInput
) => {
  const { status, propertyId, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (propertyId) where.propertyId = propertyId;
  if (userRole === "AGENT") where.property = { agentId: userId };

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, city: true, price: true } },
        conversation: { select: { id: true } },
      },
    }),
    prisma.inquiry.count({ where }),
  ]);

  const conversationIds = inquiries
    .map((i) => i.conversation?.id)
    .filter((id): id is string => Boolean(id));

  const unreadCounts = conversationIds.length
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: { in: conversationIds },
          senderId: { not: userId },
          readAt: null,
        },
        _count: { _all: true },
      })
    : [];

  const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u._count._all]));

  return {
    inquiries: inquiries.map(({ conversation, ...inquiry }) => ({
      ...inquiry,
      unreadCount: conversation ? unreadMap.get(conversation.id) ?? 0 : 0,
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// get own inquiries --> client
export const getMyInquiries = async (
  clientId: string,
  query?: InquiryQueryInput
) => {

  const { status } = query || {};

  const where: any = { clientId };
  if (status) {
    where.status = status;
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { id: true, title: true, city: true, price: true } },
      conversation: { select: { id: true } },
    },
  });

  const conversationIds = inquiries
    .map((i) => i.conversation?.id)
    .filter((id): id is string => Boolean(id));

  const unreadCounts = conversationIds.length
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: { in: conversationIds },
          senderId: { not: clientId },
          readAt: null,
        },
        _count: { _all: true },
      })
    : [];

  const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u._count._all]));

  return inquiries.map(({ conversation, ...inquiry }) => ({
    ...inquiry,
    unreadCount: conversation ? unreadMap.get(conversation.id) ?? 0 : 0,
  }));
};

//system generated breach controller
export const processBreachedInquiries = async (): Promise<number> => {
  const now = new Date();

  const result = await prisma.inquiry.updateMany({
    where: {
      status: "PENDING",
      responseDeadline: { lt: now },
    },
    data: {
      status: "BREACHED",
      responseDeadline: null,
    },
  });

  return result.count;
};



