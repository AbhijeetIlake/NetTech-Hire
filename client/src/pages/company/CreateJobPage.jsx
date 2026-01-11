import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { useToast } from "../../context/ToastContext";

function CreateJobPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    workMode: "onsite",
    employmentType: "full-time",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/jobs", formData);
      showToast("Job posted successfully!", "success");
      navigate("/company/jobs");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create job.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Post a New Job" description="Create a new job posting to find the best tech talent.">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-2 leading-none">Post a New Job</h1>
            <p className="text-gray-400 font-medium">Connect with the top 1% of tech talent.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. ₹15L - ₹25L"
                  value={formData.salaryRange}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Work Mode</label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900 appearance-none"
                  onChange={handleChange}
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900 appearance-none"
                  onChange={handleChange}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Job Description</label>
                <textarea
                  name="description"
                  rows="6"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900 resize-none leading-relaxed"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>


            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 hover:shadow-blue-200 disabled:opacity-50 active:scale-95"
              >
                {loading ? "PUBLISHING..." : "PUBLISH JOB POSTING"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateJobPage;
