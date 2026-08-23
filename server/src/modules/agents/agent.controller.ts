import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createAgent, deleteAgent, getAgentById, getAgentProperties, getAgents, updateAgent } from "./agent.service.js";
import type { CreateAgentInput, GetAgentsQueryInput, UpdateAgentProfileInput } from "./agent.validation.js";
import { GetPropertiesQueryInput } from "../properties/property.validation.js";

export const createAgentController = async (req: Request, res: Response) => {
  const body = res.locals.body as CreateAgentInput;

  const agent = await createAgent(body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Agent account and profile created successfully",
    data: agent,
  });
};


export const getAgentsController = async (req: Request, res: Response) => {
  const query = res.locals.query as GetAgentsQueryInput;
  const result = await getAgents(query);

  res.status(StatusCodes.OK).json({
    success: true,
    count: result.agents.length,
    meta: result.meta,
    data: result.agents,
  });
};

export const getAgentByIdController = async (req: Request, res: Response) => {
  const { id } = res.locals.params as { id: string };
  const agent = await getAgentById(id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: agent,
  });
};

export const updateAgentController = async (req: Request, res: Response) => {
  const { id } = res.locals.params as { id: string };
  const body = res.locals.body as UpdateAgentProfileInput;
  const agent = await updateAgent(id, body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Agent updated successfully",
    data: agent,
  });
};

export const deleteAgentController = async (req: Request, res: Response) => {
  const { id } = res.locals.params as { id: string };
  await deleteAgent(id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Agent deleted successfully",
  });
};


export const getAgentPropertiesController = async (
  req: Request,
  res: Response,
) => {
  const { id } = res.locals.params as { id: string };
  const query = res.locals.query as GetPropertiesQueryInput;
  const result = await getAgentProperties(id, query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.properties,
    pagination: result.pagination,
  });
};