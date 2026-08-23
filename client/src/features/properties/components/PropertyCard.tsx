import { Link } from "react-router-dom";
import { BedDouble, Bath, MapPin } from "lucide-react";

import type { Property, PropertyImage } from "../types/property.types";

import { FavoriteButton } from "@/features/favourite/components/FavoriteButton";

interface PropertyCardProps {
  property: Property;
  image?: PropertyImage;
}

export function PropertyCard({
  property,
}: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US").format(
    Number(property.price),
  );

  const listingLabel =
    property.listingType === "FOR_SALE"
      ? "For Sale"
      : "For Rent";


  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-muted">
      {/* <FavoriteButton propertyId={property.id} /> */}
        <Link to={`/properties/${property.id}`}>
          <div className="relative h-56 overflow-hidden bg-muted">
            {property.primaryImage ? (
              <img
                src={property.primaryImage.imageUrl}
                alt={property.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image available
              </div>
            )}

            <span className="absolute left-3 top-3 rounded-md bg-background px-3 py-1 text-xs font-semibold">
              {listingLabel}
            </span>
             <FavoriteButton propertyId={property.id} />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{property.city}</span>
        </div>

        <Link to={`/properties/${property.id}`}>
          <h2 className="mt-2 line-clamp-1 text-lg font-semibold hover:underline">
            {property.title}
          </h2>
        </Link> 

        <p className="mt-3 text-lg font-bold text-primary">
          ETB {formattedPrice}
          {property.listingType === "FOR_RENT" &&
            property.pricePeriod !== "TOTAL" && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {property.pricePeriod.toLowerCase()}
              </span>
            )}
        </p>

        <div className="mt-4 flex gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms} beds
            </span>
          )}

          {property.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} baths
            </span>
          )}

          <span>
            {property.propertyType}
          </span>
        </div>
      </div>
    </article>
  );
}


