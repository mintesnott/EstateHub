import argon2 from "argon2";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { UnauthenticatedError } from "../errors/index.js";


export const hashPassword =  async (password: string): Promise<string> => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,  
    timeCost: 3,           
    parallelism: 1,        
  });
};

export const verifyPassword = async (hash: string, plainText: string): Promise<boolean> => {

  // Guard against missing or malformed hashes before calling argon2
  if (!hash || typeof hash !== "string" || !hash.startsWith("$")) {
    throw new UnauthenticatedError("Invalid email or password -->");
  }
    return await argon2.verify(hash, plainText);
 
};