import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/jobs/me");
        setJobs(res.data);
      } catch (err) {
        showToast("Failed to fetch jobs.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, [showToast]);

  const toggleJobStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/jobs/${id}/close`);
      setJobs(jobs.map(j => j._id === id ? { ...j, isActive: !currentStatus } : j));
      showToast(`Job ${currentStatus ? 'closed' : 'reopened'} successfully!`, "success");
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <Layout title="Your Listings" description="Manage and track all your active and closed job postings.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">My Postings</h1>
            <p className="text-gray-400 font-medium">Manage your active opportunities.</p>
          </div>
          <Link
            to="/company/jobs/create"
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 hover:shadow-blue-200"
          >
            ADD NEW JOB
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Job Details</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight mb-1">{job.title}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{job.location} • {job.workMode}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block ${job.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                          {job.isActive ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-6">
                        <Link
                          to={`/company/jobs/${job._id}/applicants`}
                          className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors tracking-widest"
                        >
                          APPLICANTS
                        </Link>
                        <button
                          onClick={() => toggleJobStatus(job._id, job.isActive)}
                          className="text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors tracking-widest"
                        >
                          {job.isActive ? "CLOSE" : "REOPEN"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-6">No job postings found.</p>
                        <Link to="/company/jobs/create" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                          Create Your First Role
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MyJobsPage;
