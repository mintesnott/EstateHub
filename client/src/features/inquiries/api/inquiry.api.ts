import { api } from "@/lib/axios";

import type {
  Inquiry,
  InquiryResponse,
  MyInquiriesResponse,
  InquiriesResponse,
  CreateInquiryInput,
  InquiryFilters,
} from "../types/inquiry.types";

// Client: submit an inquiry for a property
export async function createInquiry(
  propertyId: string,
  payload: CreateInquiryInput,
): Promise<Inquiry> {
  const response = await api.post<InquiryResponse>(
    `/properties/${propertyId}/inquiries`,
    payload,
  );

  return response.data.data;
}

// Client: their own inquiries
export async function getMyInquiries(
  filters?: InquiryFilters,
): Promise<MyInquiriesResponse["data"]> {
  const response = await api.get<MyInquiriesResponse>("/inquiries/me", {
    params: filters,
  });

  return response.data.data;
}

// Agent/Admin: scoped inquiry list
export async function getAllInquiries(
  filters?: InquiryFilters,
): Promise<InquiriesResponse> {
  const response = await api.get<InquiriesResponse>("/inquiries", {
    params: filters,
  });

  return response.data;
}


// Client: cancel their own inquiry
export async function cancelInquiry(inquiryId: string): Promise<Inquiry> {
  const response = await api.patch<InquiryResponse>(
    `/inquiries/${inquiryId}/cancel`,
  );

  return response.data.data;
}

// Client, Agent, or Admin: close an inquiry (ownership enforced server-side)
export async function closeInquiry(inquiryId: string): Promise<Inquiry> {
  const response = await api.patch<InquiryResponse>(
    `/inquiries/${inquiryId}/close`,
  );

  return response.data.data;
}


// Client, Agent, or Admin: full inquiry detail + conversation (ownership enforced server-side)
export async function getInquiryById(inquiryId: string): Promise<Inquiry> {
  const response = await api.get<InquiryResponse>(`/inquiries/${inquiryId}`);

  return response.data.data;
}