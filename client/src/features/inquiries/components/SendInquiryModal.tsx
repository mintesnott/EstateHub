import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useCreateInquiry } from "../api/inquiry.queries";
import { sendInquirySchema, type SendInquiryFormValues } from "../schemas/inquiry.schema";

interface SendInquiryModalProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onClose: () => void;
}

export function SendInquiryModal({
  propertyId,
  propertyTitle,
  open,
  onClose,
}: SendInquiryModalProps) {
  const { mutate, isPending } = useCreateInquiry(propertyId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendInquiryFormValues>({
    resolver: zodResolver(sendInquirySchema),
    defaultValues: { purpose: "BUY", viewingRequested: false },
  });

  if (!open) return null;

  const onSubmit = (values: SendInquiryFormValues) => {
    mutate(
      {
        ...values,
        preferredMoveInDate: values.preferredMoveInDate
          ? new Date(values.preferredMoveInDate).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          toast.success("Inquiry sent successfully");
          reset();
          onClose();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err.response?.data?.message ?? "Failed to send inquiry");
        },
      },
    );
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Send Inquiry</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-1 truncate text-sm text-muted-foreground">{propertyTitle}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Purpose</label>
            <select
              {...register("purpose")}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="BUY">Buy</option>
              <option value="RENT">Rent</option>
            </select>
            {errors.purpose && (
              <p className="mt-1 text-xs text-red-600">{errors.purpose.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Min budget (ETB)</label>
              <input
                type="number"
                {...register("budgetMin")}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max budget (ETB)</label>
              <input
                type="number"
                {...register("budgetMax")}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
              {errors.budgetMax && (
                <p className="mt-1 text-xs text-red-600">{errors.budgetMax.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Min bedrooms</label>
              <input
                type="number"
                min={0}
                {...register("minBedrooms")}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min bathrooms</label>
              <input
                min={0}
                type="number"
                {...register("minBathrooms")}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Preferred move-in date</label>
            <input
              type="date"
              
              min={today}
              {...register("preferredMoveInDate")}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Preferred location</label>
            <input
              type="text"
              {...register("preferredLocation")}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="viewingRequested"
              {...register("viewingRequested")}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="viewingRequested" className="text-sm font-medium">
              Request a viewing
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="financingAvailable"
              {...register("financingAvailable")}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="financingAvailable" className="text-sm font-medium">
              Financing available
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">Message to agent</label>
            <textarea
              rows={4}
              {...register("message")}
              placeholder="I'm interested in..."
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}