import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI ?? process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MongoDB connection string is missing. Set MONGO_URI (or MONGODB_URI) in your environment."
    );
  }

  if (cached.conn) {
    const state = mongoose.connection.readyState;
    if (state === 1 || state === 2) {
      return cached.conn;
    }

    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
    globalWithMongoose.mongoose = cached;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}