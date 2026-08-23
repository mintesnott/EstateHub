import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAgent,
  deleteAgent,
  getAgentById,
  getAgents,
  updateAgent,
  getAgentProperties,
} from "./agent.api";
import type {
  AgentFilters,
  CreateAgentInput,
  UpdateAgentInput,
} from "../types/agent.types";

import type { PropertyFilters } from "@/features/properties/types/property.types";

export function useAgents(filters?: AgentFilters) {
  return useQuery({
    queryKey: ["agents", filters],
    queryFn: () => getAgents(filters),
  });
}

export function useAgent(agentId: string) {
  return useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgentById(agentId),
    enabled: !!agentId,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAgentInput) => createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: string; data: UpdateAgentInput }) =>
      updateAgent(agentId, data),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", agentId] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useAgentProperties(agentId: string, filters?: PropertyFilters) {
  return useQuery({
    queryKey: ["agent-properties", agentId, filters],
    queryFn: () => getAgentProperties(agentId, filters),
    enabled: !!agentId,
  });
}