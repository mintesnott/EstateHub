import type { InquiryStatus } from "../types/inquiry.types";

const STATUS_CONFIG: Record<InquiryStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  RESPONDED: { label: "Responded", className: "bg-blue-100 text-blue-700" },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600" },
  CANCELED: { label: "Canceled", className: "bg-gray-100 text-gray-600" },
  BREACHED: { label: "Breached", className: "bg-red-100 text-red-700" },
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}