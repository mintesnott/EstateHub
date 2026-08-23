import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { validateImageFile, buildImageFormData } from "@/lib/upload";

interface UseImageUploadOptions<TResult> {
  uploadFn: (formData: FormData) => Promise<TResult>;
  onSuccess?: (result: TResult) => void;
}

export function useImageUpload<TResult>({
  uploadFn,
  onSuccess,
}: UseImageUploadOptions<TResult>): UseMutationResult<TResult, unknown, File> & {
  uploadFile: (file: File) => void;
} {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      return uploadFn(buildImageFormData(file));
    },
    onSuccess: (result) => {
      onSuccess?.(result);
    },
    onError: (error) => {
      if (error instanceof Error && !("response" in error)) {
        // Client-side validation error (wrong type/size) — message is already clean
        toast.error(error.message);
        return;
      }
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message ?? "Upload failed");
    },
  });

  return { ...mutation, uploadFile: mutation.mutate };
}