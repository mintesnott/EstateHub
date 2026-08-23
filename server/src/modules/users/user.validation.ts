import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .optional(),

  phone: z.string().optional().nullable(),
  profileImage: z.string({message: "Invalid profile Link"}).optional().nullable(),
}).strict();


export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "favoriteCount"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const userIdParamSchema = z.object({
  id: z.uuid("Invalid user ID format"),
});

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;


export type UpdateUserProfileInput = z.infer<
  typeof updateUserProfileSchema
>;