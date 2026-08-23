import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useProperty, useUpdateProperty } from "../api/property.queries";
import { PropertyForm, propertyToFormValues } from "../components/PropertyForm";
import { PropertyImageManager } from "../components/PropertyImageManager";
import type { PropertyFormValues } from "../schemas/propertyForm.schema";

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();

  const { data: property, isLoading, isError } = useProperty(id ?? "");
  const { mutate, isPending } = useUpdateProperty();

  const handleSubmit = (data: PropertyFormValues) => {
    if (!id) return;

    mutate(
      {
        propertyId: id,
        data: {
          ...data,
          bedrooms: data.bedrooms ?? undefined,
          bathrooms: data.bathrooms ?? undefined,
          area: data.area ?? undefined,
          pricePeriod: data.pricePeriod ?? "TOTAL",
          furnishedStatus: data.furnishedStatus ?? "UNFURNISHED",
          features: data.features
            ? Object.fromEntries(
                Object.entries(data.features).filter(
                  ([, value]) => value === true,
                ),
              )
            : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Property updated successfully");
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(
            err.response?.data?.message ?? "Failed to update property",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-xl font-bold">Property not found</h1>
        <p className="mt-2 text-muted-foreground">
          This property may not exist or you don't have access to it.
        </p>
        <Link
          to="/agent/properties"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          to="/agent/properties"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my properties
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Edit property
        </h1>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {property.title}
        </p>
      </div>

      {/* Image manager sits above the form — agents typically
          want to manage images before editing text details */}
      <PropertyImageManager propertyId={property.id} />

      <div className="mt-8">
        <PropertyForm
          onSubmit={handleSubmit}
          isPending={isPending}
          defaultValues={propertyToFormValues(property)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}