
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
  Star,
} from "lucide-react";

import { useProperties } from "@/features/properties/api/property.queries";
import { FavoriteButton } from "@/features/favourite/components/FavoriteButton";

const services = [
  {
    icon: Home,
    title: "Find Properties",
    text: "Discover houses, apartments, villas, land, and commercial properties across Addis.",
  },
  {
    icon: Building2,
    title: "Buy or Rent",
    text: "Explore properties available for sale or rent and find an option that fits your needs.",
  },
  {
    icon: KeyRound,
    title: "List Your Property",
    text: "Agents can publish, manage, and update their property listings from one platform.",
  },
  {
    icon: Users,
    title: "Connect With Agents",
    text: "Connect with property agents and professionals about properties you're interested in.",
  },
  {
    icon: MessageCircle,
    title: "Property Inquiries",
    text: "Send inquiries and communicate with agents directly through EstateHub.",
  },
  {
    icon: Search,
    title: "Smart Property Search",
    text: "Filter properties by location, type, purpose, and other features that matter to you.",
  },
];

const steps = [
  {
    number: "01",
    title: "Search",
    text: "Choose your city, neighborhood, property type, and purpose.",
  },
  {
    number: "02",
    title: "Explore",
    text: "Browse properties that match what you're looking for.",
  },
  {
    number: "03",
    title: "Inquire",
    text: "Send an inquiry and ask the agent for more information.",
  },
  {
    number: "04",
    title: "Connect",
    text: "Communicate directly and take the next step toward your property.",
  },
];

const resources = [
  {
    title: "Buying in Addis",
    text: "Things to consider before buying residential, commercial, or land property.",
  },
  {
    title: "Renting Guide",
    text: "Practical information to help you find the right rental property.",
  },
  {
    title: "Property Tips",
    text: "Useful insights to help you make smarter property decisions.",
  },
];

