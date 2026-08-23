import { Heart, MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  useMyFavorites,
  useRemoveFavorite,
} from "../api/favorite.queries";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US").format(
    Number(price),
  );
}

export function FavoritesPage() {
  const { data, isLoading, isError } = useMyFavorites();

  const removeFavoriteMutation = useRemoveFavorite();

  const favorites = data?.data ?? [];

  const handleRemove = (propertyId: string) => {
    removeFavoriteMutation.mutate(propertyId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Loading your favorites...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <h2 className="font-semibold">
          Unable to load favorites
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading your saved
          properties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
            <Heart className="h-5 w-5 text-secondary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Favorites
            </h1>

            <p className="text-sm text-muted-foreground">
              Properties you saved for later.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No favorites yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            When you find a property you like, click the
            heart icon to save it here.
          </p>

          <Link
            to="/properties"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data?.count ?? favorites.length} saved{" "}
            {favorites.length === 1
              ? "property"
              : "properties"}
          </p>

          {/* Property grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => {
              const property = favorite.property;

              const primaryImage =
                property.images.find(
                  (image) => image.isPrimary,
                ) ?? property.images[0];

              return (
                <div
                  key={favorite.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <Link
                    to={`/properties/${property.id}`}
                    className="block"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {primaryImage ? (
                        <img
                          src={primaryImage.imageUrl}
                          alt={property.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                          No image available
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                        {property.listingType ===
                        "FOR_SALE"
                          ? "For Sale"
                          : "For Rent"}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <Link
                        to={`/properties/${property.id}`}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />

                          <span>
                            {property.city}
                          </span>
                        </div>

                        <h2 className="mt-2 line-clamp-2 font-semibold transition-colors group-hover:text-secondary">
                          {property.title}
                        </h2>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(property.id)
                        }
                        disabled={
                          removeFavoriteMutation.isPending
                        }
                        aria-label="Remove from favorites"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                    <p className="mt-4 font-bold text-primary">
                      ETB {formatPrice(property.price)}

                      {property.listingType ===
                        "FOR_RENT" &&
                        property.pricePeriod !== "TOTAL" && (
                          <span className="ml-1 text-sm font-normal text-muted-foreground">
                            /{" "}
                            {property.pricePeriod.toLowerCase()}
                          </span>
                        )}
                    </p>

                    <div className="mt-4 flex gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
                      {property.bedrooms !== null && (
                        <span>
                          {property.bedrooms} bedrooms
                        </span>
                      )}

                      {property.bathrooms !== null && (
                        <span>
                          {property.bathrooms} bathrooms
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}