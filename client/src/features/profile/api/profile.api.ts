import { api } from "@/lib/axios";

import type {
  MyProfile,
  MyProfileResponse,
  UpdateMyProfileInput,
} from "../types/profile.types";

export async function getMyProfile(): Promise<MyProfile> {
  const response = await api.get<MyProfileResponse>(
    "/users/me/profile",
  );

  return response.data.data;
}

export async function updateMyProfile(
  data: UpdateMyProfileInput,
): Promise<MyProfile> {
  const response = await api.patch<MyProfileResponse>(
    "/users/me/profile",
    data,
  );

  return response.data.data;
}

export async function uploadMyProfileImage(formData: FormData): Promise<MyProfile> {
  const response = await api.post<MyProfileResponse>(
    "/users/me/profile/image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}