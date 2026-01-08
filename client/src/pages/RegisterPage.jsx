import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

/**
 * RegisterPage Component
 * Handles user registration with name, email, password, and role selection.
 */
function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name, email, password, role } = formData;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleRegisterForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // Navigate to login after successful registration
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "2rem auto", padding: "1.5rem" }}>
      <h2>Create your account</h2>

      <form onSubmit={handleRegisterForm} noValidate>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Full name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            value={email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="role" style={{ display: "block", marginBottom: "0.5rem" }}>I am a</label>
          <select
            id="role"
            value={role}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}
          >
            <option value="">Select account type</option>
            <option value="applicant">Job seeker</option>
            <option value="company">Company / Employer</option>
          </select>
        </div>

        {error && (
          <p style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "0.5rem", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2e7d32", textDecoration: "none", fontWeight: "bold" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
