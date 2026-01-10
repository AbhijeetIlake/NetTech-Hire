import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applications`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}`, { status });
      setApplicants(applicants.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 group"
      >
        <svg className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to my jobs
      </button>

      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Job Applicants</h1>
        <p className="text-gray-500">Review candidates and update their application status.</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applicants.length > 0 ? (
                applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-900 tracking-tight">{app.applicant?.name}</div>
                      <div className="text-xs font-medium text-blue-600 mt-0.5">Applied on {new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-medium text-gray-700">{app.applicant?.email}</div>
                    </td>
                    <td className="px-6 py-6 font-bold">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 border-transparent outline-none transition-all ${app.status === "pending" ? "bg-amber-100 text-amber-700" :
                            app.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                              "bg-red-100 text-red-700"
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="text-xs font-black text-gray-400 hover:text-blue-600 transition-colors">
                        VIEW RESUME
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-gray-500 font-medium font-bold">
                    No applications received for this job yet.
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

export default ApplicantsPage;
