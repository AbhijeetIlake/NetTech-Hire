import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/jobs/me");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const toggleJobStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/jobs/${id}/close`);
      setJobs(jobs.map(j => j._id === id ? { ...j, isActive: !currentStatus } : j));
    } catch (err) {
      alert("Failed to update job status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Job Postings</h1>
        <Link
          to="/company/jobs/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Add New Job
        </Link>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Job Details</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{job.location} • {job.workMode}</div>
                    </td>
                    <td className="px-6 py-6 font-bold">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${job.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {job.isActive ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right space-x-3">
                      <Link
                        to={`/company/jobs/${job._id}/applicants`}
                        className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        VIEW APPLICANTS
                      </Link>
                      <button
                        onClick={() => toggleJobStatus(job._id, job.isActive)}
                        className="text-xs font-black text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {job.isActive ? "CLOSE" : "REOPEN"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center text-gray-500 font-medium">
                    You haven't posted any jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyJobsPage;
