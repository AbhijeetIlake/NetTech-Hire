import express from "express";
import {
   getActiveJobs,
   createJob,
   getMyJobs,
   getJobById,
   updateJob,
   closeJob,
   deleteJob,
   getJobDetails,
} from "../controllers/jobControllers.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   PUBLIC / APPLICANT
================================ */

router.get("/", protect, authorizeRoles("applicant"), getActiveJobs);
router.get("/:id", protect, authorizeRoles("applicant"), getJobDetails);

/* ===============================
   COMPANY
================================ */

router.post("/", protect, authorizeRoles("company"), createJob);
router.get("/my", protect, authorizeRoles("company"), getMyJobs);
router.get("/:id/company", protect, authorizeRoles("company"), getJobById);
router.put("/:id", protect, authorizeRoles("company"), updateJob);
router.patch("/:id/close", protect, authorizeRoles("company"), closeJob);
router.delete("/:id", protect, authorizeRoles("company"), deleteJob);

export default router;
