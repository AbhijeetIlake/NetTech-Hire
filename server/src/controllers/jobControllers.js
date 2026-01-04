import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
    try {
        const jobs = (await Job.find({ isActive: true }).populate("company","name email")).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({ message: "Server Error (Get Jobs)"});
    }
}