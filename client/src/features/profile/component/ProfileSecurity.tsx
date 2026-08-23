import { useState } from "react";
import {
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import { ChangeEmailDialog } from "./ChangeEmailDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function ProfileSecurity() {
  const user = useAuthStore((state) => state.user);

  const [emailDialogOpen, setEmailDialogOpen] =
    useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] =
    useState(false);

  return (
    <>
      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </div>

            <div>
              <h2 className="font-semibold">
                Security
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your email address and password.
                Security changes will <span className="text-red-500">sign you out</span> of all
                active sessions.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {/* Email */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <h3 className="text-sm font-semibold">
                  Email address
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEmailDialogOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
            >
              Change email
            </button>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <h3 className="text-sm font-semibold">
                  Password
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Change your EstateHub account password.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPasswordDialogOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
            >
              Change password
            </button>
          </div>
        </div>
      </section>

      <ChangeEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </>
  );
}