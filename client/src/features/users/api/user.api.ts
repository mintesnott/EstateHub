import { api } from "@/lib/axios";
import type { UsersResponse, UserFilters } from "../types/user.types";

export async function getUsers(filters?: UserFilters): Promise<UsersResponse> {
  const response = await api.get<UsersResponse>("/users", { params: filters });
  return response.data;
}