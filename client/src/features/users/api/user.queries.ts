import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user.api";
import type { UserFilters } from "../types/user.types";

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
  });
}