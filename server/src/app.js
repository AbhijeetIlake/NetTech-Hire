import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
