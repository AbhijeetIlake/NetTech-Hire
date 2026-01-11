import Application from "../models/Application.js";
import Job from "../models/Job.js";
import asyncHandler from "../middleware/asyncHandler.js";

// --- Applicant Routes ---

// @desc    Apply to a job
// @route   POST /api/jobs/:jobId/applications
// @access  Private (Applicant)
export const createApplication = asyncHandler(async (req, res) => {
    const job = await Job.findOne({
        _id: req.params.jobId,
        isActive: true,
    });

    if (!job) {
        res.status(400);
        throw new Error("Job not found or closed");
    }

    const existingApplication = await Application.findOne({
        job: job._id,
        applicant: req.user._id,
    });

    if (existingApplication) {
        res.status(409);
        throw new Error("You have already applied to this job");
    }

    const application = await Application.create({
        job: job._id,
        applicant: req.user._id,
    });

    res.status(201).json({
        message: "Applied successfully",
        application,
    });
});

// @desc    Get logged-in user's applications
// @route   GET /api/applications/me
// @access  Private (Applicant)
export const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({
        applicant: req.user._id,
    })
        .populate({
            path: "job",
            select: "title location workMode employmentType salaryRange company",
            populate: {
                path: "company",
                select: "name email profileImage",
            },
        })
        .sort({ createdAt: -1 });

    res.status(200).json(applications);
});

// --- Company Routes ---

// @desc    Get applications for a specific job
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Company)
export const getApplicationsForJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    if (job.company.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access denied");
    }

    const applications = await Application.find({ job: job._id })
        .populate("applicant", "name email resumePath profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json(applications);
});

// @desc    Update application status
// @route   PATCH /api/applications/:id
// @access  Private (Company)
export const updateApplication = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        res.status(400);
        throw new Error("Status is required");
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        res.status(404);
        throw new Error("Application not found");
    }

    if (application.job.company.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access denied");
    }

    application.status = status;
    await application.save();

    res.status(200).json({
        message: "Application status updated",
        application,
    });
});

// @desc    Get all applications for jobs owned by the company
// @route   GET /api/applications/recruiter
// @access  Private (Company)
export const getRecruiterApplications = asyncHandler(async (req, res) => {
    // 1. Find all jobs owned by this company
    const jobs = await Job.find({ company: req.user._id }).select("_id");
    const jobIds = jobs.map(j => j._id);

    // 2. Find all applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
        .populate("applicant", "name email resumePath profileImage")
        .populate("job", "title")
        .sort({ createdAt: -1 });

    res.status(200).json(applications);
});
