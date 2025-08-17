import mongoose from "mongoose";

const MONGODB_URI = `${process.env.MONGODB_URI}/quickcart`;

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI");

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // 🔑 ensures persistence
  return cached.conn;
}
