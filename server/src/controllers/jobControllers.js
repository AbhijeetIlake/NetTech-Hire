import Job from "../models/Job.js";
import asyncHandler from "../middleware/asyncHandler.js";

// --- Public Job Routes ---

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private (Applicant)
export const getPublicJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })
    .populate("company", "name email profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json(jobs);
});

// @desc    Get job details (Unified)
// @route   GET /api/jobs/:id
// @access  Private (Applicant, Company)
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("company", "name email profileImage");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Role-based logic
  if (req.user.role === 'applicant') {
    if (!job.isActive) {
      res.status(404);
      throw new Error("Job not found or closed");
    }
  } else if (req.user.role === 'company') {
    // Company can only view their own jobs
    if (job.company._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }
  }

  res.status(200).json(job);
});

// --- Company Job Routes ---

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Company)
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    workMode,
    employmentType,
    salaryRange,
  } = req.body;

  if (!title || !description || !workMode || !employmentType) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const job = await Job.create({
    title,
    description,
    location,
    workMode,
    employmentType,
    salaryRange: salaryRange || "Not disclosed",
    company: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get jobs created by the logged-in company
// @route   GET /api/jobs/me
// @access  Private (Company)
export const getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ company: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(jobs);
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

  const {
    title,
    description,
    location,
    workMode,
    employmentType,
    salaryRange,
    isActive,
  } = req.body;

  if (title !== undefined) job.title = title;
  if (description !== undefined) job.description = description;
  if (location !== undefined) job.location = location;
  if (workMode !== undefined) job.workMode = workMode;
  if (employmentType !== undefined) job.employmentType = employmentType;
  if (salaryRange !== undefined) job.salaryRange = salaryRange;
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

