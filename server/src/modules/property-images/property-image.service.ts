import prisma from "../../config/database.js";
import { NotFoundError, ForbiddenError } from "../../errors/index.js";
import type {
  CreatePropertyImageInput,
  UpdatePropertyImageInput,
} from "./property-image.validation.js";

// helper --> verify property existence and user ownership
const verifyPropertyOwnership = async (
  propertyId: string,
  userId: string,
  userRole: string
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, agentId: true },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (userRole !== "ADMIN" && property.agentId !== userId) {
    throw new ForbiddenError(
      "Access denied. You can only manage images for your own properties."
    );
  }

  return property;
};

// add image
export const addPropertyImage = async (
  propertyId: string,
  userId: string,
  userRole: string,
  payload: CreatePropertyImageInput
) => {
    // call helper
  await verifyPropertyOwnership(propertyId, userId, userRole);

  return await prisma.$transaction(async (tx) => {
    // If sortOrder was not explicitly passed, calculate next sequential sortOrder
    let finalSortOrder = payload.sortOrder;

    if (finalSortOrder === undefined) {
      const highestImage = await tx.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      finalSortOrder = highestImage ? highestImage.sortOrder + 1 : 1;
    }
    // if setting as primary, demote existing primary image
    if (payload.isPrimary) {
      await tx.propertyImage.updateMany({
        where: { propertyId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Create the new image with auto-incremented sortOrder
    const newImage = await tx.propertyImage.create({
      data: {
        propertyId,
        imageUrl: payload.imageUrl,
        isPrimary: payload.isPrimary,
        sortOrder: finalSortOrder,
      },
    });

    return newImage;
  });
};

//get property images --> public
export const getPropertyImages = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  const images = await prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: [
      { isPrimary: "desc" },
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return images;
};

// update image
export const updatePropertyImage = async (
  propertyId: string,
  imageId: string,
  userId: string,
  userRole: string,
  payload: UpdatePropertyImageInput
) => {
  await verifyPropertyOwnership(propertyId, userId, userRole);

  const existingImage = await prisma.propertyImage.findFirst({
    where: { id: imageId, propertyId },
  });

  if (!existingImage) {
    throw new NotFoundError("Image not found for this property");
  }

  return await prisma.$transaction(async (tx) => {
    // setting image to primary -> demote all other primary images for this property
    if (payload.isPrimary === true) {
      await tx.propertyImage.updateMany({
        where: {
          propertyId,
          isPrimary: true,
          id: { not: imageId },
        },
        data: { isPrimary: false },
      });
    }

    //setting current primary image to false -> promote next image to primary
    if (payload.isPrimary === false && existingImage.isPrimary) {
      const nextPrimary = await tx.propertyImage.findFirst({
        where: {
          propertyId,
          id: { not: imageId },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      if (nextPrimary) {
        await tx.propertyImage.update({
          where: { id: nextPrimary.id },
          data: { isPrimary: true },
        });
      }
    }

    // Update the target image
    const updatedImage = await tx.propertyImage.update({
      where: { id: imageId },
      data: payload,
    });

    return updatedImage;
  });
};

// delete image
export const deletePropertyImage = async (
  propertyId: string,
  imageId: string,
  userId: string,
  userRole: string
) => {
  await verifyPropertyOwnership(propertyId, userId, userRole);

  const existingImage = await prisma.propertyImage.findFirst({
    where: { id: imageId, propertyId },
  });

  if (!existingImage) {
    throw new NotFoundError("Image not found for this property");
  }

  return await prisma.$transaction(async (tx) => {
    // delete target image
    await tx.propertyImage.delete({
      where: { id: imageId },
    });

    // if deleted image was primary, assign primary status to the next image
    if (existingImage.isPrimary) {
      const nextPrimary = await tx.propertyImage.findFirst({
        where: { propertyId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      if (nextPrimary) {
        await tx.propertyImage.update({
          where: { id: nextPrimary.id },
          data: { isPrimary: true },
        });
      }
    }
  });
};