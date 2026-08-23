import { useState } from "react";
import { Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { useChangeEmail } from "@/features/auth/hooks/useAuth";
import axios from "axios";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeEmailDialog({
  open,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const navigate = useNavigate();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  const changeEmailMutation = useChangeEmail();

  const [confirmed, setConfirmed] = useState(false);
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newEmail, setNewEmail] = useState("");

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (changeEmailMutation.isPending) {
      return;
    }

    setConfirmed(false);
    setCurrentPassword("");
    setNewEmail("");
    onOpenChange(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response =
        await changeEmailMutation.mutateAsync({
          currentPassword,
          newEmail,
        });

      toast.success(
        response?.message ??
          "Email changed successfully. You have been signed out of all sessions."
      );

      clearAuth();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
             
       if (axios.isAxiosError(error)) {

            toast.error(
            error.response?.data?.message ??
                "Unable to change password.",
            );

            return;
        }

      toast.error(
        "Unable to change your password."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-email-title"
        className="w-full max-w-md rounded-xl border border-border bg-background shadow-2xl"
      >
        {!confirmed ? (
          <>
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>

              <h2
                id="change-email-title"
                className="mt-4 text-lg font-semibold"
              >
                Change email address?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Changing your email address is a sensitive
                security action. You will be signed out of
                all active sessions and will need to log in
                again.
              </p>

              <p className="mt-3 text-sm font-medium">
                Do you want to continue?
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setConfirmed(true)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="border-b border-border p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Change email
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Verify your password to continue.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="newEmail"
                  className="mb-2 block text-sm font-medium"
                >
                  New email address
                </label>

                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(event) =>
                    setNewEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="new@example.com"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="emailCurrentPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Current password
                </label>

                <input
                  id="emailCurrentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={changeEmailMutation.isPending}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={changeEmailMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changeEmailMutation.isPending
                  ? "Changing..."
                  : "Change email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}