export function HomePage() {

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  const searchParams = new URLSearchParams();

  if (location.trim()) {
    searchParams.set("city", location.trim());
  }

  if (propertyType) {
    searchParams.set("propertyType", propertyType);
  }

  if (listingType) {
    searchParams.set("listingType", listingType);
  }

  const searchUrl = `/properties?${searchParams.toString()}`;

  const { data, isLoading } = useProperties({
    page: 1,
    limit: 8,
  });

  const properties = data?.data ?? [];

  const featuredProperties = properties.slice(0, 3);

  const locations = Array.from(
    new Map(
      properties
        .filter((property) => property.city)
        .map((property) => [
          property.city,
          {
            name: property.city,
            description: `Explore properties available in ${property.city}.`,
            image: property.primaryImage?.imageUrl ?? null,
          },
        ]),
    ).values(),
  ).slice(0, 4);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(price));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="home"
        className="relative overflow-hidden bg-primary text-primary-foreground"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Hero content */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 text-sm text-primary-foreground/80 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Addis Ababa's modern property platform
            </div>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Find a place
              <span className="block text-secondary">
                you'll love
              </span>
              to call home.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-primary-foreground/70">
              Discover homes, apartments, villas, land, and commercial
              properties across Addis. Connect with agents and manage
              your property journey from one secure platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3.5 font-semibold text-secondary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/20 px-6 py-3.5 font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                Get Started
              </Link>

            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-primary-foreground/60">

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Trusted platform
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Secure experience
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                Connect with agents
              </div>

            </div>

          </div>


                {/* Hero image */}
          <div className="relative hidden lg:block">

            <div className="relative mx-auto max-w-xl">

              <div className="absolute -inset-5 rounded-[2rem] bg-secondary/10 blur-2xl" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"
                  alt="Modern residential property"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Property search card */}
                <div className="absolute bottom-6 left-6 right-6">

                  <div className="rounded-xl border border-white/20 bg-black/40 p-5 text-white shadow-lg backdrop-blur-md">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-sm text-white/70">
                          Property search
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          Find your place in Addis
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Home className="h-5 w-5" />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-8 hidden rounded-xl border border-border bg-background p-4 text-foreground shadow-xl sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      EstateHub
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Built for Addis
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
   

        </div>
      </section>

      {/* =====================================================
    SEARCH
      ===================================================== */}
      <section className="relative z-10 -mt-10 px-4">

        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-background p-4 shadow-2xl sm:p-6">

          <div className="mb-5">

            <p className="text-sm font-semibold text-secondary">
              Start your search
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Where are you looking in Addis?
            </h2>

          </div>

          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">

            {/* Location */}
            <div className="rounded-xl border border-border px-4 py-3 transition-colors focus-within:border-secondary">

              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </div>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Bole, CMC, Ayat..."
                className="mt-1 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70"
              />

            </div>

            {/* Property type */}
            <div className="rounded-xl border border-border px-4 py-3">

              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Property type
              </div>

              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
              >
                <option value="">Any property type</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="CONDO">Condominium</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>

            </div>

            {/* Purpose */}
            <div className="rounded-xl border border-border px-4 py-3">

              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" />
                Looking to
              </div>

              <select
                value={listingType}
                onChange={(event) => setListingType(event.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
              >
                <option value="">Buy or rent</option>
                <option value="FOR_SALE">Buy</option>
                <option value="FOR_RENT">Rent</option>
              </select>

            </div>

            {/* Search */}
            <Link
              to={searchUrl}
              className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>

          </div>
        </div>
      </section>


      {/* =====================================================
          FEATURED PROPERTIES
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              Featured properties
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Properties worth exploring
            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">
              Discover homes, apartments, villas, and investment
              opportunities from across Addis.
            </p>

          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {isLoading ? (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              Loading properties...
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border p-10 text-center">
              <h3 className="font-semibold">
                No properties available yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Check back soon for new listings.
              </p>
            </div>
          ) : (
            featuredProperties.map((property) => (

              <Link
                to={`/properties/${property.id}`}
                key={property.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-56 overflow-hidden">

                  {property.primaryImage?.imageUrl ? (
                    <img
                      src={property.primaryImage.imageUrl}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                      No image available
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                    {property.listingType === "FOR_SALE"
                      ? "For Sale"
                      : "For Rent"}
                  </div>

                  <FavoriteButton propertyId={property.id} />

                </div>

                <div className="p-5">

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.city}
                  </div>

                  <h3 className="mt-2 line-clamp-1 text-lg font-semibold group-hover:text-secondary">
                    {property.title}
                  </h3>

                  <p className="mt-4 font-bold text-primary">
                    ETB {formatPrice(property.price)}
                  </p>

                  {property.listingType === "FOR_RENT" &&
                    property.pricePeriod !== "TOTAL" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {property.pricePeriod?.toLowerCase()}
                      </span>
                    )}

                  <div className="mt-4 flex gap-5 border-t border-border pt-4 text-sm text-muted-foreground">

                    {property.bedrooms !== null && (
                      <span>
                        {property.bedrooms} bedrooms
                      </span>
                    )}

                    {property.bathrooms !== null && (
                      <span>
                        {property.bathrooms} bathrooms
                      </span>
                    )}

                  </div>

                </div>

              </Link>

            ))
          )}

        </div>

      </section>


      {/* =====================================================
          EXPLORE ADDIS
      ===================================================== */}
      <section className="bg-muted">

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                Explore Addis
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Find properties in places you know.
              </h2>

              <p className="mt-4 max-w-2xl text-muted-foreground">
                Start your search in Addis Ababa's neighborhoods.
              </p>

            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
            >
              Explore all locations
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {isLoading ? (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                Loading locations...
              </div>
            ) : locations.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-border bg-background p-10 text-center">
                <h3 className="font-semibold">
                  No locations available yet
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Locations will appear here as properties are added.
                </p>
              </div>
            ) : (
              locations.map((location) => (

                <Link
                  to={`/properties?city=${encodeURIComponent(location.name)}`}
                  key={location.name}
                  className="group relative h-64 overflow-hidden rounded-2xl"
                >

                  {location.image ? (
                    <img
                      src={location.image}
                      alt={location.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 text-white">

                    <div className="flex items-center gap-2">

                      <MapPin className="h-4 w-4 text-secondary" />

                      <h3 className="text-lg font-bold">
                        {location.name}
                      </h3>

                    </div>

                    <p className="mt-1 text-sm text-white/75">
                      {location.description}
                    </p>

                  </div>

                </Link>

              ))
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section
        id="about"
        className="scroll-mt-20"
      >

        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              About EstateHub
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the way Addis's property market works.
            </h2>

            <p className="mt-6 leading-7 text-muted-foreground">
              EstateHub is a modern real-estate platform designed to
              make property discovery and communication simpler for
              people across Addis.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              From finding an apartment in CMC to discovering a family
              villa in Bole, land around Addis Ababa, or a commercial
              property in another neighborhood, EstateHub brings the
              journey together in one place.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-secondary"
            >
              Join EstateHub
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {[
              {
                icon: ShieldCheck,
                title: "Trusted",
                text: "Designed around transparency and secure interactions.",
              },
              {
                icon: Search,
                title: "Simple",
                text: "Find properties without unnecessary complexity.",
              },
              {
                icon: Users,
                title: "Connected",
                text: "Bring property seekers and agents together.",
              },
              {
                icon: KeyRound,
                title: "Convenient",
                text: "Manage your property journey from one platform.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >

                  <Icon className="h-7 w-7 text-secondary" />

                  <h3 className="mt-4 font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section
        id="services"
        className="scroll-mt-20 bg-muted"
      >

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              Our services
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for your property journey.
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              EstateHub brings property discovery, communication,
              and listing management together.
            </p>

          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-border bg-background p-7 transition-all hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {service.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY ESTATEHUB
      ===================================================== */}
      <section>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              Why EstateHub
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A better way to navigate real estate.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We're building EstateHub around the things that matter
              when searching for property: simplicity, trust, and
              connection.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {[
              {
                icon: ShieldCheck,
                title: "Secure Platform",
                text: "Your account, property activity, and interactions are managed through a secure platform.",
              },
              {
                icon: CheckCircle2,
                title: "Better Discovery",
                text: "Search and filter properties based on location, type, purpose, and other requirements.",
              },
              {
                icon: Users,
                title: "Direct Connection",
                text: "Connect with agents and property professionals without unnecessary steps.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="text-center"
                >

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="bg-muted">

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Finding your next property is simple.
            </h2>

          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-4">

            <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-border md:block" />

            {steps.map((step) => (

              <div
                key={step.number}
                className="relative text-center"
              >

                <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-muted bg-secondary font-bold text-secondary-foreground shadow-md">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          RESOURCES
      ===================================================== */}
      <section
        id="resources"
        className="scroll-mt-20"
      >

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                Resources
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Helpful information for your property journey.
              </h2>

            </div>

            <span className="text-sm text-muted-foreground">
              More resources coming soon
            </span>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {resources.map((resource) => (

              <div
                key={resource.title}
                className="rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
                  <Star className="h-5 w-5 text-secondary" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {resource.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {resource.text}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-secondary">
                  Coming soon
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section
        id="contact"
        className="scroll-mt-20"
      >

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-primary-foreground sm:px-12 lg:px-20">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                  Start your journey
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Your next property could be closer than you think.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-primary-foreground/70">
                  Create your EstateHub account and start exploring
                  properties across Addis.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3.5 font-semibold text-secondary-foreground transition-all hover:-translate-y-0.5"
                >
                  Explore Properties
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/20 px-6 py-3.5 font-semibold transition-colors hover:bg-primary-foreground/10"
                >
                  Create Account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
