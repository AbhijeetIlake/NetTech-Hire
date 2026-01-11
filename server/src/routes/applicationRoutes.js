import express from "express";
import {
   getMyApplications,
   updateApplication,
   getRecruiterApplications,
} from "../controllers/applicationControllers.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate, updateApplicationStatusSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

// --- Applicant Section ---
router.get("/me", protect, authorizeRoles("applicant"), getMyApplications);

// --- Company Section ---
router.get("/recruiter", protect, authorizeRoles("company"), getRecruiterApplications);
router.patch("/:id", protect, authorizeRoles("company"), validate(updateApplicationStatusSchema), updateApplication);

export default router;