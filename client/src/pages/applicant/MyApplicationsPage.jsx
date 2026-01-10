import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Job Applications</h1>
        <p className="text-gray-500">Track the status of your various job pursuits.</p>
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
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Company & Role</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.job?.title}</div>
                      <div className="text-xs font-medium text-gray-500 mt-1">{app.job?.company?.name || "Tech Industry"}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-medium text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block ${app.status === "pending" ? "bg-amber-100 text-amber-700" :
                          app.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center text-gray-500 font-medium font-bold">
                    You haven't applied to any jobs yet.{" "}
                    <Link to="/applicant" className="text-blue-600 hover:underline ml-1">Explore opportunities</Link>
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

export default MyApplicationsPage;
