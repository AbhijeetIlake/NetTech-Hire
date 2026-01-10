import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function CompanyDashboard() {
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, pendingReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/jobs/me");
        const jobs = res.data;
        setStats({
          activeJobs: jobs.filter(j => j.isActive).length,
          totalApplicants: 0, // In a real app, you'd aggregate this
          pendingReviews: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Overview</h1>
          <p className="text-gray-600">Manage your job postings and track applicant progress.</p>
        </div>
        <Link
          to="/company/jobs/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Post a New Job
        </Link>
      </header>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: "Active Job Listings", value: stats.activeJobs, color: "blue", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" },
          { label: "Total Applications", value: "24", color: "indigo", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
          { label: "Interviews Scheduled", value: "8", color: "emerald", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} /></svg>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{item.label}</p>
            <p className={`text-5xl font-black text-${item.color}-600 tracking-tight transition-transform group-hover:scale-110 origin-left`}>
              {loading ? "..." : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/company/jobs" className="flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="font-bold text-gray-700">Manage Postings</span>
            </Link>
            <button className="w-full flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors group">
              <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <span className="font-bold text-gray-700">Team Management</span>
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white">
          <h2 className="text-xl font-bold mb-4">Hiring Tip</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Detailed job descriptions with clear salary ranges see 30% more applications on average. Try updating your inactive roles to attract top talent.
          </p>
          <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
