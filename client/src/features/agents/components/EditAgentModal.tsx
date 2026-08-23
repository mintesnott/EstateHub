import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useUpdateAgent } from "../api/agent.queries";
import {
  updateAgentSchema,
  type UpdateAgentFormValues,
  SPECIALIZATIONS,
  SPECIALIZATION_LABELS,
} from "../schemas/agent.schemas";
import type { Agent } from "../types/agent.types";

interface EditAgentModalProps {
  agent: Agent;
  onClose: () => void;
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-sm font-medium";

export function EditAgentModal({ agent, onClose }: EditAgentModalProps) {
  const { mutate, isPending } = useUpdateAgent();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateAgentFormValues>({
    resolver: zodResolver(updateAgentSchema),
  });

  useEffect(() => {
    if (!agent.agentProfile) return;
    reset({
      agencyName: agent.agentProfile.agencyName ?? "",
      bio: agent.agentProfile.bio ?? "",
      experienceYears: agent.agentProfile.experienceYears ?? undefined,
      specializations: (agent.agentProfile.specializations as UpdateAgentFormValues["specializations"]) ?? [],
      officeAddress: agent.agentProfile.officeAddress ?? "",
      city: agent.agentProfile.city ?? "",
      stateRegion: agent.agentProfile.stateRegion ?? "",
      websiteUrl: agent.agentProfile.websiteUrl ?? "",
      linkedinUrl: agent.agentProfile.linkedinUrl ?? "",
      whatsappNumber: agent.agentProfile.whatsappNumber ?? "",
    });
  }, [agent, reset]);

  const onSubmit = (data: UpdateAgentFormValues) => {
    mutate(
      { agentId: agent.id, data },
      {
        onSuccess: () => {
          toast.success("Agent updated successfully");
          onClose();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err.response?.data?.message ?? "Failed to update agent");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Edit Agent</h2>
            <p className="text-sm text-muted-foreground">{agent.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Agency name</label>
              <input {...register("agencyName")} className={inputClass} />
               {errors.agencyName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.agencyName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>City</label>
              <input {...register("city")} className={inputClass} />
               {errors.city && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>State / Region</label>
              <input {...register("stateRegion")} className={inputClass} />
              {errors.stateRegion && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.stateRegion.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Experience (years)</label>
              <input
                type="number"
                min="0"
                {...register("experienceYears")}
                className={inputClass}
              />
              {errors.experienceYears && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>WhatsApp</label>
              <input {...register("whatsappNumber")} className={inputClass} />
              {errors.whatsappNumber && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.whatsappNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Office address</label>
              <input {...register("officeAddress")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Website</label>
              <input
                {...register("websiteUrl")}
                placeholder="https://..."
                className={inputClass}
              />
              {errors.websiteUrl && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>LinkedIn</label>
              <input
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
              {errors.linkedinUrl && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              rows={3}
              {...register("bio")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Specializations</label>
            <Controller
              control={control}
              name="specializations"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((spec) => {
                    const selected = field.value?.includes(spec) ?? false;
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          const current = field.value ?? [];
                          field.onChange(
                            selected
                              ? current.filter((v) => v !== spec)
                              : [...current, spec],
                          );
                        }}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {SPECIALIZATION_LABELS[spec]}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}