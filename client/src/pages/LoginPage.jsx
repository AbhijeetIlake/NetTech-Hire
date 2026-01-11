import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  // Destination after login: from location state or default role path
  const from = location.state?.from?.pathname || null;

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === "applicant") navigate("/applicant", { replace: true });
        else if (user.role === "company") navigate("/company", { replace: true });
        else navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showToast("Full credentials required.", "warning");

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data);
      showToast("Signed in successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign In" description="Login to your NetTech Hire account to manage applications and jobs.">
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign in to NetTech Hire
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange}
                />
              </div>
            </div>


            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;

