import Job from "../models/Job.js";

/* ===============================
   PUBLIC / COMMON
================================ */

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate("company", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ message: "Server Error (Get Jobs)" });
  }
};

/* ===============================
   COMPANY SIDE
================================ */

export const createJob = async (req, res) => {
  try {
    const { title, description, location, jobType } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      jobType,
      company: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server Error (Create Job)" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({ message: "Server Error (My Jobs)" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Get Job By Id Error:", error);
    res.status(500).json({ message: "Server Error (Get Job)" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, location, jobType, isActive } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (location !== undefined) job.location = location;
    if (jobType !== undefined) job.jobType = jobType;
    if (isActive !== undefined) job.isActive = isActive;

    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Server Error (Update Job)" });
  }
};

export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    job.isActive = false;
    await job.save();

    res.status(200).json({ message: "Job closed successfully" });
  } catch (error) {
    console.error("Close Job Error:", error);
    res.status(500).json({ message: "Server Error (Close Job)" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server Error (Delete Job)" });
  }
};
