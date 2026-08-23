import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addPropertyImage,
  getPropertyImages,
  updatePropertyImage,
  deletePropertyImage,
} from "./property-image.service.js";

import { uploadPropertyImage } from "../../middleware/upload.js";

export const addPropertyImageController = async (
  req: Request,
  res: Response
) => {
  const { propertyId } = res.locals.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const body = res.locals.body;

  const image = await addPropertyImage(propertyId, userId, userRole, body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Property image added successfully",
    data: image,
  });
};

export const getPropertyImagesController = async (
  req: Request,
  res: Response
) => {
  const { propertyId } = res.locals.params;

  const images = await getPropertyImages(propertyId);

  res.status(StatusCodes.OK).json({
    success: true,
    count: images.length,
    data: images,
  });
};

export const updatePropertyImageController = async (
  req: Request,
  res: Response
) => {
  const { propertyId, imageId } = res.locals.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const body = res.locals.body;

  const updatedImage = await updatePropertyImage(
    propertyId,
    imageId,
    userId,
    userRole,
    body
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Property image updated successfully",
    data: updatedImage,
  });
};

export const deletePropertyImageController = async (
  req: Request,
  res: Response
) => {
  const { propertyId, imageId } = res.locals.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  await deletePropertyImage(propertyId, imageId, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Property image deleted successfully",
  });
};

export const uploadPropertyImageController = async (
  req: Request,
  res: Response
) => {
  const { propertyId } = res.locals.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file was provided",
    });
  }

  const isPrimary = req.body.isPrimary === "true";

  const image = await addPropertyImage(propertyId, userId, userRole, {
    imageUrl: req.file.path, // Cloudinary URL, set by multer-storage-cloudinary
    isPrimary,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Property image uploaded successfully",
    data: image,
  });
};