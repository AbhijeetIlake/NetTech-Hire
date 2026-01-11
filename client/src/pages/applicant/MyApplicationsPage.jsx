import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await api.get("/applications/me");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <Layout title="My Applications" description="Track and manage all your active job applications in one place.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">My Applications</h1>
          <p className="text-gray-400 font-medium">Track your journey across the tech ecosystem.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Company & Role</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {app.job?.company?.profileImage ? (
                              <img
                                src={`${SVR_URL}/${app.job.company.profileImage}`}
                                alt="Logo"
                                className="w-full h-full object-contain p-1.5"
                              />
                            ) : (
                              <span className="text-blue-600 font-bold text-lg">{app.job?.company?.name?.[0] || "T"}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{app.job?.title}</div>
                            <div className="text-xs font-bold text-gray-400 mt-0.5">{app.job?.company?.name || "Premium Partner"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-600">{new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block ${app.status === "applied" ? "bg-blue-50 text-blue-600" :
                          app.status === "shortlisted" ? "bg-indigo-50 text-indigo-600" :
                            app.status === "interview" ? "bg-purple-50 text-purple-600" :
                              app.status === "selected" ? "bg-emerald-50 text-emerald-600" :
                                "bg-red-50 text-red-600"
                          }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-6">No applications yet.</p>
                        <Link to="/applicant" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                          Browse Projects
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

export default MyApplicationsPage;
