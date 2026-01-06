import Job from "../models/Job.js";
import asyncHandler from "../middleware/asyncHandler.js";

/* ===============================
   APPLICANT SIDE
================================ */

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private (Applicant)
export const getActiveJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })
    .populate("company", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(jobs);
});

// @desc    Get job details
// @route   GET /api/jobs/:id
// @access  Private (Applicant)
export const getJobDetails = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate("company", "name email");

  if (!job) {
    res.status(404);
    throw new Error("Job not found or closed");
  }

  res.status(200).json(job);
});

/* ===============================
   COMPANY SIDE
================================ */

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Company)
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, jobType } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  const job = await Job.create({
    title,
    description,
    location,
    jobType,
    company: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get jobs created by the logged-in company
// @route   GET /api/jobs/my
// @access  Private (Company)
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ company: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(jobs);
});

// @desc    Get a single job by ID (Company side)
// @route   GET /api/jobs/:id/company
// @access  Private (Company)
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.status(200).json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Company)
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  const { title, description, location, jobType, isActive } = req.body;

  if (title !== undefined) job.title = title;
  if (description !== undefined) job.description = description;
  if (location !== undefined) job.location = location;
  if (jobType !== undefined) job.jobType = jobType;
  if (isActive !== undefined) job.isActive = isActive;

  const updatedJob = await job.save();

  res.status(200).json(updatedJob);
});

// @desc    Close a job
// @route   PATCH /api/jobs/:id/close
// @access  Private (Company)
export const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  job.isActive = false;
  await job.save();

  res.status(200).json({ message: "Job closed successfully" });
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Company)
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  await job.deleteOne();
  res.status(200).json({ message: "Job deleted successfully" });
});

