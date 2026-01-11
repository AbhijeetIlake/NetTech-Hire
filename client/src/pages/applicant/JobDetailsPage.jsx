import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useToast } from "../../context/ToastContext";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        showToast("Failed to load job details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, showToast]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/applications`);
      showToast("Application submitted successfully!", "success");
      setHasApplied(true);
      setTimeout(() => navigate("/applicant/applications"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit application.", "error");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (!job) return (
    <Layout title="Not Found">
      <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest">
        Job not found
      </div>
    </Layout>
  );

  return (
    <Layout title={job.title} description={`${job.title} at ${job.company?.name || 'Top Company'}. View details and apply today.`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 group"
        >
          <svg className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to listings
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30">
                {job.company?.profileImage ? (
                  <img
                    src={`${SVR_URL}/${job.company.profileImage}`}
                    alt="Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-white font-black text-xl">{job.company?.name?.[0] || "T"}</span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {job.workMode}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {job.employmentType}
                  </span>
                </div>
              </div>
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
                  <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 1 1 0 6H9l3 3m-3-6h6m-6 1h6m-6 1h6" /></svg>
                  {job.salaryRange?.startsWith('₹') ? job.salaryRange : `₹${job.salaryRange || 'Not disclosed'}`}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Role Description</h3>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                {job.description}
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 ${hasApplied
                ? "bg-emerald-500 text-white cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
                } ${applying ? "opacity-75 cursor-wait" : ""}`}
            >
              {applying ? "Submitting..." : hasApplied ? "Applied Successfully" : "Apply for this Position"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default JobDetailsPage;
