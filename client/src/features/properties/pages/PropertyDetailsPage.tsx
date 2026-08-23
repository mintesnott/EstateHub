import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Maximize,
  Phone,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom"; // add to existing react-router-dom import

import { useAuthStore } from "@/stores/auth.store";
import { SendInquiryModal } from "@/features/inquiries/components/SendInquiryModal";

import {
  useProperty,
  usePropertyImages,
} from "../api/property.queries";
import { FavoriteButton } from "@/features/favourite/components/FavoriteButton";

const featureLabels: Record<string, string> = {
  PARKING: "Parking",
  BALCONY: "Balcony",
  GARDEN: "Garden",
  SECURITY: "Security",
  WATER: "Water",
  ELECTRICITY: "Electricity",
  GENERATOR: "Generator",
  ELEVATOR: "Elevator",
  AIR_CONDITIONING: "Air Conditioning",
  HEATING: "Heating",
  INTERNET: "Internet",
  SWIMMING_POOL: "Swimming Pool",
  GYM: "Gym",
  WATER_TANK: "Water Tank",
  SERVICE_QUARTERS: "Service Quarters",
};

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const handleInquiryClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setInquiryModalOpen(true);
  };

  const {
    data: property,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useProperty(id ?? "");

  const {
    data: images,
    isLoading: imagesLoading,
  } = usePropertyImages(id ?? "");

  if (propertyLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="h-[450px] rounded-2xl bg-muted" />
          <div className="h-10 w-2/3 rounded bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
        </div>
      </main>
    );
  }

  if (propertyError || !property) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">
          Property not found
        </h1>

        <p className="mt-2 text-muted-foreground">
          This property may have been removed or is no longer available.
        </p>

        <Link
          to="/properties"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US").format(
    Number(property.price),
  );

  const listingLabel =
    property.listingType === "FOR_SALE"
      ? "For Sale"
      : "For Rent";

  const activeFeatures = Object.entries(property.features ?? {})
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature);

  const galleryImages = images ?? [];

  const selectedImage =
    galleryImages.find((image) => image.id === selectedImageId) ??
    galleryImages.find((image) => image.isPrimary) ??
    galleryImages[0] ??
    null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/"
          className="hover:text-foreground"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/properties"
          className="hover:text-foreground"
        >
          Properties
        </Link>

        <span>/</span>

        <span className="max-w-[220px] truncate text-foreground">
          {property.title}
        </span>
      </nav>

      {/* Gallery */}
      <section>
        {imagesLoading ? (
          <div className="h-[350px] animate-pulse rounded-2xl bg-muted sm:h-[450px] lg:h-[550px]" />
        ) : selectedImage ? (
          <>
          
            {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="h-[350px] sm:h-[450px] lg:h-[550px]">
          <img
            src={selectedImage.imageUrl}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Previous */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const currentIndex = galleryImages.findIndex(
                (image) => image.id === selectedImage.id,
              );

              const previousIndex =
                currentIndex <= 0
                  ? galleryImages.length - 1
                  : currentIndex - 1;

              setSelectedImageId(
                galleryImages[previousIndex].id,
              );
            }}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Next */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const currentIndex = galleryImages.findIndex(
                (image) => image.id === selectedImage.id,
              );

              const nextIndex =
                currentIndex >= galleryImages.length - 1
                  ? 0
                  : currentIndex + 1;

              setSelectedImageId(
                galleryImages[nextIndex].id,
              );
            }}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Image counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {galleryImages.findIndex(
              (image) => image.id === selectedImage.id,
            ) + 1}{" "}
            / {galleryImages.length}
          </div>
        )}
      </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image) => {
                  const isSelected = image.id === selectedImage.id;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageId(image.id)}
                      className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        isSelected
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${property.title} thumbnail`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-[350px] items-center justify-center rounded-2xl border border-border bg-muted sm:h-[450px]">
            <div className="text-center text-muted-foreground">
              <Home className="mx-auto h-12 w-12" />

              <p className="mt-3">
                No images available
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Main information */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_350px]">

        {/* Left */}
        <div>

          {/* Title + favorite */}
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {listingLabel}
                </span>

                <span className="rounded-md bg-muted px-3 py-1 text-xs font-medium">
                  {property.propertyType}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {property.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />

                <span>
                  {property.city}
                  {property.region && `, ${property.region}`}
                </span>
              </div>
            </div>

            {/* Favorite */}
           <FavoriteButton propertyId={property.id} />
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-3xl font-bold text-primary">
              ETB {formattedPrice}
            </p>

            {property.listingType === "FOR_RENT" &&
              property.pricePeriod !== "TOTAL" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  per {property.pricePeriod.toLowerCase().replace("_", " ")}
                </p>
              )}
          </div>

          {/* Property stats */}
          <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-border sm:grid-cols-4">

            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <BedDouble className="h-5 w-5 text-secondary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Bedrooms
              </p>

              <p className="mt-1 font-semibold">
                {property.bedrooms ?? "N/A"}
              </p>
            </div>

            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <Bath className="h-5 w-5 text-secondary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Bathrooms
              </p>

              <p className="mt-1 font-semibold">
                {property.bathrooms ?? "N/A"}
              </p>
            </div>

            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <Maximize className="h-5 w-5 text-secondary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Area
              </p>

              <p className="mt-1 font-semibold">
                {property.area
                  ? `${property.area} m²`
                  : "N/A"}
              </p>
            </div>

            <div className="p-5">
              <Car className="h-5 w-5 text-secondary" />

              <p className="mt-3 text-sm text-muted-foreground">
                Parking
              </p>

              <p className="mt-1 font-semibold">
                {property.parkingSpaces ?? "N/A"}
              </p>
            </div>

          </div>

          {/* Description */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              Description
            </h2>

            <div className="mt-4 border-t border-border pt-5">
              <p className="leading-8 text-muted-foreground">
                {property.description}
              </p>
            </div>
          </section>

          {/* Features */}
          {activeFeatures.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold">
                Property features
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                      <Check className="h-4 w-4 text-secondary" />
                    </div>

                    <span className="text-sm font-medium">
                      {featureLabels[feature] ?? feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional information */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              Property information
            </h2>

            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">

              <div>
                <p className="text-sm text-muted-foreground">
                  Property type
                </p>

                <p className="mt-1 font-medium">
                  {property.propertyType}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Furnished status
                </p>

                <p className="mt-1 font-medium">
                  {property.furnishedStatus.replace("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 font-medium">
                  {property.status}
                </p>
              </div>

              {property.yearBuilt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Year built
                  </p>

                  <p className="mt-1 font-medium">
                    {property.yearBuilt}
                  </p>
                </div>
              )}

            </div>
          </section>
        </div>

        {/* Right — Agent */}
        <aside>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Contact agent
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <User className="h-6 w-6" />
              </div>

              <div>
                <p className="font-semibold">
                  {property.agent.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  Property Agent
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <p className="break-all text-muted-foreground">
                {property.agent.email}
              </p>

              {property.agent.phone && (
                <p className="text-muted-foreground">
                  {property.agent.phone}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {property.agent.phone && (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <Phone className="h-4 w-4" />
                  Call agent
                </a>
              )}

             {(!isAuthenticated || userRole === "CLIENT") && (
                <button
                  type="button"
                  onClick={handleInquiryClick}
                  className="w-full rounded-md border border-border px-4 py-3 font-semibold transition hover:bg-muted"
                >
                  Send inquiry
                </button>
              )}
            </div>

          </div>
        </aside>
      </section>
      
      <SendInquiryModal
        propertyId={property.id}
        propertyTitle={property.title}
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
      
    </main>
  );
}