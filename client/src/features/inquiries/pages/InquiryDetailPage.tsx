import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useAuthStore } from "@/stores/auth.store";
import { useInquiry, useCloseInquiry, useCancelInquiry } from "../api/inquiry.queries";
import { useMarkMessagesAsRead } from "../api/message.queries";
import { InquiryStatusBadge } from "../components/InquiryStatusBadge";
import { MessageBubble } from "../components/MessageBubble";
import { MessageComposer } from "../components/MessageComposer";

const CONVERSATION_LOCKED_STATUSES = ["CANCELED", "CLOSED", "BREACHED"];

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US").format(Number(price));
}

export function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const currentUserRole = useAuthStore((state) => state.user?.role);

  const { data: inquiry, isLoading, isError } = useInquiry(id ?? "");
  const { mutate: markAsRead } = useMarkMessagesAsRead(id ?? "");
  const { mutate: closeInquiry, isPending: isClosing } = useCloseInquiry();
  const { mutate: cancelInquiry, isPending: isCanceling } = useCancelInquiry();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedRead = useRef(false);

  // Mark the other party's messages as read once, on mount, if this inquiry has messages
  useEffect(() => {
    if (inquiry?.conversation?.messages.length && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      markAsRead();
    }
  }, [inquiry?.conversation?.messages.length, markAsRead]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [inquiry?.conversation?.messages.length]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-96 rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError || !inquiry) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold">Inquiry not found</h1>
        <p className="mt-2 text-muted-foreground">
          This inquiry may not exist, or you don't have access to it.
        </p>
        <Link
          to="/inquiries"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inquiries
        </Link>
      </div>
    );
  }

  const isLocked = CONVERSATION_LOCKED_STATUSES.includes(inquiry.status);
  const isOwnClientInquiry = currentUserRole === "CLIENT" && inquiry.clientId === currentUserId;
  const isOwningAgent = currentUserRole === "AGENT" && inquiry.property.agentId === currentUserId;
  const canClose = (isOwnClientInquiry || isOwningAgent || currentUserRole === "ADMIN") && !isLocked;
  const canCancel = isOwnClientInquiry && inquiry.status === "PENDING";
  const isReadOnly = currentUserRole === "ADMIN";

  const backLink = currentUserRole === "AGENT"
      ? "/agent/inquiries"
      : currentUserRole === "ADMIN"
      ? "/admin/inquiries"
      : "/inquiries";

  const handleClose = () => {
    closeInquiry(inquiry.id, {
      onSuccess: () => toast.success("Inquiry closed"),
      onError: (error) => {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message ?? "Failed to close inquiry");
      },
    });
  };

  const handleCancel = () => {
    cancelInquiry(inquiry.id, {
      onSuccess: () => {
        toast.success("Inquiry canceled");
        navigate("/inquiries");
      },
      onError: (error) => {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message ?? "Failed to cancel inquiry");
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={backLink}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inquiries
      </Link>

      {/* Inquiry summary card */}
      <div className="mt-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-lg font-bold">{inquiry.property.title}</h1>
              <InquiryStatusBadge status={inquiry.status} />
            </div>

            <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {inquiry.property.city}
            </div>

            <p className="mt-2 text-sm font-semibold text-primary">
              ETB {formatPrice(inquiry.property.price)}
            </p>

            {currentUserRole !== "CLIENT" && (
              <p className="mt-2 text-sm text-muted-foreground">
                Inquiry from <span className="font-medium text-foreground">{inquiry.client.name}</span>
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {canClose && (
              <button
                type="button"
                onClick={handleClose}
                disabled={isClosing}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
              >
                Close inquiry
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCanceling}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="mt-4 flex h-[500px] flex-col rounded-xl border border-border bg-background">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!inquiry.conversation || inquiry.conversation.messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No messages yet.
            </p>
          ) : (
            inquiry.conversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === currentUserId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {isReadOnly ? (
          <div className="border-t border-border p-4 text-center text-xs text-muted-foreground">
            Admins can view but not participate in conversations.
          </div>
        ) : isLocked ? (
          <div className="border-t border-border p-4 text-center text-xs text-muted-foreground">
            This inquiry is {inquiry.status.toLowerCase()}. Messaging is disabled.
          </div>
        ) : (
          <MessageComposer inquiryId={inquiry.id} />
        )}
      </div>
    </div>
  );
}