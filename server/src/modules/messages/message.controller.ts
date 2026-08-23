import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createMessage, getMessages, markMessagesAsRead } from "./message.service.js";

export const createMessageController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const { userId, role } = req.user!;
  const body = res.locals.body;

  const message = await createMessage(id, userId, role, body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
};

export const getMessagesController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const { userId, role } = req.user!;
  const query = res.locals.query;

  const result = await getMessages(id, userId, role, query);

  res.status(StatusCodes.OK).json({
    success: true,
    count: result.messages.length,
    meta: result.meta,
    data: result.messages,
  });
};

export const markMessagesAsReadController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const { userId, role } = req.user!;

  const result = await markMessagesAsRead(id, userId, role);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Messages marked as read",
    data: result,
  });
};