import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

function ApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applications`);
        setApplicants(res.data);
      } catch (err) {
        showToast("Failed to fetch applicants.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id, showToast]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}`, { status });
      setApplicants(applicants.map(a => a._id === appId ? { ...a, status } : a));
      showToast("Candidate status updated!", "success");
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
    <Layout title="Review Applicants" description="Manage and evaluate candidates who have applied for this position.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[10px] font-black text-blue-600 hover:text-blue-700 mb-8 group uppercase tracking-widest"
        >
          <svg className="h-4 w-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back to Listings
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Job Applicants</h1>
          <p className="text-gray-400 font-medium">Review candidates and manage the selection process.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Progress</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applicants.length > 0 ? (
                  applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-white shadow-sm items-center justify-center flex overflow-hidden shrink-0">
                            {app.applicant?.profileImage ? (
                              <img
                                src={`${SVR_URL}/${app.applicant.profileImage}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-blue-600 font-black text-lg">{app.applicant?.name?.[0] || "A"}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 tracking-tight leading-none mb-1 text-base">{app.applicant?.name}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold text-gray-600">{app.applicant?.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-0 ring-0 outline-none transition-all cursor-pointer ${app.status === "applied" ? "bg-amber-50 text-amber-600" :
                            app.status === "shortlisted" ? "bg-blue-50 text-blue-600" :
                              app.status === "interview" ? "bg-indigo-50 text-indigo-600" :
                                app.status === "selected" ? "bg-emerald-50 text-emerald-600" :
                                  "bg-red-50 text-red-600"
                            }`}
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {app.applicant?.resumePath ? (
                          <a
                            href={`${SVR_URL}/${app.applicant.resumePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-50 transition-all uppercase tracking-widest"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View
                          </a>
                        ) : (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Resume</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg">No candidates found for this role.</p>
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

export default ApplicantsPage;
