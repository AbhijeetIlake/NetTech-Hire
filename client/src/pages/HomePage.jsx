import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout title="NetTech Hire - Tech Recruitment Platform" description="Connect top tech talent with leading companies. Streamline your hiring process or find your dream tech role.">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-blue-300 uppercase bg-blue-900/50 rounded-full border border-blue-700/50">
              The Future of Tech Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              Connect. Hire. <span className="text-blue-400">Excel.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium leading-relaxed">
              NetTech Hire bridges the gap between exceptional tech talent and innovative companies. A streamlined platform built for the modern recruitment landscape.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated && user ? (
                <button
                  onClick={() => navigate(user.role === 'applicant' ? '/applicant' : '/company')}
                  className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-lg"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-lg"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto px-12 py-5 bg-white/10 text-white font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-lg backdrop-blur-sm"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Why NetTech Hire?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">A recruitment platform designed for efficiency, transparency, and results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Streamlined application process. Apply to multiple positions in minutes, not hours. Get feedback faster.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Quality Matches</h3>
              <p className="text-gray-600 leading-relaxed">Smart filtering ensures companies see qualified candidates and applicants find relevant opportunities.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Full Transparency</h3>
              <p className="text-gray-600 leading-relaxed">Track your application status in real-time. No more wondering where you stand in the hiring process.</p>
            </div>
          </div>
        </div>
      </div>

      {/* For Applicants Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 mb-4 text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
                For Job Seekers
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Land Your Dream Tech Role</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a seasoned developer or just starting your tech career, NetTech Hire connects you with companies that value your skills.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Create a professional profile with resume upload</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Browse curated tech job listings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Track all your applications in one dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Get real-time updates on your application status</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-3xl">
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Companies Section */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-blue-900/30 p-12 rounded-3xl border border-blue-700/30 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-black text-blue-400 mb-1">500+</div>
                    <div className="text-sm text-blue-200">Active Candidates</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-black text-emerald-400 mb-1">95%</div>
                    <div className="text-sm text-emerald-200">Match Rate</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-black text-purple-400 mb-1">24h</div>
                    <div className="text-sm text-purple-200">Avg Response</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-black text-orange-400 mb-1">100%</div>
                    <div className="text-sm text-orange-200">Free Platform</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-black tracking-widest text-blue-300 uppercase bg-blue-900/50 rounded-full border border-blue-700/50">
                For Companies
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Find Top Tech Talent</h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Stop sifting through hundreds of irrelevant resumes. NetTech Hire helps you find qualified candidates efficiently.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Post unlimited job listings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Review candidates with detailed profiles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Manage hiring pipeline from one dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Update candidate status & communicate efficiently</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-10">Join hundreds of tech professionals and companies already using NetTech Hire.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-12 py-5 bg-white text-blue-600 font-black rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-5 bg-white/10 text-white font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-lg backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
