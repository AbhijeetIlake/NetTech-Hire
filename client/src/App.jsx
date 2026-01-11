// App.jsx
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import JobDetailsPage from "./pages/applicant/JobDetailsPage";
import MyApplicationsPage from "./pages/applicant/MyApplicationsPage";

import CompanyDashboard from "./pages/company/CompanyDashboard";
import CreateJobPage from "./pages/company/CreateJobPage";
import MyJobsPage from "./pages/company/MyJobsPage";
import ApplicantsPage from "./pages/company/ApplicantsPage";
import ApplicantProfile from "./pages/applicant/ApplicantProfile";
import CompanyProfile from "./pages/company/CompanyProfile";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFDFD]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mb-4"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Initializing NetTech Hire</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Applicant Routes */}
        <Route
          path="/applicant"
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/applications"
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/profile"
          element={
            <ProtectedRoute allowedRoles={["applicant"]}>
              <ApplicantProfile />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs/create"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CreateJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <MyJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/profile"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
