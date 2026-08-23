import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useCreateProperty } from "../api/property.queries";
import { PropertyForm } from "../components/PropertyForm";
import type { PropertyFormValues } from "../schemas/propertyForm.schema";

export function CreatePropertyPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateProperty();

  const handleSubmit = (data: PropertyFormValues) => {
    mutate(
      {
        ...data,
        // Strip undefined optional fields so the backend doesn't
        // receive keys with undefined values
        bedrooms: data.bedrooms ?? undefined,
        bathrooms: data.bathrooms ?? undefined,
        area: data.area ?? undefined,
        pricePeriod: data.pricePeriod ?? "TOTAL",
        furnishedStatus: data.furnishedStatus ?? "UNFURNISHED",
        // Only send features that are explicitly true —
        // matches z.partialRecord behavior on the backend
        features: data.features
          ? Object.fromEntries(
              Object.entries(data.features).filter(
                ([, value]) => value === true,
              ),
            )
          : undefined,
      },
      {
        onSuccess: (property) => {
          toast.success("Property created successfully");
          navigate(`/agent/properties/${property.id}/edit`);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(
            err.response?.data?.message ?? "Failed to create property",
          );
        },
      },
    );
  };

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
          Add new property
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below. You can add images after saving.
        </p>
      </div>

      <PropertyForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Create property"
      />
    </div>
  );
}