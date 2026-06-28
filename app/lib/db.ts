import * as dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cache;

export const connectDatabase = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    throw new Error("MONGODB_URI belum diisi");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
};
