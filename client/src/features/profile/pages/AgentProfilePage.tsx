import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  MessageCircle,
  Save,
  Camera,
  Loader2,
  Star,
} from "lucide-react";

import { LinkedInLogoIcon } from "@radix-ui/react-icons";


import { toast } from "sonner";

import { ProfileSecurity } from "../component/ProfileSecurity";
import {
  updateAgentProfileFormSchema,
  type UpdateAgentProfileFormInput,
} from "../schemas/agentProfile.schemas";
import { useMyProfile, useUpdateMyProfile, useUploadMyProfileImage } from "../hooks/userProfile";
import { validateImageFile, buildImageFormData } from "@/lib/upload";

const specializationOptions = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "LAND", label: "Land" },
  { value: "LUXURY", label: "Luxury" },
  { value: "PROPERTY_MANAGEMENT", label: "Property Management" },
] as const;

export function AgentProfilePage() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const uploadImageMutation = useUploadMyProfileImage();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateAgentProfileFormInput>({
    resolver: zodResolver(updateAgentProfileFormSchema),
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name,
      phone: profile.phone ?? "",
      profileImage: profile.profileImage ?? "",
      agencyName: profile.agentProfile?.agencyName ?? "",
      bio: profile.agentProfile?.bio ?? "",
      experienceYears: profile.agentProfile?.experienceYears ?? undefined,
      specializations: profile.agentProfile?.specializations ?? [],
      officeAddress: profile.agentProfile?.officeAddress ?? "",
      city: profile.agentProfile?.city ?? "",
      stateRegion: profile.agentProfile?.stateRegion ?? "",
      websiteUrl: profile.agentProfile?.websiteUrl ?? "",
      linkedinUrl: profile.agentProfile?.linkedinUrl ?? "",
      whatsappNumber: profile.agentProfile?.whatsappNumber ?? "",
    });
  }, [profile, reset]);

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

  const onSubmit = async (data: UpdateAgentProfileFormInput) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update your profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Unable to load profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const agent = profile.agentProfile;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your public agent profile and contact details.
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
              htmlFor="agentProfileImageUpload"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition hover:opacity-90"
              aria-label="Change profile image"
            >
              <Camera className="h-3.5 w-3.5" />
            </label>

            <input
              id="agentProfileImageUpload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleImageSelected(file);
                event.target.value = "";
              }}
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-semibold">{profile.name}</h2>

            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {profile.phone || "No phone number"}
              </span>
            </div>

            {agent && (
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  License: {agent.licenseNumber}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-secondary" />
                  {Number(agent.ratingAvg).toFixed(1)} ({agent.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <section className="rounded-xl border border-border bg-background">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">Personal information</h2>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                {...register("name")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                value={profile.email}
                disabled
                className="h-11 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground outline-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                {...register("phone")}
                placeholder="+251..."
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
               {errors.phone && (
                <p className="mt-1.5 text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="profileImage" className="mb-2 block text-sm font-medium">
                Profile image URL
              </label>
              <input
                id="profileImage"
                {...register("profileImage")}
                placeholder="https://..."
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </section>

        {/* Agency details */}
        <section className="rounded-xl border border-border bg-background">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">Agency details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Information shown to clients on your listings.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label htmlFor="agencyName" className="mb-2 block text-sm font-medium">
                Agency name
              </label>
              <input
                id="agencyName"
                {...register("agencyName")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
               {errors.agencyName && (
                <p className="mt-1.5 text-sm text-destructive">{errors.agencyName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="experienceYears" className="mb-2 block text-sm font-medium">
                Years of experience
              </label>
              <input
                id="experienceYears"
                type="number"
                min="0"
                {...register("experienceYears", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.experienceYears && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className="mb-2 block text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                {...register("bio")}
                placeholder="Tell clients about your experience..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.bio && (
                <p className="mt-1.5 text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="officeAddress" className="mb-2 block text-sm font-medium">
                Office address
              </label>
              <input
                id="officeAddress"
                {...register("officeAddress")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="city"
                  {...register("city")}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {errors.city && (
                <p className="mt-1.5 text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="stateRegion" className="mb-2 block text-sm font-medium">
                State / Region
              </label>
              <input
                id="stateRegion"
                {...register("stateRegion")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.stateRegion && (
                <p className="mt-1.5 text-sm text-destructive">{errors.stateRegion.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="whatsappNumber" className="mb-2 block text-sm font-medium">
                WhatsApp number
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="whatsappNumber"
                  {...register("whatsappNumber")}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
               {errors.whatsappNumber && (
                <p className="mt-1.5 text-sm text-destructive">{errors.whatsappNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="websiteUrl" className="mb-2 block text-sm font-medium">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="websiteUrl"
                  {...register("websiteUrl")}
                  placeholder="https://..."
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {errors.websiteUrl && (
                <p className="mt-1.5 text-sm text-destructive">{errors.websiteUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="mb-2 block text-sm font-medium">
                LinkedIn
              </label>
              <div className="relative">
                <LinkedInLogoIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="linkedinUrl"
                  {...register("linkedinUrl")}
                  placeholder="https://linkedin.com/in/..."
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {errors.linkedinUrl && (
                <p className="mt-1.5 text-sm text-destructive">{errors.linkedinUrl.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="rounded-xl border border-border bg-background">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">Specializations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select the property types you specialize in.
            </p>
          </div>

          <div className="p-6">
            <Controller
              control={control}
              name="specializations"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {specializationOptions.map((option) => {
                    const selected = field.value?.includes(option.value) ?? false;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          const current = field.value ?? [];
                          field.onChange(
                            selected
                              ? current.filter((v) => v !== option.value)
                              : [...current, option.value],
                          );
                        }}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || !isDirty}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <ProfileSecurity />
    </div>
  );
}