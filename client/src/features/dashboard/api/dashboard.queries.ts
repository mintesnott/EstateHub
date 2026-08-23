import { useQuery } from "@tanstack/react-query";
import { getAgentDashboard, getAdminDashboard } from "./dashboard.api";

export function useAgentDashboard() {
  return useQuery({
    queryKey: ["dashboard", "agent"],
    queryFn: getAgentDashboard,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: getAdminDashboard,
  });
}