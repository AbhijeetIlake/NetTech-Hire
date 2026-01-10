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

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* public routes  */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Home  */}
            <Route path="/" element={<HomePage />} />

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

            {/* conpany rotes  */}

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}



export default App;
