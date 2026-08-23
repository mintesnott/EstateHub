import dotenv from "dotenv";
import prisma from "../../config/database.js";
import { hashPassword } from "../../utils/password.js";
import { ConflictError, NotFoundError } from "../../errors/index.js";
import type { GetAgentsQueryInput, CreateAgentInput, UpdateAgentProfileInput } from "./agent.validation.js";
import { GetPropertiesQueryInput } from "../properties/property.validation.js";

dotenv.config();

// Creates an AGENT user alongside their AgentProfile in an atomic operation.

const DEFAULT_AGENT_TEMP_PASSWORD = process.env.DEFAULT_AGENT_TEMP_PASSWORD;

if (!DEFAULT_AGENT_TEMP_PASSWORD) {
  throw new Error("DEFAULT_AGENT_TEMP_PASSWORD is not configured");
}

//create agent

export const createAgent = async (data: Omit<CreateAgentInput, "password">) => {
  const {
    name,
    email,
    licenseNumber,
    agencyName,
    bio,
    experienceYears,
    specializations,
    officeAddress,
    city,
    stateRegion,
    websiteUrl,
    linkedinUrl,
    whatsappNumber,
    commissionRate
  } = data;

  // 1. Check existing email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists");
  }

  // 2. Check existing license
  const existingLicense = await prisma.agentProfile.findUnique({ where: { licenseNumber } });
  if (existingLicense) {
    throw new ConflictError("An agent profile with this license number already exists");
  }

  // 3. Hash default temporary password
  const hashedPassword = await hashPassword(DEFAULT_AGENT_TEMP_PASSWORD);

  // 4. Create User & AgentProfile atomically with mustChangePassword = true
  const newAgent = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role: "AGENT",
      mustChangePassword: true, // 👈 Triggers mandatory change upon first login
      agentProfile: {
        create: {
          licenseNumber,
          agencyName,
          bio,
          experienceYears,
          specializations: specializations || [],
          officeAddress,
          city,
          stateRegion,
          websiteUrl,
          linkedinUrl,
          whatsappNumber,
          commissionRate,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mustChangePassword: true,
      createdAt: true,
      agentProfile: {
        select: {
          id: true,
          licenseNumber: true,
          agencyName: true,
        },
      },
    },
  });

  return {
    ...newAgent,
    tempPassword: DEFAULT_AGENT_TEMP_PASSWORD,
  }
};

export const getAgents = async (query: GetAgentsQueryInput) => {
  const { page, limit, search, specialization, city, agencyName, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    role: "AGENT",
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      {
        agentProfile: {
          agencyName: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  if (agencyName) {
    where.agentProfile = {
      ...where.agentProfile,
      agencyName: { contains: agencyName, mode: "insensitive" },
    };
  }

  if (city) {
    where.agentProfile = {
      ...where.agentProfile,
      city: { contains: city, mode: "insensitive" },
    };
  }

  if (specialization) {
    where.agentProfile = {
      ...where.agentProfile,
      specializations: { array_contains: specialization },
    };
  }

  const orderBy: any =
    sortBy === "name" || sortBy === "email" || sortBy === "createdAt"
      ? { [sortBy]: sortOrder }
      : sortBy === "agencyName"
      ? { agentProfile: { agencyName: sortOrder } }
      : { createdAt: sortOrder };

  const [total, agents] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        agentProfile: true,
      },
    }),
  ]);

  return {
    agents,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAgentById = async (agentId: string) => {
  const agent = await prisma.user.findFirst({
    where: { id: agentId, role: "AGENT" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      createdAt: true,
      agentProfile: true,
    },
  });

  if (!agent) throw new NotFoundError("Agent not found");

  return agent;
};

export const updateAgent = async (
  agentId: string,
  data: UpdateAgentProfileInput,
) => {
  const agent = await prisma.user.findFirst({
    where: { id: agentId, role: "AGENT" },
  });

  if (!agent) throw new NotFoundError("Agent not found");

  // Strip null values for non-nullable Prisma fields.
  // experienceYears is Int (not nullable) in the schema —
  // passing null would cause a Prisma type error at runtime.
  const sanitizedData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== null),
  );

  return await prisma.$transaction(async (tx) => {
    await tx.agentProfile.update({
      where: { userId: agentId },
      data: sanitizedData,
    });

    return tx.user.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        agentProfile: true,
      },
    });
  });
};

export const deleteAgent = async (agentId: string) => {
  const agent = await prisma.user.findFirst({
    where: { id: agentId, role: "AGENT" },
  });

  if (!agent) throw new NotFoundError("Agent not found");

  await prisma.user.delete({ where: { id: agentId } });
};


export const getAgentProperties = async (
  agentId: string,
  query: GetPropertiesQueryInput,
) => {
  // Verify agent exists first
  const agent = await prisma.user.findFirst({
    where: { id: agentId, role: "AGENT" },
    select: { id: true, name: true },
  });

  if (!agent) throw new NotFoundError("Agent not found");

  // Reuse existing getProperties service with agentId scoped
  const { getProperties } = await import("../properties/property.service.js");
  return getProperties(query, agentId);
};