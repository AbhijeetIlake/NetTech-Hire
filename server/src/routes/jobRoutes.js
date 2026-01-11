import express from "express";
import {
   getPublicJobs,
   createJob,
   getRecruiterJobs,
   getJob,
   updateJob,
   closeJob,
   deleteJob,
} from "../controllers/jobControllers.js";
import {
   createApplication,
   getApplicationsForJob,
} from "../controllers/applicationControllers.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate, createJobSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

// --- Job Routes ---

// Public / Applicant
router.get("/", protect, authorizeRoles("applicant"), getPublicJobs);

// Company
router.get("/me", protect, authorizeRoles("company"), getRecruiterJobs);
router.post("/", protect, authorizeRoles("company"), validate(createJobSchema), createJob);

// Unified (Applicant checks active, Company checks ownership)
router.get("/:id", protect, getJob);

router.put("/:id", protect, authorizeRoles("company"), updateJob);
router.patch("/:id/close", protect, authorizeRoles("company"), closeJob);
router.delete("/:id", protect, authorizeRoles("company"), deleteJob);

// --- Application Routes (Nested) ---

router.post(
   "/:jobId/applications",
   protect,
   authorizeRoles("applicant"),
   createApplication
);

router.get(
   "/:jobId/applications",
   protect,
   authorizeRoles("company"),
   getApplicationsForJob
);

export default router;
