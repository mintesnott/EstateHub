import prisma from "../../config/database.js";
import { NotFoundError, ConflictError } from "../../errors/index.js";




// Add favourite
export const addFavorite = async (
    clientId: string,
    propertyId: string
) => {
  // check property existence
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  // check for duplicate favorite
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      clientId_propertyId: {
        clientId,
        propertyId,
      },
    },
  });

  if (existingFavorite) {
    throw new ConflictError("Property is already in your favorites");
  }

  // create favorite link
  const favorite = await prisma.favorite.create({
    data: {
      clientId,
      propertyId,
    },
    select: {
      id: true,
      propertyId: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          propertyType: true,
          listingType: true,
        },
      },
    },
  });

  return favorite;
};

//  2. remove favourite
export const removeFavorite = async (
  clientId: string, 
  propertyId: string
) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      clientId_propertyId: {
        clientId,
        propertyId,
      },
    },
  });

  if (!favorite) {
    throw new NotFoundError("Favorite entry not found for this property");
  }

  await prisma.favorite.delete({
    where: {
      id: favorite.id,
    },
  });

  return favorite;
};

// get all favourite properties
export const getMyFavorites = async (clientId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          pricePeriod: true,
          propertyType: true,
          listingType: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          city: true,
          status: true,
          isFeatured: true,
          createdAt: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              isPrimary: true,
            },
            take: 1, // First thumbnail image
          },
        },
      },
    },
  });

  return favorites;
};