import User from "../models/User.js";
import fs from "fs";
import path from "path";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Utility to set HTTP-only cookie
 */
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

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
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};


// @desc    Update user profile (Name, email, skills)
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      resumePath: updatedUser.resumePath,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
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

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const oldPath = user.profileImage;

    // Use findByIdAndUpdate to avoid pre-save hooks/validation issues
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: normalizedPath },
      { new: true }
    ).select("-password");

    // Cleanup old file from disk
    if (oldPath && oldPath !== normalizedPath) {
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.error("Cleanup Error (Image):", err);
      }
    }

    res.status(200).json({
      message: "Profile photo updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Upload Logic Error (Image):", err);
    res.status(err.status || 500);
    throw new Error(err.message || "Upload failed");
  }
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

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const oldPath = user.resumePath;

    // Use findByIdAndUpdate to avoid pre-save hooks/validation issues
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { resumePath: normalizedPath },
      { new: true }
    ).select("-password");

    // Cleanup old file from disk
    if (oldPath && oldPath !== normalizedPath) {
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.error("Cleanup Error (Resume):", err);
      }
    }

    res.status(200).json({
      message: "Resume updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Upload Logic Error (Resume):", err);
    res.status(err.status || 500);
    throw new Error(err.message || "Upload failed");
  }
});
