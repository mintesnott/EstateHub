import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth.store";

import {
  useAddFavorite,
  useMyFavorites,
  useRemoveFavorite,
} from "../api/favorite.queries";

interface FavoriteButtonProps {
  propertyId: string;
}

export function FavoriteButton({
  propertyId,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const { data } = useMyFavorites();

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const favorites = data?.data ?? [];

  const isFavorite = favorites.some(
    (favorite) => favorite.property.id === propertyId,
  );

  const isLoading =
    addFavoriteMutation.isPending ||
    removeFavoriteMutation.isPending;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    // Prevent the property card's Link from opening.
    event.preventDefault();
    event.stopPropagation();

    // Guests must authenticate first.
    if (!isAuthenticated) {
      toast.info("Please login to save properties.");

      navigate(
        `/login?redirect=${encodeURIComponent(location.pathname)}`,
      );

      return;
    }

    if (isLoading) {
      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate(propertyId);
    } else {
      addFavoriteMutation.mutate(propertyId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
      aria-pressed={isFavorite}
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-foreground"
        }`}
      />
    </button>
  );
}