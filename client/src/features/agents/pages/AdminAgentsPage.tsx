import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Plus,
  UserCog,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Star,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { useAgents, useDeleteAgent } from "../api/agent.queries";
import { CreateAgentModal } from "../components/CreateAgentModal";
import { EditAgentModal } from "../components/EditAgentModal";
import {
  SPECIALIZATIONS,
  SPECIALIZATION_LABELS,
} from "../schemas/agent.schemas";
import type { Agent, Specialization } from "../types/agent.types";


export function AdminAgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const specialization =
    (searchParams.get("specialization") as Specialization) || undefined;
  const sortBy =
    (searchParams.get("sortBy") as "name" | "email" | "createdAt" | "agencyName") ||
    "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data, isLoading, isError } = useAgents({
    search: search || undefined,
    specialization,
    sortBy,
    sortOrder,
    page,
    limit: 10,
  });

  const { mutate: deleteAgent } = useDeleteAgent();

  const agents = data?.data ?? [];
  const meta = data?.meta;

  const setParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const handleDelete = (agent: Agent) => {
    if (
      !window.confirm(
        `Delete agent ${agent.name}? This will also delete all their properties, inquiries and related data.`,
      )
    )
      return;

    setDeletingId(agent.id);
    deleteAgent(agent.id, {
      onSuccess: () => {
        toast.success("Agent deleted successfully");
        setDeletingId(null);
      },
      onError: () => {
        toast.error("Failed to delete agent");
        setDeletingId(null);
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Agent management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta?.total ?? 0} agents on the platform
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setParam("search", e.target.value || undefined)}
            placeholder="Search by name, email or agency..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Specialization filter */}
        <select
          value={specialization ?? ""}
          onChange={(e) =>
            setParam("specialization", e.target.value || undefined)
          }
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>
              {SPECIALIZATION_LABELS[spec]}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split(":");
            const params = new URLSearchParams(searchParams);
            params.set("sortBy", by);
            params.set("sortOrder", order);
            params.delete("page");
            setSearchParams(params);
          }}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A–Z</option>
          <option value="name:desc">Name Z–A</option>
          <option value="agencyName:asc">Agency A–Z</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold">Failed to load agents</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-xl border border-border p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <UserCog className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">No agents found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {search || specialization
              ? "Try adjusting your filters."
              : "Add your first agent to get started."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                {/* Agent header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary font-semibold">
                    {agent.profileImage ? (
                      <img
                        src={agent.profileImage}
                        alt={agent.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      agent.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{agent.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {agent.email}
                    </p>
                    {agent.agentProfile?.agencyName && (
                      <p className="truncate text-xs font-medium text-secondary">
                        {agent.agentProfile.agencyName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <p className="font-mono">
                    {agent.agentProfile?.licenseNumber}
                  </p>

                  {agent.agentProfile?.city && (
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {agent.agentProfile.city}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {Number(agent.agentProfile?.ratingAvg ?? 0).toFixed(1)}
                    {" "}
                    ({agent.agentProfile?.totalReviews ?? 0} reviews)
                    {agent.agentProfile?.experienceYears
                      ? ` · ${agent.agentProfile.experienceYears} yrs exp`
                      : ""}
                  </div>
                </div>

                {/* Specializations */}
                {agent.agentProfile?.specializations &&
                  (agent.agentProfile.specializations as string[]).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(agent.agentProfile.specializations as string[])
                        .slice(0, 3)
                        .map((spec) => (
                          <span
                            key={spec}
                            className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary"
                          >
                            {SPECIALIZATION_LABELS[spec as keyof typeof SPECIALIZATION_LABELS] ?? spec}
                          </span>
                        ))}
                      {(agent.agentProfile.specializations as string[]).length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          +{(agent.agentProfile.specializations as string[]).length - 3}
                        </span>
                      )}
                    </div>
                  )}

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                  <Link
                    to={`/admin/agents/${agent.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEditingAgent(agent)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(agent)}
                    disabled={deletingId === agent.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === agent.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updatePage(page - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => updatePage(page + 1)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateAgentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {editingAgent && (
        <EditAgentModal
          agent={editingAgent}
          onClose={() => setEditingAgent(null)}
        />
      )}
    </div>
  );
}