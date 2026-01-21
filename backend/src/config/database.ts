import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGODB_URL } = process.env;
    if (!MONGODB_URL) {
      console.error("MONGODB_URL is not set");
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected successfully ✔️");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
    
  }
}