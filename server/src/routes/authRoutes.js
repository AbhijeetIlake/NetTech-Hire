import express from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    uploadResume,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

router.put("/profile", protect, updateUserProfile);
router.put("/resume", protect, upload.single("resume"), uploadResume);

export default router;