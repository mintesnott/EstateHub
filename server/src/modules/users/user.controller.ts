import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getMyProfile,
  getUsers,
  updateMyProfile,
} from "./user.service.js";

import { uploadProfileImage } from "../../middleware/upload.js";

import type { UpdateMyProfileInput } from "./user.profile.validation.js";
import { GetUsersQueryInput } from "./user.validation.js";


export const getMyProfileController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;

  const profile = await getMyProfile(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: profile,
  });
};

export const updateMyProfileController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;

  const body = res.locals.body as UpdateMyProfileInput;

  const profile = await updateMyProfile(userId, body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
};

export const uploadMyProfileImageController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file was provided",
    });
  }

  const profile = await updateMyProfile(userId, { profileImage: req.file.path });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile image updated successfully",
    data: profile,
  });
};

export const getUsersController = async (req: Request, res: Response) => {
  const query = res.locals.query as GetUsersQueryInput;
  const result = await getUsers(query);

  res.status(StatusCodes.OK).json({
    success: true,
    count: result.users.length,
    meta: result.meta,
    data: result.users,
  });
};