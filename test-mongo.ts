import { config } from "dotenv";
import mongoose from "mongoose";

config(); // load .env.local

const uri = process.env.MONGODB_URI;

async function testConnection() {
  if (!uri) {
    console.error("❌ MONGODB_URI is missing");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

testConnection();
