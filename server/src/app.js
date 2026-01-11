import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Environment detection
const isDevelopment = process.env.NODE_ENV !== "production";

// Security Hardening with content policy configuration
// Disable CSP in development since frontend/backend are on different ports
app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: isDevelopment ? false : { policy: "same-origin" },
}));

// Trust first proxy (necessary if behind Heroku/Vercel/Nginx)
app.set("trust proxy", 1);

// Environment-aware rate limiting

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // Much higher limit in dev for testing
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevelopment ? () => false : undefined, // Optional: could skip entirely in dev
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 200 : 20, // Much higher limit in dev for testing
  message: { success: false, message: "Too many authentication attempts, please try again after an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/", globalLimiter);

// Serve static files with CORS headers
app.use("/uploads", cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}), express.static(path.join(__dirname, "../uploads")));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
