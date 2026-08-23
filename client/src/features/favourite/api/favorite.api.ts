import { api } from "@/lib/axios";

import type {
  FavoriteResponse,
  FavoritesResponse,
}  from "../type/favorite.types";

export async function getMyFavorites(): Promise<FavoritesResponse> {
  const response = await api.get<FavoritesResponse>("/favorites");

  return response.data;
}

export async function addFavorite(
  propertyId: string,
): Promise<FavoriteResponse> {
  const response = await api.post<FavoriteResponse>(
    `/favorites/${propertyId}`,
  );

  return response.data;
}

export async function removeFavorite(
  propertyId: string,
): Promise<void> {
  await api.delete(`/favorites/${propertyId}`);
}