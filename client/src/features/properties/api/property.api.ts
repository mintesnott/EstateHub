import { api } from "@/lib/axios";

import type {
  Property,
  PropertyFilters,
  PropertyImage,
  PropertiesResponse,
  PropertyResponse,
  PropertyImagesResponse,
} from "../types/property.types";

import type { 
  CreatePropertyInput,
  UpdatePropertyInput, } from "../types/property-management.types";
// Public properties
export async function getProperties(
  filters?: PropertyFilters,
): Promise<PropertiesResponse> {
  const response = await api.get<PropertiesResponse>(
    "/properties",
    {
      params: filters,
    },
  );

  return response.data;
}

// Agent/Admin own properties
export async function getMyProperties(
  filters?: PropertyFilters,
): Promise<PropertiesResponse> {
  const response = await api.get<PropertiesResponse>(
    "/properties/mine",
    {
      params: filters,
    },
  );

  return response.data;
}

// Single property
export async function getPropertyById(
  propertyId: string,
): Promise<Property> {
  const response = await api.get<PropertyResponse>(
    `/properties/${propertyId}`,
  );

  return response.data.data;
}

// Create
export async function createProperty(
  data: CreatePropertyInput,
): Promise<Property> {
  const response = await api.post<PropertyResponse>(
    "/properties",
    data,
  );

  return response.data.data;
}

// Update
export async function updateProperty(
  propertyId: string,
  data: UpdatePropertyInput,
): Promise<Property> {
  const response = await api.patch<PropertyResponse>(
    `/properties/${propertyId}`,
    data,
  );

  return response.data.data;
}

// Delete
export async function deleteProperty(
  propertyId: string,
): Promise<void> {
  await api.delete(`/properties/${propertyId}`);
}

// Get images
export async function getPropertyImages(
  propertyId: string,
): Promise<PropertyImage[]> {
  const response = await api.get<PropertyImagesResponse>(
    `/properties/${propertyId}/images`,
  );

  return response.data.data;
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
): Promise<PropertyImage> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{
    success: boolean;
    data: PropertyImage;
  }>(
    `/properties/${propertyId}/images/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}