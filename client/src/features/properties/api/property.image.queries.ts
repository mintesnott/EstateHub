import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface UpdateImagePayload {
  imageId: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

interface DeleteImagePayload {
  imageId: string;
}

export function useImageManagerMutations(propertyId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["property-images", propertyId],
    });
    queryClient.invalidateQueries({
      queryKey: ["property", propertyId],
    });
    queryClient.invalidateQueries({
      queryKey: ["my-properties"],
    });
  };

  const setAsPrimary = useMutation({
    mutationFn: ({ imageId, isPrimary }: UpdateImagePayload) =>
      api.patch(
        `/properties/${propertyId}/images/${imageId}`,
        { isPrimary },
      ),
    onSuccess: invalidate,
  });

  const deleteImage = useMutation({
    mutationFn: ({ imageId }: DeleteImagePayload) =>
      api.delete(`/properties/${propertyId}/images/${imageId}`),
    onSuccess: invalidate,
  });

  return { setAsPrimary, deleteImage };
}