import express from "express";
import {
   getMyApplications,
   updateApplication,
} from "../controllers/applicationControllers.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Applicant Section ---
router.get("/me", protect, authorizeRoles("applicant"), getMyApplications);

// --- Company Section ---
router.patch("/:id", protect, authorizeRoles("company"), updateApplication);

export default router;