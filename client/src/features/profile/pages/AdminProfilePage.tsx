import { User, Mail, Phone, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useMyProfile, useUploadMyProfileImage } from "../hooks/userProfile";
import { ProfileSecurity } from "../component/ProfileSecurity";
import { validateImageFile, buildImageFormData } from "@/lib/upload";

export function AdminProfilePage() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const uploadImageMutation = useUploadMyProfileImage();

  const handleImageSelected = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    uploadImageMutation.mutate(buildImageFormData(file), {
      onSuccess: () => toast.success("Profile image updated"),
      onError: () => toast.error("Failed to upload image"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account information.
        </p>
      </div>

      {/* Summary */}
      <section className="rounded-xl border border-border bg-background">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 shrink-0">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-secondary/15 text-secondary">
              {uploadImageMutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>

            <label
              htmlFor="adminProfileImageUpload"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition hover:opacity-90"
            >
              <Camera className="h-3.5 w-3.5" />
            </label>

            <input
              id="adminProfileImageUpload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelected(file);
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="mt-0.5 text-sm font-medium text-secondary capitalize">
              {profile.role.toLowerCase()}
            </p>

            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProfileSecurity />
    </div>
  );
}