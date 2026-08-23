import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";

import { NotFoundError, ForbiddenError } from "../../errors/index.js";

import type { CreatePropertyInput, GetPropertiesQueryInput, UpdatePropertyInput } from "./property.validation.js";


// creates a new property listing tied to the authenticated user --> from req.user
export const createProperty = async (
  agentId: string,
  data: CreatePropertyInput,
) => {

  const property = await prisma.property.create({
    data: {
      ...data,
      agentId, // Bound strictly to authenticated user ID from JWT
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return property;
};

export const getProperties = async(
  query: GetPropertiesQueryInput,
  scopedAgentId?: string,
) => {

  const {
    page,
    limit,
    search,
    city,
    propertyType,
    listingType,
    status,
    furnishedStatus,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    sortBy,
    sortOrder,
  } = query;
  //calculate offset
  const skip = (page - 1) * limit;

  // Build dynamic Prisma WHERE filters
  const where: Prisma.PropertyWhereInput = {};

   if (scopedAgentId) where.agentId = scopedAgentId;

  if (status) where.status = status;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (propertyType) where.propertyType = propertyType;
  if (listingType) where.listingType = listingType;
  if (furnishedStatus) where.furnishedStatus = furnishedStatus;
  if (bedrooms !== undefined) where.bedrooms = { gte: bedrooms };
  if (bathrooms !== undefined) where.bathrooms = { gte: bathrooms };

  // price range filtering
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // General text search
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  // Execute count and findMany concurrently via transaction
  const [totalCount, properties] = await prisma.$transaction([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
          orderBy: {
            sortOrder: "asc"
          },
          select: {
            id:true,
            imageUrl: true,
            isPrimary: true
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Map array into clean API contract format
  const propertiesWithPrimaryImage = properties.map(({ images, ...property }) => ({
    ...property,
    primaryImage: images[0] ?? null,
  }));



  return {
    properties: propertiesWithPrimaryImage,
    pagination: {
      totalCount,
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

//fetch single property by id (public)
export const getPropertyById = async (id: string) => {

  const property = await prisma.property.findUnique({
    where: { id },
    include:{
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      images: {
          where: {
            isPrimary: true,
          },
          take: 1,
          orderBy: {
            sortOrder: "asc"
          },
          select: {
            id:true,
            imageUrl: true,
            isPrimary: true
          },
        },
    },
  });

  if(!property) {
    throw new NotFoundError("Property Not Found");
  }
  
  const { images, ...propertyData } = property;

  return {
    ...propertyData,
    primaryImage: images[0] ?? null,
  };

};

//update property with ownership check
export const updateProperty = async(
  propertyId: string,
  userId: string,
  userRole: string,
  data: UpdatePropertyInput
) => {
  
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if(!property) {
    throw new NotFoundError("Property Not found");
  }

  //ownership verification
  //if user is agent, they must own the property (agentId === userId)
  //admin bypasses this check

  if(userRole === "AGENT" && property?.agentId !== userId) {
    throw new ForbiddenError("You are not authorized to modify this property listing");
  }

  //update property
  const updatedProperty = await prisma.property.update({
    where: {id: propertyId},
    data,
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return updatedProperty;
};

//delete property 

export const deleteProperty = async (
  propertyId: string,
  userId: string,
  userRole: string
) => {
  //  Clients can't delete property records
  if (userRole === "CLIENT") {
    throw new ForbiddenError("Only platform administrators can delete property listings");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  // Agents can only delete their own properties.
  if (userRole === "AGENT" && property.agentId !== userId) {
    throw new ForbiddenError(
      "You are not authorized to delete this property listing",
    );
  }

  await prisma.property.delete({
    where: { id: propertyId },
  });
};

//get my properties --> agent and admin

export const getMyProperties = async (
  agentId: string,
  query: GetPropertiesQueryInput,
) => {
  return getProperties(query, agentId);
};





