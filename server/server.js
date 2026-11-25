
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Events Hub API is running",
  });
});

// API routes
app.use("/api/events", eventRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/registrations", registrationRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Campus Events Hub API",
    endpoints: [
      "/api/health",
      "/api/events",
      "/api/clubs",
      "/api/registrations",
    ],
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server after database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("Campus Events Hub Backend Started");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
