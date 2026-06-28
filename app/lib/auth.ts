import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDatabase } from "@/app/lib/db";
import User from "@/app/models/User";

export class AuthError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    this.status = 401;
  }
}

export const getAuthUser = async (request: NextRequest) => {
  await connectDatabase();

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Token tidak ditemukan");
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET belum diisi");
  }

  let decoded: { id: string };

  try {
    decoded = jwt.verify(token, jwtSecret) as { id: string };
  } catch {
    throw new AuthError("Token tidak valid atau sudah kedaluwarsa");
  }

  if (!decoded.id) {
    throw new AuthError("Token tidak valid");
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AuthError("User tidak valid");
  }

  return user;
};
