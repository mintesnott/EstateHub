import { Link } from "react-router-dom";
import { MessageCircle, MapPin } from "lucide-react";

import { useMyInquiries } from "../api/inquiry.queries";
import { InquiryStatusBadge } from "../components/InquiryStatusBadge";
import type { InquiryStatus } from "../types/inquiry.types";

import { UnreadBadge } from "../components/UnreadBadge";
import { useState } from "react";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US").format(Number(price));
}

const STATUS_FILTERS: { label: string; value: InquiryStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" },
  { label: "Responded", value: "RESPONDED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Breached", value: "BREACHED" },
];


export function ClientInquiriesPage() {

  const [statusFilter, setStatusFilter] = useState<InquiryStatus | undefined>(undefined);

  const { data: inquiries, isLoading, isError } = useMyInquiries( {status: statusFilter} );
  
  return (
    <div>

      <h1 className="text-2xl font-bold tracking-tight">My Inquiries</h1>
      <p className="mt-2 text-muted-foreground">
        Track the inquiries you've sent to agents.
      </p>

           {/* Status filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-muted"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
            Failed to load inquiries. Please try again.
          </div>
        ) : !inquiries || inquiries.length === 0 ? (
          <div className="rounded-xl border border-border p-10 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No inquiries yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse properties and send an inquiry to get started.
            </p>
            <Link
              to="/properties"
              className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                to={`/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-secondary/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate font-semibold">
                      {inquiry.property.title}
                    </h3>
                    <InquiryStatusBadge status={inquiry.status} />
                     <UnreadBadge count={inquiry.unreadCount} />
                  </div>

                  <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {inquiry.property.city}
                  </div>

                  <p className="mt-2 text-sm font-medium text-primary">
                    ETB {formatPrice(inquiry.property.price)}
                  </p>
                </div>

                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}