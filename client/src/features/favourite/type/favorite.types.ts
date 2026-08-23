export interface FavoriteProperty {
  id: string;
  title: string;
  description: string;
  price: string;
  pricePeriod: "MONTHLY" | "YEARLY" | "TOTAL";

  propertyType:
    | "APARTMENT"
    | "HOUSE"
    | "VILLA"
    | "CONDO"
    | "LAND"
    | "COMMERCIAL";

  listingType: "FOR_SALE" | "FOR_RENT";

  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;

  city: string;

  status:
    | "AVAILABLE"
    | "PENDING"
    | "SOLD"
    | "RENTED"
    | "INACTIVE";

  isFeatured: boolean;
  createdAt: string;

  images: {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }[];
}

export interface Favorite {
  id: string;
  createdAt: string;
  property: FavoriteProperty;
}

export interface FavoritesResponse {
  success: boolean;
  count: number;
  data: Favorite[];
}

export interface FavoriteResponse {
  success: boolean;
  message: string;

  data: {
    id: string;
    propertyId: string;
    createdAt: string;

    property: {
      id: string;
      title: string;
      price: string;
      city: string;
      propertyType: FavoriteProperty["propertyType"];
      listingType: FavoriteProperty["listingType"];
    };
  };
}