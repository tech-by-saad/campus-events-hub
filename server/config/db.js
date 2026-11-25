
import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log(
          `MongoDB Connected: ${connection.connection.host}`
        );
        console.log(
          `Database: ${connection.connection.name}`
        );
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("MongoDB Connection Failed:", error.message);
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
