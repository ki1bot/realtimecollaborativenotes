import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET belum diisi");
  }

  return jwt.sign(
    {
      id: userId,
    },
    jwtSecret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions,
  );
};
