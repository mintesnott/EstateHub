import { api } from "@/lib/axios";
import type {
  AgentDashboardData,
  AdminDashboardData,
  AgentDashboardResponse,
  AdminDashboardResponse,
} from "../types/dashboard.types";

export async function getAgentDashboard(): Promise<AgentDashboardData> {
  const response = await api.get<AgentDashboardResponse>("/dashboard/agent");
  return response.data.data;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await api.get<AdminDashboardResponse>("/dashboard/admin");
  return response.data.data;
}