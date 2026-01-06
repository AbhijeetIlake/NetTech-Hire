import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.error("Auth Middleware JWT Error:", error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Access denied: Insufficient permissions");
    }
    next();
  };
};
