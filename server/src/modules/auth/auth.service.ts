import prisma from "../../config/database.js";
import ConflictError from "../../errors/conflict.js";
import UnauthenticatedError from "../../errors/unauthenticated.js";

import { hashPassword } from "../../utils/password.js";
import type { ChangeEmailInput, ChangePasswordInput, LoginInput, RegisterInput } from "./auth.validation.js";
import { verifyPassword } from '../../utils/password.js'
import { generateToken } from "../../utils/jwt.js";
import NotFoundError from "../../errors/not-found.js";
import BadRequestError from "../../errors/bad-request.js";

const THREE_MONTHS_IN_MS = 90 * 24 * 60 * 60 * 1000;
// register a user
export const registerUser = async (data: RegisterInput) => {

    const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

   if (existingUser) {
       throw new ConflictError("Email is already in use");
   }

  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      role: "CLIENT",
      clientProfile: {
        create: {},
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

};

//login
export const loginUser = async (data: LoginInput) => {

  //Find user by email
  // const user = await prisma.user.findUnique({
  //   where: { email: data.email },
  // });

  const user = await prisma.user.findUnique({
  where: { email: data.email },
});

console.log("LOGIN DEBUG:", {
  email: data.email,
  userFound: !!user,
  role: user?.role,
  hashPrefix: user?.passwordHash?.slice(0, 20),
  hashLength: user?.passwordHash?.length,
});

  if (!user) {
    throw new UnauthenticatedError("Invalid email or password");
  }

  // Verify Argon2 hash
  const isPasswordValid = await verifyPassword(user.passwordHash, data.password);


  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid email or password");
  }

  // Calculate 3-month expiration dynamically
  const isPasswordExpired = (Date.now() - new Date(user.passwordChangedAt).getTime()) > THREE_MONTHS_IN_MS;

    // Evaluate both the database flag and actual age calculation
  const requiresPasswordChange = user.mustChangePassword || isPasswordExpired;

  // generate JWT
  const token = generateToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    sessionVersion: user.sessionVersion,
  });

  // return payload without passwordHash
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
    mustChangePassword: requiresPasswordChange,
    message: requiresPasswordChange
      ? "Password change required before proceeding."
      : "Login successful",
  };
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // verify current password
  const isValid = await verifyPassword(user.passwordHash, currentPassword);
  if (!isValid) {
    throw new UnauthenticatedError("Incorrect current password");
  }

  // reject identical new password
  const isSamePassword = await verifyPassword(user.passwordHash, newPassword);
  if (isSamePassword) {
    throw new BadRequestError(
      "New password cannot be identical to your current password"
    );
  }

  // Hash new password with Argon2
  const newPasswordHash = await hashPassword(newPassword);

  // update credentials, reset mustChangePassword, update timestamp
  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newPasswordHash,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
       sessionVersion: {
        increment: 1,
      },
    },
  });
};

export const changeEmail = async (
  userId: string,
  data: ChangeEmailInput,
) => {
  const { currentPassword, newEmail } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isValid = await verifyPassword(
    user.passwordHash,
    currentPassword,
  );

  if (!isValid) {
    throw new UnauthenticatedError(
      "Incorrect current password",
    );
  }

  const normalizedEmail = newEmail.trim().toLowerCase();

  if (normalizedEmail === user.email.toLowerCase()) {
    throw new BadRequestError(
      "New email cannot be identical to your current email",
    );
  }

  // make sure email isn't already registered
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new ConflictError(
      "An account with this email already exists",
    );
  }

  //update email
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: normalizedEmail,
      sessionVersion: {
        increment: 1,
      },
    },
  });
};

//get current user
export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};