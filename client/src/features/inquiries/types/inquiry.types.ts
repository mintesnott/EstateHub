export type InquiryStatus = "PENDING" | "CANCELED" | "RESPONDED" | "CLOSED" | "BREACHED";
export type InquiryPurpose = "BUY" | "RENT";

// Decimal fields serialize as strings over the wire — never number
export interface InquiryPropertySummary {
  id: string;
  title: string;
  city: string;
  price: string;
}

export interface InquiryPropertyDetail extends InquiryPropertySummary {
  agentId: string;
}

export interface InquiryClientSummary {
  id: string;
  name: string;
  email: string;
}

// Shared base fields present on every inquiry shape returned by the API
interface InquiryBase {
  id: string;
  clientId: string;
  propertyId: string;
  purpose: InquiryPurpose;
  budgetMin: string | null;
  budgetMax: string | null;
  preferredMoveInDate: string | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  preferredLocation: string | null;
  financingAvailable: boolean | null;
  viewingRequested: boolean;
  message: string | null;
  status: InquiryStatus;
  responseDeadline: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /inquiries/:id — full detail, includes conversation + client contact info
export interface Inquiry extends InquiryBase {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  property: InquiryPropertyDetail;
  conversation: {
    id: string;
    messages: Message[];
  } | null;
}

// GET /inquiries/me (client) — no agentId/phone, no conversation
export interface MyInquiryListItem extends InquiryBase {
  property: InquiryPropertySummary;
}

// GET /inquiries (agent/admin) — includes client summary, no agentId/phone, no conversation
export interface InquiryListItem extends InquiryBase {
  client: InquiryClientSummary;
  property: InquiryPropertySummary;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  metadata: Record<string, string | number | boolean | null> | null;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: "CLIENT" | "AGENT" | "ADMIN";
  };
}

export interface CreateInquiryInput {
  purpose: InquiryPurpose;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredMoveInDate?: string | null;
  minBedrooms?: number | null;
  minBathrooms?: number | null;
  preferredLocation?: string | null;
  financingAvailable?: boolean | null;
  viewingRequested?: boolean;
  message?: string | null;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  propertyId?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InquiryResponse {
  success: boolean;
  message?: string;
  data: Inquiry;
}

export interface MyInquiriesResponse {
  success: boolean;
  count: number;
  data: MyInquiryListItem[];
}

export interface InquiriesResponse {
  success: boolean;
  count: number;
  meta: PaginationMeta;
  data: InquiryListItem[];
}

export interface MyInquiryListItem extends InquiryBase {
  property: InquiryPropertySummary;
  unreadCount: number;
}

export interface InquiryListItem extends InquiryBase {
  client: InquiryClientSummary;
  property: InquiryPropertySummary;
  unreadCount: number;
}