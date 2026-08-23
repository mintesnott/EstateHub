import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth.store";

import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "./favorite.api";

export function useMyFavorites() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
    enabled: isAuthenticated,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}