import express from "express";
import {
  getJobs,
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  closeJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===============================
   PUBLIC / APPLICANT
================================ */

router.get("/", getJobs);

/* ===============================
   COMPANY
================================ */

router.post("/", protect, authorizeRoles("company"), createJob);
router.get("/my", protect, authorizeRoles("company"), getMyJobs);
router.get("/:id", protect, authorizeRoles("company"), getJobById);
router.put("/:id", protect, authorizeRoles("company"), updateJob);
router.patch("/:id/close", protect, authorizeRoles("company"), closeJob);
router.delete("/:id", protect, authorizeRoles("company"), deleteJob);

export default router;
