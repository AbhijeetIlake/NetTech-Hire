import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      default: "Not disclosed",
    },
    workMode: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      required: [true, "Work mode is required"],
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: [true, "Employment type is required"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
