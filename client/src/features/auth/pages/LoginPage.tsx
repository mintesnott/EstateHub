
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Building2, MapPin, ShieldCheck } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

import {
  loginSchema,
  type LoginFormInput,
} from "../schemas/auth.schemas";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      const result = await loginMutation.mutateAsync(data);

      setAuth(
        result.user,
        result.token,
        result.mustChangePassword,
      );

      toast.success(result.message);

      if (
        result.mustChangePassword &&
        result.user.role === "AGENT"
      ) {
        navigate("/change-password", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            BRANDING PANEL
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">

          {/* Background decoration */}
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

            {/* Main message */}
            <div className="max-w-lg">

              <div className="mb-6 flex items-center gap-2 text-sm text-primary-foreground/70">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Addis Ababa's modern property platform
              </div>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Find your place in
                <span className="block text-secondary">
                  Addis with confidence.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-primary-foreground/70">
                Discover homes, apartments, villas, land,
                and commercial properties in one secure
                platform.
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
                    Properties across Addis Ababa
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
                    <ShieldCheck className="h-4 w-4 text-secondary" />
                  </div>

                  <span>
                    A secure property experience
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom */}
            <p className="text-sm text-primary-foreground/40">
              EstateHub • Built for Addis Ababa
            </p>

          </div>
        </section>

        {/* =====================================================
            LOGIN PANEL
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
                Welcome back
              </h2>

              <p className="mt-2 text-muted-foreground">
                Sign in to your EstateHub account
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

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
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </button>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
