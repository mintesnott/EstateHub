import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createInquiry,
  cancelInquiry,
  closeInquiry,
  getInquiryById,
  getAllInquiries,
  getMyInquiries,
} from "./inquiry.service.js";

export const createInquiryController = async (req: Request, res: Response) => {
  const { propertyId } = res.locals.params;
  const clientId = req.user!.userId;
  const body = res.locals.body;

  const inquiry = await createInquiry(clientId, propertyId, body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Inquiry submitted successfully",
    data: inquiry,
  });
};

export const cancelInquiryController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const clientId = req.user!.userId;

  const inquiry = await cancelInquiry(id, clientId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Inquiry canceled successfully",
    data: inquiry,
  });
};

export const closeInquiryController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const { userId, role } = req.user!;

  const inquiry = await closeInquiry(id, userId, role);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Inquiry closed",
    data: inquiry,
  });
};

export const getInquiryByIdController = async (req: Request, res: Response) => {
  const { id } = res.locals.params;
  const { userId, role } = req.user!;

  const inquiry = await getInquiryById(id, userId, role);

  res.status(StatusCodes.OK).json({
    success: true,
    data: inquiry,
  });
};

export const getAllInquiriesController = async (req: Request, res: Response) => {
  const { userId, role } = req.user!;
  const query = res.locals.query;

  const result = await getAllInquiries(userId, role, query);

  res.status(StatusCodes.OK).json({
    success: true,
    count: result.inquiries.length,
    meta: result.meta,
    data: result.inquiries,
  });
};

export const getMyInquiriesController = async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const query = res.locals.query;

  const inquiries = await getMyInquiries(clientId, query);

  res.status(StatusCodes.OK).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
};