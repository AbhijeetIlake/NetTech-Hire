import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

// Validate environment
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: ${env} is not defined.`);
    process.exit(1);
  }
});

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle crash on unhandled rejection
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
