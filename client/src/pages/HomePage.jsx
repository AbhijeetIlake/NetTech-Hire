import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'applicant') {
        navigate('/applicant');
      } else if (user.role === 'company') {
        navigate('/company');
      }
    }
  }, [user, isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to NetTech Hire</h1>
        <p className="text-lg text-gray-600 mb-8">Your gateway to the next career move.</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
