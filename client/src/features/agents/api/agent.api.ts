import { api } from "@/lib/axios";
import type {
  Agent,
  AgentFilters,
  AgentsResponse,
  AgentResponse,
  CreateAgentInput,
  UpdateAgentInput,
} from "../types/agent.types";

import type { PropertiesResponse, PropertyFilters } from "@/features/properties/types/property.types";



export async function getAgents(
  filters?: AgentFilters,
): Promise<AgentsResponse> {
  const response = await api.get<AgentsResponse>("/agents", {
    params: filters,
  });
  return response.data;
}

export async function getAgentById(agentId: string): Promise<Agent> {
  const response = await api.get<AgentResponse>(`/agents/${agentId}`);
  return response.data.data;
}

export async function createAgent(data: CreateAgentInput): Promise<Agent> {
  const response = await api.post<AgentResponse>("/agents", data);
  return response.data.data;
}

export async function updateAgent(
  agentId: string,
  data: UpdateAgentInput,
): Promise<Agent> {
  const response = await api.patch<AgentResponse>(`/agents/${agentId}`, data);
  return response.data.data;
}

export async function deleteAgent(agentId: string): Promise<void> {
  await api.delete(`/agents/${agentId}`);
}

export async function getAgentProperties(
  agentId: string,
  filters?: PropertyFilters,
): Promise<PropertiesResponse> {
  const response = await api.get<PropertiesResponse>(
    `/agents/${agentId}/properties`,
    { params: filters },
  );
  return response.data;
}
