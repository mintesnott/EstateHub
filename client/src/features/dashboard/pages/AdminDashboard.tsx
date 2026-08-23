import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  UserCog,
  MessageCircle,
  MapPin,
  TrendingUp,
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

import { useAdminDashboard } from "../api/dashboard.queries";
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

function formatShortPrice(value: string | number) {
  const num = Number(value);
  if (num >= 1_000_000_000) return `ETB ${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `ETB ${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `ETB ${(num / 1_000).toFixed(1)}K`;
  return `ETB ${num}`;
}

export function AdminDashboard() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
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

  const listingData = [
    { name: "For Sale", value: data.propertiesByListing["FOR_SALE"] ?? 0 },
    { name: "For Rent", value: data.propertiesByListing["FOR_RENT"] ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards — row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={data.totalProperties}
          icon={Building2}
        />
        <StatCard
          label="Total Agents"
          value={data.totalAgents}
          icon={UserCog}
        />
        <StatCard
          label="Total Clients"
          value={data.totalClients}
          icon={Users}
        />
        <StatCard
          label="Total Inquiries"
          value={data.totalInquiries}
          icon={MessageCircle}
        />
      </div>

      {/* Stat cards — row 2 (value stats) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Listed Value"
          value={formatShortPrice(data.totalListedValue)}
          icon={TrendingUp}
          sub={`ETB ${formatPrice(data.totalListedValue)}`}
        />
        <StatCard
          label="Avg Property Price"
          value={formatShortPrice(data.avgPropertyPrice)}
          icon={TrendingUp}
          sub={`ETB ${formatPrice(data.avgPropertyPrice)}`}
        />
        <StatCard
          label="Total Sold Value"
          value={formatShortPrice(data.totalSoldValue)}
          icon={TrendingUp}
          sub={data.totalSoldValue === "0" ? "No sold properties yet" : undefined}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property type pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Properties by Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
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
        </div>

        {/* Listing type donut */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">For Sale vs For Rent</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={listingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#6366f1" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inquiry status bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Inquiries by Status</h2>
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
                    fill={INQUIRY_STATUS_COLORS[entry.name] ?? "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top cities bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Top Cities by Listings</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.topCities} barSize={32}>
              <XAxis dataKey="city" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

              <Tooltip content={<CustomTooltip formatter={(name) => name.charAt(0) + name.slice(1).toLowerCase().replace(/_/g, " ") } />} />

              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent agents */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent Agents</h2>
          <Link
            to="/admin/agents"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {data.recentAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium">
                  {agent.agentProfile?.agencyName ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agent.agentProfile?.licenseNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent Inquiries</h2>
          <Link
            to="/admin/inquiries"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {data.recentInquiries.map((inquiry) => (
            <Link
              key={inquiry.id}
              to={`/inquiries/${inquiry.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {inquiry.property.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {inquiry.property.city} · {inquiry.client.name}
                </p>
              </div>
              <InquiryStatusBadge
                status={inquiry.status as InquiryStatus}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}