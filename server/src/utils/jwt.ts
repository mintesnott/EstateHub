import jwt, { SignOptions } from "jsonwebtoken";


export interface JwtPayload {
  userId: string;
  role: "ADMIN" | "AGENT" | "CLIENT";
  email: string;
  sessionVersion: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_change_in_prod";

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"];

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};