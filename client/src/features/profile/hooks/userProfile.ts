import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMyProfile,
  updateMyProfile,
} from "../api/profile.api";

import type {
  UpdateMyProfileInput,
} from "../types/profile.types";

import { uploadMyProfileImage } from "../api/profile.api";

export function useMyProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyProfileInput) =>
      updateMyProfile(data),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        ["my-profile"],
        updatedProfile,
      );
    },
  });
}

export function useUploadMyProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadMyProfileImage(formData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["my-profile"], updatedProfile);
    },
  });
}