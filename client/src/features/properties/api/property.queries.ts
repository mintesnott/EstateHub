import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProperty,
  deleteProperty,
  getMyProperties,
  getProperties,
  getPropertyById,
  getPropertyImages,
  updateProperty,
  uploadPropertyImage,
} from "./property.api";


import type { 
  CreatePropertyInput,
  UpdatePropertyInput, } from "../types/property-management.types";

  import type {
    PropertyFilters
  } from "../types/property.types"

// Property list
export function useProperties(filters?: PropertyFilters) {
  
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
  });
}

export function useMyProperties(
  filters?: PropertyFilters,
) {
  return useQuery({
    queryKey: ["my-properties", filters],
    queryFn: () => getMyProperties(filters),
  });
}

// Single property
export function useProperty(propertyId: string) {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId,
  });
}

// Property images
export function usePropertyImages(propertyId: string) {
  return useQuery({
    queryKey: ["property-images", propertyId],
    queryFn: () => getPropertyImages(propertyId),
    enabled: !!propertyId,
  });
}

//create a property
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyInput) =>
      createProperty(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
}

//update a property
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      data,
    }: {
      propertyId: string;
      data: UpdatePropertyInput;
    }) => updateProperty(propertyId, data),

    onSuccess: (property) => {
      queryClient.invalidateQueries({
        queryKey: ["my-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      queryClient.invalidateQueries({ queryKey: ["agent-properties"] });

      queryClient.setQueryData(
        ["property", property.id],
        property,
      );
    },
    
  });
}

//delete a property
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,

    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: ["my-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      queryClient.removeQueries({
        queryKey: ["property", propertyId],
      });
    },
  });
}

//upload a primary pic
export function useUploadPropertyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      file,
    }: {
      propertyId: string;
      file: File;
    }) =>
      uploadPropertyImage(propertyId, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "property-images",
          variables.propertyId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "property",
          variables.propertyId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-properties"],
      });
    },
  });
}

