
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
      `Database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
