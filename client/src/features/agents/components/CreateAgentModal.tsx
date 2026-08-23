import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useCreateAgent } from "../api/agent.queries";
import {
  createAgentSchema,
  type CreateAgentFormValues,
  SPECIALIZATIONS,
  SPECIALIZATION_LABELS,
} from "../schemas/agent.schemas";
import { TempPasswordModal } from "./TempPasswordModal";
import type { Agent } from "../types/agent.types";

interface CreateAgentModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-sm font-medium";

export function CreateAgentModal({ open, onClose }: CreateAgentModalProps) {
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);
  const { mutate, isPending } = useCreateAgent();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: { specializations: [] },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    setCreatedAgent(null);
    onClose();
  };

  const onSubmit = (data: CreateAgentFormValues) => {
    mutate(data, {
      onSuccess: (agent) => {
        setCreatedAgent(agent);
        reset();
      },
      onError: (error) => {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message ?? "Failed to create agent");
      },
    });
  };

  // Show temp password modal after successful creation
  if (createdAgent) {
    return (
      <TempPasswordModal
        agentName={createdAgent.name}
        agentEmail={createdAgent.email}
        tempPassword={createdAgent.tempPassword ?? ""}
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add New Agent</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          {/* Basic info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Full name <span className="text-destructive">*</span>
              </label>
              <input {...register("name")} className={inputClass} />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Email <span className="text-destructive">*</span>
              </label>
              <input {...register("email")} type="email" className={inputClass} />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                License number <span className="text-destructive">*</span>
              </label>
              <input {...register("licenseNumber")} className={inputClass} />
              {errors.licenseNumber && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Agency name</label>
              <input {...register("agencyName")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>City</label>
              <input {...register("city")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Experience (years)</label>
              <input
                type="number"
                min="0"
                {...register("experienceYears", {valueAsNumber: true})}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>WhatsApp number</label>
              <input {...register("whatsappNumber")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Commission rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register("commissionRate"), { valueAsNumber: true }}
                className={inputClass}
              />
              {errors.commissionRate && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.commissionRate.message}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              rows={3}
              {...register("bio")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Specializations */}
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
              onClick={handleClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}