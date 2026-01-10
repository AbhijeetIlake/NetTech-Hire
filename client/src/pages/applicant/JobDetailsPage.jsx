import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await api.post(`/jobs/${id}/applications`);
      setSuccess("Application submitted successfully!");
      setTimeout(() => navigate("/applicant/applications"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!job) return <div className="text-center py-20 text-gray-500">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 group"
      >
        <svg className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to listings
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {job.workMode}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {job.employmentType}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">{job.title}</h1>
          <p className="text-blue-100 text-lg">{job.company?.name || "Premium Tech Partner"}</p>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Location</h3>
              <p className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {job.location}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Salary Range</h3>
              <p className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {job.salaryRange}
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Role Description</h3>
            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
              {job.description}
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-medium border border-red-100">{error}</div>}
          {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-100">{success}</div>}

          <button
            onClick={handleApply}
            disabled={applying || success}
            className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 ${success
                ? "bg-emerald-500 text-white cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
              } ${applying ? "opacity-75 cursor-wait" : ""}`}
          >
            {applying ? "Submitting..." : success ? "Applied Successfully" : "Apply for this Position"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
