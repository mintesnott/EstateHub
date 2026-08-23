import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Globe,
  MessageCircle,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { useAgent, useAgentProperties } from "../api/agent.queries";
import { EditAgentModal } from "../components/EditAgentModal";
import { useDeleteProperty, useUpdateProperty } from "@/features/properties/api/property.queries";
import { PropertyForm, propertyToFormValues } from "@/features/properties/components/PropertyForm";
import { PropertyImageManager } from "@/features/properties/components/PropertyImageManager";
import { SPECIALIZATION_LABELS } from "../schemas/agent.schemas";
import type { Agent } from "../types/agent.types";
import type { Property } from "@/features/properties/types/property.types";
import type { PropertyFormValues } from "@/features/properties/schemas/propertyForm.schema";
import type { AxiosError } from "axios";

function formatPrice(price: string | number) {
  return new Intl.NumberFormat("en-US").format(Number(price));
}

// Inline edit panel — renders below the property list when a property is selected
function PropertyEditPanel({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const { mutate, isPending } = useUpdateProperty();

  const handleSubmit = (data: PropertyFormValues) => {
    mutate(
      {
        propertyId: property.id,
        data: {
          ...data,
          bedrooms: data.bedrooms ?? undefined,
          bathrooms: data.bathrooms ?? undefined,
          area: data.area ?? undefined,
          pricePeriod: data.pricePeriod ?? "TOTAL",
          furnishedStatus: data.furnishedStatus ?? "UNFURNISHED",
          features: data.features
            ? Object.fromEntries(
                Object.entries(data.features).filter(([, v]) => v === true),
              )
            : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Property updated");
          onClose();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err.response?.data?.message ?? "Failed to update property");
        },
      },
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-primary/30 bg-background p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold">Editing: {property.title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Cancel
        </button>
      </div>

      <PropertyImageManager propertyId={property.id} />

      <div className="mt-6">
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

export function AdminAgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [editAgentOpen, setEditAgentOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  const { data: agent, isLoading: agentLoading, isError: agentError } = useAgent(id ?? "");
  const { data: propertiesData, isLoading: propertiesLoading } = useAgentProperties(id ?? "");
  const { mutate: deleteProperty } = useDeleteProperty();

  const properties = propertiesData?.data ?? [];
  const pagination = propertiesData?.pagination;

  const handleDeleteProperty = (property: Property) => {
    if (
      !window.confirm(
        `Delete "${property.title}"? This cannot be undone.`,
      )
    )
      return;

    setDeletingPropertyId(property.id);
    deleteProperty(property.id, {
      onSuccess: () => {
        toast.success("Property deleted");
        setDeletingPropertyId(null);
        if (editingProperty?.id === property.id) setEditingProperty(null);
      },
      onError: () => {
        toast.error("Failed to delete property");
        setDeletingPropertyId(null);
      },
    });
  };

  if (agentLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (agentError || !agent) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold">Agent not found</h1>
        <Link
          to="/admin/agents"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to agents
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/admin/agents"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to agents
      </Link>

      {/* Agent profile card */}
      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary/15 text-xl font-bold text-secondary">
              {agent.profileImage ? (
                <img
                  src={agent.profileImage}
                  alt={agent.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                agent.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold">{agent.name}</h1>
              {agent.agentProfile?.agencyName && (
                <p className="text-sm font-medium text-secondary">
                  {agent.agentProfile.agencyName}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {agent.agentProfile?.licenseNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditAgentOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit agent
          </button>
        </div>

        {/* Contact */}
        <div className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {agent.email}
          </span>

          {agent.phone && (
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {agent.phone}
            </span>
          )}

          {agent.agentProfile?.city && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {agent.agentProfile.city}
              {agent.agentProfile.stateRegion && `, ${agent.agentProfile.stateRegion}`}
            </span>
          )}

          {agent.agentProfile?.whatsappNumber && (
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {agent.agentProfile.whatsappNumber}
            </span>
          )}

          {agent.agentProfile?.websiteUrl && (
            <a 
              href={agent.agentProfile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}

          {agent.agentProfile?.linkedinUrl && (
            <a
              href={agent.agentProfile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap gap-6 border-t border-border pt-5 text-sm">
          <div>
            <p className="text-muted-foreground">Rating</p>
            <p className="mt-0.5 flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 text-secondary" />
              {Number(agent.agentProfile?.ratingAvg ?? 0).toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({agent.agentProfile?.totalReviews ?? 0} reviews)
              </span>
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Experience</p>
            <p className="mt-0.5 font-semibold">
              {agent.agentProfile?.experienceYears ?? 0} years
            </p>
          </div>

          {agent.agentProfile?.commissionRate && (
            <div>
              <p className="text-muted-foreground">Commission rate</p>
              <p className="mt-0.5 font-semibold">
                {Number(agent.agentProfile.commissionRate).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {/* Specializations */}
        {agent.agentProfile?.specializations &&
          (agent.agentProfile.specializations as string[]).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(agent.agentProfile.specializations as string[]).map((spec) => (
                <span
                  key={spec}
                  className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                >
                  {SPECIALIZATION_LABELS[spec as keyof typeof SPECIALIZATION_LABELS] ?? spec}
                </span>
              ))}
            </div>
          )}

        {/* Bio */}
        {agent.agentProfile?.bio && (
          <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {agent.agentProfile.bio}
          </p>
        )}
      </div>

      {/* Properties section */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Properties
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({pagination?.totalCount ?? 0})
            </span>
          </h2>
        </div>

        {propertiesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-border p-10 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No properties yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This agent hasn't listed any properties.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <div key={property.id}>
                <div
                  className={`flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors ${
                    editingProperty?.id === property.id
                      ? "border-primary/40"
                      : "border-border"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {property.primaryImage ? (
                      <img
                        src={property.primaryImage.imageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{property.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {property.city}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-primary">
                      ETB {formatPrice(property.price)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                    {property.status.toLowerCase()}
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProperty(
                          editingProperty?.id === property.id ? null : property,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property)}
                      disabled={deletingPropertyId === property.id}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deletingPropertyId === property.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline edit panel — expands below selected property */}
                {editingProperty?.id === property.id && (
                  <PropertyEditPanel
                    property={property}
                    onClose={() => setEditingProperty(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit agent modal */}
      {editAgentOpen && (
        <EditAgentModal
          agent={agent as Agent}
          onClose={() => setEditAgentOpen(false)}
        />
      )}
    </div>
  );
}