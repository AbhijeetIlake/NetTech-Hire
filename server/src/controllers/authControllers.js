import User from "../models/User.js";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Utility to set HTTP-only cookie (production-ready)
 */
const setCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,                                       // JS cannot access
    secure: isProduction,                                 // true in production (requires HTTPS)
    sameSite: isProduction ? "None" : "Lax",             // None for cross-site in prod, Lax for dev
    maxAge: 7 * 24 * 60 * 60 * 1000,                     // 7 days
  });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMeController = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      resumePath: user.resumePath,
      profileImage: user.profileImage,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update user profile (Name, email, skills)
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();

  res.status(200).json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    profileImage: updatedUser.profileImage,
    resumePath: updatedUser.resumePath,
  });
});

// @desc    Upload profile image
// @route   PUT /api/auth/profile-image
// @access  Private
export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file uploaded");
  }

  const normalizedPath = req.file.path.replace(/\\/g, "/");

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const oldPath = user.profileImage;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: normalizedPath },
    { new: true }
  ).select("-password");

  if (oldPath && oldPath !== normalizedPath && fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }

  res.status(200).json({
    message: "Profile photo updated",
    user: updatedUser,
  });
});

// @desc    Upload resume
// @route   PUT /api/auth/resume
// @access  Private
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No resume file uploaded");
  }

  const normalizedPath = req.file.path.replace(/\\/g, "/");

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const oldPath = user.resumePath;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { resumePath: normalizedPath },
    { new: true }
  ).select("-password");

  if (oldPath && oldPath !== normalizedPath && fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }

  res.status(200).json({
    message: "Resume updated",
    user: updatedUser,
  });
});
