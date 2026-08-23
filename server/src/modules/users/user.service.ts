import prisma from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../errors/index.js";
import { UpdateAgentProfileInput } from "../agents/agent.validation.js";
import { UpdateClientProfileInput } from "../clients/client.validation.js";
import type {
  UpdateMyProfileInput,
} from "./user.profile.validation.js";
import { GetUsersQueryInput, UpdateUserProfileInput } from "./user.validation.js";

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      profileImage: true,
      agentProfile: true,
      clientProfile: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateMyProfile = async (
  userId: string,
  data:  UpdateMyProfileInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const {
    name,
    phone,
    profileImage,
    ...profileData
  } = data;

  return await prisma.$transaction(async (tx) => {
    // Update common User fields
    if (
      name !== undefined ||
      phone !== undefined ||
      profileImage !== undefined
    ) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(profileImage !== undefined && { profileImage }),
        },
      });
    }

    // CLIENT profile    // AGENT profile
    if (user.role === "CLIENT") {
      await tx.clientProfile.update({
        where: { userId },
        data: profileData,
      });
    }


    else if (user.role === "AGENT") {
      await tx.agentProfile.update({
        where: { userId },
        // @ts-expect-error - profileData is role-dependent and validated before reaching this branch
        data: profileData,  
 
      });
    }

    else {
      throw new BadRequestError(
        "Profile management is not available for this user role"
      );
    }

    // Return updated profile
    return await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profileImage: true,
        clientProfile: true,
        agentProfile: true,
        updatedAt: true,
      },
    });
  });
};

export const getUsers = async (query: GetUsersQueryInput) => {
  const { page, limit, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    role: "CLIENT",
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // favoriteCount requires raw aggregation — handle separately
  if (sortBy === "favoriteCount") {
    // fetch all matching clients with favorite counts, sort in memory
    const clients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        clientProfile: true,
        _count: { select: { favorites: true } },
      },
    });

    const sorted = clients.sort((a, b) =>
      sortOrder === "desc"
        ? b._count.favorites - a._count.favorites
        : a._count.favorites - b._count.favorites,
    );

    const paginated = sorted.slice(skip, skip + limit);

    return {
      users: paginated.map(({ _count, ...user }) => ({
        ...user,
        favoriteCount: _count.favorites,
      })),
      meta: {
        total: clients.length,
        page,
        limit,
        totalPages: Math.ceil(clients.length / limit),
      },
    };
  }

  const orderBy: any = { [sortBy]: sortOrder };

  const [total, users] = await Promise.all([
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
        clientProfile: true,
        _count: { select: { favorites: true } },
      },
    }),
  ]);

  return {
    users: users.map(({ _count, ...user }) => ({
      ...user,
      favoriteCount: _count.favorites,
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

