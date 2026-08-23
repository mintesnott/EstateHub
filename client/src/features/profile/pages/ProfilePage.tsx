import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Wallet,
  CheckCircle2,
  Save,
  Camera,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { ProfileSecurity } from "../component/ProfileSecurity";

import {
  updateClientProfileSchema,
  type UpdateClientProfileInput,
} from "../schemas/profile.schemas";

import {
  useMyProfile,
  useUpdateMyProfile,
} from "../hooks/userProfile";

import { validateImageFile, buildImageFormData } from "@/lib/upload";
import { useUploadMyProfileImage } from "../hooks/userProfile";

const propertyTypes = [
  {
    value: "APARTMENT",
    label: "Apartment",
  },
  {
    value: "HOUSE",
    label: "House",
  },
  {
    value: "VILLA",
    label: "Villa",
  },
  {
    value: "CONDO",
    label: "Condo",
  },
  {
    value: "COMMERCIAL",
    label: "Commercial",
  },
  {
    value: "LAND",
    label: "Land",
  },
] as const;

export function ProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useMyProfile();

  const updateProfileMutation = useUpdateMyProfile();

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

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<UpdateClientProfileInput>({
    resolver: zodResolver(
      updateClientProfileSchema,
    ),
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name,
      phone: profile.phone ?? "",
      profileImage: profile.profileImage ?? "",  // ← add this line
      preferredCity: profile.clientProfile?.preferredCity ?? "",
      preferredType: profile.clientProfile?.preferredType ?? undefined,
      maxBudget: profile.clientProfile?.maxBudget ? Number(profile.clientProfile.maxBudget) : undefined,
      minBedrooms: profile.clientProfile?.minBedrooms ?? undefined,
      minBathrooms: profile.clientProfile?.minBathrooms ?? undefined,
      preApprovedMortgage: profile.clientProfile?.preApprovedMortgage ?? false,
    });
  }, [profile, reset]);

  const onSubmit = async (
    data: UpdateClientProfileInput,
  ) => {
    try {
      await updateProfileMutation.mutateAsync(
        data,
      );

      toast.success(
        "Profile updated successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to update your profile.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and property
          preferences.
        </p>
      </div>

      {/* Profile summary */}
      <section className="rounded-xl border border-border bg-background">

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">

          {/* Avatar */}
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
            htmlFor="profileImageUpload"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition hover:opacity-90"
            aria-label="Change profile image"
          >
            <Camera className="h-3.5 w-3.5" />
          </label>

          <input
            id="profileImageUpload"
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
            <h2 className="text-xl font-semibold">
              {profile.name}
            </h2>

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
          </div>

        </div>

      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Personal information */}
        <section className="rounded-xl border border-border bg-background">

          <div className="border-b border-border p-6">
            <h2 className="font-semibold">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the information associated with your
              EstateHub account.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="name"
                {...register("name")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  value={profile.email}
                  disabled
                  className="h-11 w-full rounded-lg border border-border bg-muted px-9 text-sm text-muted-foreground outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="phone"
                  {...register("phone")}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="+251..."
                />
              </div>
               {errors.phone && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Profile image */}
            <div>
              <label
                htmlFor="profileImage"
                className="mb-2 block text-sm font-medium"
              >
                Profile image URL
              </label>

              <input
                id="profileImage"
                {...register("profileImage")}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="https://..."
              />

              {errors.profileImage && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* Property preferences */}
        <section className="rounded-xl border border-border bg-background">

          <div className="border-b border-border p-6">
            <h2 className="font-semibold">
              Property preferences
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what kind of property you're looking
              for.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            {/* Preferred city */}
            <div>
              <label
                htmlFor="preferredCity"
                className="mb-2 block text-sm font-medium"
              >
                Preferred city
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="preferredCity"
                  {...register("preferredCity")}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. Addis Ababa"
                />
                
              </div>
                {errors.preferredCity && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.preferredCity.message}
                  </p>
                )}
            </div>

            {/* Property type */}
            <div>
              <label
                htmlFor="preferredType"
                className="mb-2 block text-sm font-medium"
              >
                Preferred property type
              </label>

              <div className="relative">
                <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <select
                  id="preferredType"
                  {...register("preferredType")}
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">
                    Any property type
                  </option>

                  {propertyTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="maxBudget"
                className="mb-2 block text-sm font-medium"
              >
                Maximum budget
              </label>

              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="maxBudget"
                  type="number"
                  {...register("maxBudget", {
                    setValueAs: (value) =>
                      value === ""
                        ? undefined
                        : Number(value),
                  })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. 5000000"
                />
              </div>

              {errors.maxBudget && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.maxBudget.message}
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div>
              <label
                htmlFor="minBedrooms"
                className="mb-2 block text-sm font-medium"
              >
                Minimum bedrooms
              </label>

              <div className="relative">
                <BedDouble className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="minBedrooms"
                  type="number"
                  min="0"
                  {...register("minBedrooms", {
                    setValueAs: (value) =>
                      value === ""
                        ? undefined
                        : Number(value),
                  })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. 2"
                />
              </div>

              {errors.minBedrooms && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.minBedrooms.message}
                </p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label
                htmlFor="minBathrooms"
                className="mb-2 block text-sm font-medium"
              >
                Minimum bathrooms
              </label>

              <div className="relative">
                <Bath className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="minBathrooms"
                  type="number"
                  min="0"
                  {...register("minBathrooms", {
                    setValueAs: (value) =>
                      value === ""
                        ? undefined
                        : Number(value),
                  })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. 2"
                />
              </div>

              {errors.minBathrooms && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.minBathrooms.message}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* Mortgage */}
        <section className="rounded-xl border border-border bg-background">

          <div className="p-6">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                {...register(
                  "preApprovedMortgage",
                )}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />

              <span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  Pre-approved mortgage
                </span>

                <span className="mt-1 block text-sm text-muted-foreground">
                  I have already been pre-approved for a
                  mortgage.
                </span>
              </span>

            </label>

          </div>

        </section>

        {/* Save */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={
              updateProfileMutation.isPending ||
              !isDirty
            }
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {updateProfileMutation.isPending
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>

      </form>

            <ProfileSecurity />

    </div>
  );
}