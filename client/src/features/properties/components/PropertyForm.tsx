import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
  propertyFormSchema,
  type PropertyFormValues,
  PROPERTY_FEATURES,
  FEATURE_LABELS,
} from "../schemas/propertyForm.schema";

import type { Property } from "../types/property.types";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormValues) => void;
  isPending: boolean;
  defaultValues?: Partial<PropertyFormValues>;
  submitLabel?: string;
}

// Converts a full Property (from API) into form default values.
// Called by EditPropertyPage before passing defaults to PropertyForm.
export function propertyToFormValues(
  property: Property,
): Partial<PropertyFormValues> {
  return {
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    listingType: property.listingType,
    price: Number(property.price),
    pricePeriod: property.pricePeriod,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    area: property.area ? Number(property.area) : undefined,
    furnishedStatus: property.furnishedStatus,
    city: property.city,
    features: (property.features as Partial<PropertyFormValues["features"]>) ?? undefined,
  };
}

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-2 block text-sm font-medium";

const errorClass = "mt-1.5 text-sm text-destructive";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export function PropertyForm({
  onSubmit,
  isPending,
  defaultValues,
  submitLabel = "Save property",
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      pricePeriod: "TOTAL",
      furnishedStatus: "UNFURNISHED",
      ...defaultValues,
    },
  });

  // When defaultValues change (edit page finishes loading), sync the form.
  useEffect(() => {
    if (defaultValues) {
      reset({
        pricePeriod: "TOTAL",
        furnishedStatus: "UNFURNISHED",
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  const listingType = watch("listingType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Basic information */}
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">Basic information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The core details shown to potential buyers and renters.
          </p>
        </div>

        <div className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Property title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              {...register("title")}
              placeholder="e.g. Modern 2-bedroom apartment in Bole"
              className={inputClass}
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              {...register("description")}
              placeholder="Describe the property in detail..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          {/* Property type + Listing type */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="propertyType" className={labelClass}>
                Property type <span className="text-destructive">*</span>
              </label>
              <select id="propertyType" {...register("propertyType")} className={selectClass}>
                <option value="">Select type</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
                <option value="CONDO">Condo</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
              {errors.propertyType && (
                <p className={errorClass}>{errors.propertyType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="listingType" className={labelClass}>
                Listing type <span className="text-destructive">*</span>
              </label>
              <select id="listingType" {...register("listingType")} className={selectClass}>
                <option value="">Select listing type</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
              </select>
              {errors.listingType && (
                <p className={errorClass}>{errors.listingType.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">Pricing</h2>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClass}>
              Price (ETB) <span className="text-destructive">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              {...register("price")}
              placeholder="e.g. 5000000"
              className={inputClass}
            />
            {errors.price && (
              <p className={errorClass}>{errors.price.message}</p>
            )}
          </div>

          {/* Only show pricePeriod when FOR_RENT */}
          {listingType === "FOR_RENT" && (
            <div>
              <label htmlFor="pricePeriod" className={labelClass}>
                Price period
              </label>
              <select id="pricePeriod" {...register("pricePeriod")} className={selectClass}>
                <option value="TOTAL">Total</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">Property details</h2>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="city" className={labelClass}>
              City <span className="text-destructive">*</span>
            </label>
            <input
              id="city"
              {...register("city")}
              placeholder="e.g. Addis Ababa"
              className={inputClass}
            />
            {errors.city && (
              <p className={errorClass}>{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bedrooms" className={labelClass}>
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              min="0"
              {...register("bedrooms")}
              placeholder="e.g. 3"
              className={inputClass}
            />
            {errors.bedrooms && (
              <p className={errorClass}>{errors.bedrooms.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bathrooms" className={labelClass}>
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              min="0"
              {...register("bathrooms")}
              placeholder="e.g. 2"
              className={inputClass}
            />
            {errors.bathrooms && (
              <p className={errorClass}>{errors.bathrooms.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>
              Area (m²)
            </label>
            <input
              id="area"
              type="number"
              min="0"
              {...register("area")}
              placeholder="e.g. 120"
              className={inputClass}
            />
            {errors.area && (
              <p className={errorClass}>{errors.area.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="furnishedStatus" className={labelClass}>
              Furnished status
            </label>
            <select
              id="furnishedStatus"
              {...register("furnishedStatus")}
              className={selectClass}
            >
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SEMI_FURNISHED">Semi furnished</option>
              <option value="FULLY_FURNISHED">Fully furnished</option>
            </select>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">Features & amenities</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select all features that apply to this property.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4">
          {PROPERTY_FEATURES.map((feature) => (
            <label
              key={feature}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-3 transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="checkbox"
                {...register(`features.${feature}`)}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-sm font-medium">
                {FEATURE_LABELS[feature]}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>

    </form>
  );
}