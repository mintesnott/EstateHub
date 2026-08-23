import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInquiry,
  getMyInquiries,
  cancelInquiry,
  closeInquiry,
  getAllInquiries,
  getInquiryById,
} from "./inquiry.api";

import type { CreateInquiryInput, InquiryFilters } from "../types/inquiry.types";

// Client: my inquiries list
export function useMyInquiries( filters?: InquiryFilters) {
  return useQuery({
    queryKey: ["inquiries", "me", filters],
    queryFn: () => getMyInquiries(filters),
  });
}

// Agent/Admin: scoped inquiries list
export function useInquiries(filters?: InquiryFilters) {
  return useQuery({
    queryKey: ["inquiries", filters],
    queryFn: () => getAllInquiries(filters),
  });
}

// Single inquiry detail (with conversation)
export function useInquiry(inquiryId: string) {
  return useQuery({
    queryKey: ["inquiry", inquiryId],
    queryFn: () => getInquiryById(inquiryId),
    enabled: !!inquiryId,
  });
}

// Client: create inquiry
export function useCreateInquiry(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInquiryInput) => createInquiry(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", "me"] });
    },
  });
}

// Client: cancel inquiry
export function useCancelInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inquiryId: string) => cancelInquiry(inquiryId),
    onSuccess: (_data, inquiryId) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", "me"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
    },
  });
}

// Client/Agent/Admin: close inquiry
export function useCloseInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inquiryId: string) => closeInquiry(inquiryId),
    onSuccess: (_data, inquiryId) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", "me"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
    },
  });
}