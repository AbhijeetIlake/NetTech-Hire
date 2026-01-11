import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              NetTech<span className="text-gray-900">Hire</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {user.role === "applicant" && (
                  <>
                    <Link to="/applicant" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Find Jobs</Link>
                    <Link to="/applicant/applications" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">My Applications</Link>
                    <Link to="/applicant/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Profile</Link>
                  </>
                )}
                {user.role === "company" && (
                  <>
                    <Link to="/company" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Post Job</Link>
                    <Link to="/company/jobs" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">My Jobs</Link>
                    <Link to="/company/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Profile</Link>
                  </>
                )}
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
