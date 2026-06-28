import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export const connectDatabase = async () => {
  const cache = globalForMongoose.mongooseCache!;

  if (cache.conn) {
    return cache.conn;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI belum diisi");
  }

  if (mongoUri.includes("USERNAME") || mongoUri.includes("PASSWORD")) {
    throw new Error("MONGODB_URI masih memakai placeholder username/password");
  }

  if (mongoUri.includes("CLUSTER.mongodb.net")) {
    throw new Error(
      "MONGODB_URI masih memakai placeholder CLUSTER.mongodb.net",
    );
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
