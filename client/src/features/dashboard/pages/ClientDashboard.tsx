
import {
  ArrowRight,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

import { useMyFavorites } from "@/features/favourite/api/favorite.queries";
import { useMyInquiries } from "@/features/inquiries/api/inquiry.queries";
import { InquiryStatusBadge } from "@/features/inquiries/components/InquiryStatusBadge";
import { UnreadBadge } from "@/features/inquiries/components/UnreadBadge";
import { formattedPrice } from "@/utils/helper";

export function ClientDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: favoritesData } = useMyFavorites();
  const { data: inquiriesData, isLoading: isLoadingInquiries } = useMyInquiries();

  const favorites = favoritesData?.data ?? [];
  const inquiries = inquiriesData ?? [];

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">

      {/* =====================================================
          WELCOME
      ====================================================== */}
      <section>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-secondary">
              Client Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Find your next property, keep track of your favorites,
              and manage your conversations with agents.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
            Browse properties
          </Link>
        </div>
      </section>

      {/* =====================================================
          QUICK STATS
      ====================================================== */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={Heart}
          label="Favorites"
          value={String(favorites.length)}
          description="Saved properties"
          iconClassName="text-rose-500"
          iconBackground="bg-rose-500/10"
          to="/favorites"
        />

        <StatCard
          icon={MessageCircle}
          label="Inquiries"
          value={String(inquiries.length)}
          description="Your conversations"
          iconClassName="text-blue-500"
          iconBackground="bg-blue-500/10"
          to="/inquiries"
        />

        <StatCard
          icon={Home}
          label="Properties viewed"
          value="0"
          description="Recently viewed"
          iconClassName="text-secondary"
          iconBackground="bg-secondary/10"
        />

        <StatCard
          icon={Sparkles}
          label="Recommendations"
          value="0"
          description="Based on your preferences"
          iconClassName="text-primary"
          iconBackground="bg-primary/10"
        />

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* ---------------------------------------------------
            FAVORITES
        ---------------------------------------------------- */}
        <div className="rounded-xl border border-border bg-background">

          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Favorite properties
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Properties you saved for later.
              </p>
            </div>

            <Link
              to="/favorites"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-5">
            {favorites.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No favorites yet"
                description="When you find a property you like, save it here so you can easily come back to it."
                actionLabel="Explore properties"
                actionTo="/properties"
              />
            ) : (
              <div className="space-y-4">
                {favorites.slice(0, 3).map((favorite) => {
                  const property = favorite.property;

                  const primaryImage =
                    property.images?.find(
                      (image) => image.isPrimary,
                    ) ?? property.images?.[0];

                  return (
                    <Link
                      key={favorite.id}
                      to={`/properties/${property.id}`}
                      className="group flex gap-4 rounded-lg border border-border p-3 transition hover:bg-muted/50"
                    >
                      {/* Image */}
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                        {primaryImage ? (
                          <img
                            src={primaryImage.imageUrl}
                            alt={property.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {property.city}
                        </p>

                        <h3 className="mt-1 line-clamp-1 text-sm font-semibold group-hover:text-secondary">
                          {property.title}
                        </h3>

                        <p className="mt-2 text-sm font-bold text-primary">
                          ETB{" "}
                          {new Intl.NumberFormat("en-US").format(
                            Number(property.price),
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}

                {favorites.length > 3 && (
                  <Link
                    to="/favorites"
                    className="inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary hover:text-secondary"
                  >
                    View all {favorites.length} favorites
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

    {/* ---------------------------------------------------
            INQUIRIES
        ---------------------------------------------------- */}
        <div className="rounded-xl border border-border bg-background">

          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Recent inquiries
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your latest conversations with agents.
              </p>
            </div>

            <Link
              to="/inquiries"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-5">
            {isLoadingInquiries ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="No inquiries yet"
                description="Contact an agent from a property you're interested in to start a conversation."
                actionLabel="Find a property"
                actionTo="/properties"
              />
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    to={`/inquiries/${inquiry.id}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border p-3.5 transition hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold group-hover:text-secondary">
                          {inquiry.property.title}
                        </h3>
                        <InquiryStatusBadge status={inquiry.status} />
                        <UnreadBadge count={inquiry.unreadCount} />
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {inquiry.property.city}
                      </div>

                      <p className="mt-1.5 text-xs font-bold text-primary">
                        ETB {formattedPrice(inquiry.property.price)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}

                {inquiries.length > 3 && (
                  <Link
                    to="/inquiries"
                    className="inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary hover:text-secondary"
                  >
                    View all {inquiries.length} inquiries
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

      </section>

      {/* =====================================================
          GET STARTED
      ====================================================== */}
      <section className="overflow-hidden rounded-xl border border-border bg-muted/40">

        <div className="grid lg:grid-cols-[1.4fr_1fr]">

          <div className="p-6 sm:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Start your property search
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Explore available properties across Addis Ababa.
              Compare listings, view property details, save your
              favorites, and contact agents when you find the right place.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Browse properties
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                Complete your profile
              </Link>
            </div>
          </div>

          <div className="hidden items-center justify-center border-l border-border bg-background/50 p-8 lg:flex">
            <div className="max-w-xs text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                <Home className="h-8 w-8 text-secondary" />
              </div>

              <h3 className="mt-5 font-semibold">
                Your next home could be here
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use EstateHub to discover properties and connect
                directly with agents.
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

interface StatCardProps {
  icon: typeof Heart;
  label: string;
  value: string;
  description: string;
  iconClassName: string;
  iconBackground: string;
  to?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
  iconBackground,
  to,
}: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-2 text-2xl font-bold tracking-tight">
          {value}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBackground}`}
      >
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="rounded-xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-sm"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      {content}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

interface EmptyStateProps {
  icon: typeof Heart;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <Link
        to={actionTo}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}
