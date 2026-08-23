
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  registerSchema,
  type RegisterFormInput,
} from "../schemas/auth.schemas";
import { useRegister } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await registerMutation.mutateAsync(data);

      toast.success("Account created successfully");

      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to create account");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            BRANDING PANEL
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

            <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Estate<span className="text-secondary">Hub</span>
              </span>
            </Link>

            {/* Main content */}
            <div className="max-w-lg">

              <div className="mb-6 flex items-center gap-2 text-sm text-primary-foreground/70">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Addis Ababa's modern property platform
              </div>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Your next place
                <span className="block text-secondary">
                  starts here.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-primary-foreground/70">
                Create your EstateHub account and start
                discovering properties across Addis Ababa.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Building2 className="h-4 w-4 text-secondary" />
                  </div>

                  <span>
                    Homes • Apartments • Villas • Land
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </div>

                  <span>
                    Explore properties across Addis Ababa
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
                    <ShieldCheck className="h-4 w-4 text-secondary" />
                  </div>

                  <span>
                    Simple and secure property experience
                  </span>
                </div>

              </div>
            </div>

            <p className="text-sm text-primary-foreground/40">
              EstateHub • Built for Addis Ababa
            </p>

          </div>
        </section>

        {/* =====================================================
            REGISTER PANEL
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:min-h-0 lg:px-12 xl:px-20">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="h-5 w-5" />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Estate<span className="text-secondary">Hub</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-3xl font-bold tracking-tight">
                Create an account
              </h2>

              <p className="mt-2 text-muted-foreground">
                Join EstateHub and start exploring properties
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {errors.name && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {errors.email && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {errors.password && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  At least 8 characters with uppercase,
                  lowercase, and a number.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
