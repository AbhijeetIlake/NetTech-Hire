import express from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    uploadProfileImage,
    uploadResume,
    getMeController,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    validate,
    loginSchema,
    registerSchema,
    updateProfileSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMeController);
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);
router.post("/logout", logoutUser);

router.put("/profile", protect, validate(updateProfileSchema), updateUserProfile);
router.put("/profile-image", protect, upload.single("profileImage"), uploadProfileImage);
router.put("/resume", protect, upload.single("resume"), uploadResume);

export default router;