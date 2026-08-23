
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import {
  changePasswordSchema,
  type ChangePasswordFormInput,
} from "../schemas/auth.schemas";
import { useChangePassword } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const changePasswordMutation = useChangePassword();

  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (
    data: ChangePasswordFormInput,
  ) => {
    try {
      await changePasswordMutation.mutateAsync(data);

      if (user && token) {
        setAuth(user, token, false);
      }

      toast.success(
        "Password changed successfully",
      );

      navigate("/dashboard", { replace: true });
    } catch {
      toast.error(
        "Unable to change password. Check your current password.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm lg:grid-cols-[0.9fr_1.1fr]">

          {/* =====================================================
              INFORMATION PANEL
          ====================================================== */}
          <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-12">

            <Link
              to="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-secondary-foreground">
                E
              </div>

              <span className="text-xl font-bold tracking-tight">
                Estate<span className="text-secondary">Hub</span>
              </span>
            </Link>

            <div>

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>

              <h1 className="text-3xl font-bold">
                Secure your account
              </h1>

              <p className="mt-4 leading-7 text-primary-foreground/70">
                Before continuing to EstateHub, update
                your temporary password to a secure
                password that only you know.
              </p>

              <div className="mt-7 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
                <p className="text-sm font-medium">
                  Account
                </p>

                <p className="mt-1 break-all text-sm text-primary-foreground/60">
                  {user?.email}
                </p>
              </div>

            </div>

            <p className="text-xs text-primary-foreground/40">
              EstateHub • Secure property management
            </p>

          </section>

          {/* =====================================================
              FORM PANEL
          ====================================================== */}
          <section className="p-6 sm:p-10 lg:p-12">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  E
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Estate<span className="text-secondary">Hub</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/10">
                <LockKeyhole className="h-5 w-5 text-secondary" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Change your password
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your current password must be changed
                before you can continue.
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Current password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Current password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {errors.currentPassword && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  New password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {errors.newPassword && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  Use at least 8 characters with an
                  uppercase letter and a number.
                </p>
              </div>

              {/* Confirm new password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm new password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-destructive text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Change password"}
              </button>

            </form>

          </section>

        </div>

      </div>
    </main>
  );
}
