import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

function ApplicantDashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    myApplications: 0,
    shortlisted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, applicationsRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/applications/me")
        ]);

        const allJobs = jobsRes.data;
        const myApplications = applicationsRes.data;

        setJobs(allJobs.slice(0, 6)); // Show first 6 recent jobs
        setStats({
          totalJobs: allJobs.length,
          myApplications: myApplications.length,
          shortlisted: myApplications.filter(app =>
            app.status === 'shortlisted' || app.status === 'interview' || app.status === 'selected'
          ).length
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <Layout title="Dashboard" description="View recent job openings and track your applications.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Opportunities</h1>
          <p className="text-gray-600">Find the perfect tech role that matches your skills.</p>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Available Jobs", count: stats.totalJobs, color: "blue" },
            { label: "My Applications", count: stats.myApplications, color: "indigo" },
            { label: "In Progress", count: stats.shortlisted, color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Job Openings</h2>
          <Link to="/applicant" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View all jobs
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-48 rounded-2xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {job.workMode}
                      </span>
                      <span className="text-gray-400 text-xs font-medium">#{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100 flex-shrink-0">
                        {job.company?.profileImage ? (
                          <img
                            src={`${SVR_URL}/${job.company.profileImage}`}
                            alt="Logo"
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold text-lg">{job.company?.name?.[0] || "T"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{job.company?.name || "Tech Solutions"}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-6">
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 1 1 0 6H9l3 3m-3-6h6m-6 1h6m-6 1h6" /></svg>
                        {job.salaryRange.startsWith('₹') ? job.salaryRange : `₹${job.salaryRange}`}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/applicant/jobs/${job._id}`}
                    className="block text-center bg-gray-50 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ApplicantDashboard;
