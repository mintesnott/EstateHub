import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getAgentDashboard, getAdminDashboard } from "./dashboard.service.js";

export const getAgentDashboardController = async (
  req: Request,
  res: Response,
) => {
  const data = await getAgentDashboard(req.user!.userId);
  res.status(StatusCodes.OK).json({ success: true, data });
};

export const getAdminDashboardController = async (
  req: Request,
  res: Response,
) => {
  const data = await getAdminDashboard();
  res.status(StatusCodes.OK).json({ success: true, data });
};