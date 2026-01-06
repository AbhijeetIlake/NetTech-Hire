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
    jobType: {
      type: String,
      enum: {
        values: ["internship", "full-time", "contract"],
        message: "{VALUE} is not a valid job type",
      },
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
