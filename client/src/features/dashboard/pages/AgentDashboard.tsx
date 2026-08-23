import { Link } from "react-router-dom";
import {
  Building2,
  MessageCircle,
  Clock,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useAgentDashboard } from "../api/dashboard.queries";
import { StatCard } from "../components/StatCard";
import { InquiryStatusBadge } from "@/features/inquiries/components/InquiryStatusBadge";
import type { InquiryStatus } from "@/features/inquiries/types/inquiry.types";
import { CustomTooltip } from "../components/CustomTooltip";

const PROPERTY_TYPE_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e", "#8b5cf6",
];

const INQUIRY_STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  RESPONDED: "#3b82f6",
  CLOSED: "#6b7280",
  CANCELED: "#9ca3af",
  BREACHED: "#ef4444",
};

function formatPrice(value: string | number) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export function AgentDashboard() {
  const { data, isLoading, isError } = useAgentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="font-semibold">Failed to load dashboard</p>
        <p className="mt-1 text-sm text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  const propertyTypeData = Object.entries(data.propertiesByType).map(
    ([name, value]) => ({ name, value }),
  );

  const inquiryStatusData = Object.entries(data.inquiriesByStatus).map(
    ([name, value]) => ({ name, value }),
  );

  const pendingInquiries = data.inquiriesByStatus["PENDING"] ?? 0;
  const forSale = data.propertiesByListing["FOR_SALE"] ?? 0;
  const forRent = data.propertiesByListing["FOR_RENT"] ?? 0;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={data.totalProperties}
          icon={Building2}
          sub={`${forSale} for sale · ${forRent} for rent`}
        />
        <StatCard
          label="Total Inquiries"
          value={data.totalInquiries}
          icon={MessageCircle}
        />
        <StatCard
          label="Pending Inquiries"
          value={pendingInquiries}
          icon={Clock}
          sub="Awaiting your response"
        />
        <StatCard
          label="Available Properties"
          value={data.propertiesByStatus["AVAILABLE"] ?? 0}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property type pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Properties by Type</h2>
          {propertyTypeData.length === 0 ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {propertyTypeData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        PROPERTY_TYPE_COLORS[index % PROPERTY_TYPE_COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Inquiry status bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Inquiries by Status</h2>
          {inquiryStatusData.length === 0 ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No inquiries yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={inquiryStatusData} barSize={32}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    v.charAt(0) + v.slice(1).toLowerCase()
                  }
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                
                <Tooltip content={<CustomTooltip formatter={(name) => name.charAt(0) + name.slice(1).toLowerCase().replace(/_/g, " ") } />} />

                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {inquiryStatusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        INQUIRY_STATUS_COLORS[entry.name] ?? "#6366f1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent properties */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent Properties</h2>
          <Link
            to="/agent/properties"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {data.recentProperties.length === 0 ? (
            <p className="p-5 text-center text-sm text-muted-foreground">
              No properties yet
            </p>
          ) : (
            data.recentProperties.map((property) => (
              <Link
                key={property.id}
                to={`/agent/properties/${property.id}/edit`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {property.primaryImage ? (
                    <img
                      src={property.primaryImage.imageUrl}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{property.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {property.city}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-primary">
                    ETB {formatPrice(property.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {property.status.toLowerCase()}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent Inquiries</h2>
          <Link
            to="/agent/inquiries"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {data.recentInquiries.length === 0 ? (
            <p className="p-5 text-center text-sm text-muted-foreground">
              No inquiries yet
            </p>
          ) : (
            data.recentInquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                to={`/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {inquiry.property.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inquiry.client.name}
                  </p>
                </div>

                <InquiryStatusBadge
                  status={inquiry.status as InquiryStatus}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}