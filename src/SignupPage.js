import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!userData.username || !userData.email || !userData.password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (userData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup.php`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(userData),
});

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://t3.ftcdn.net/jpg/10/19/78/30/360_F_1019783055_LrDfqH0KDkx17CHkNrAyj6UWOEi8IX65.jpg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "80%",
          maxWidth: "1100px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          opacity: 0.8, 
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ color: "#333333", fontSize: "24px", marginBottom: "20px" }}>Sign up</h2>
          <p style={{ color: "#666666", marginBottom: "20px" }}>
            Already have an account? <a href="/" style={{ color: "#007bff" }}>Login here</a>
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666" }}>Name</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                placeholder="Enter your name here"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666" }}>Email ID</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter your email here"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666" }}>Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter your password here"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <input type="checkbox" style={{ marginRight: "10px" }} />
              <span style={{ color: "#666666", fontSize: "14px" }}>
                By signing up, you agree to receive updates.
              </span>
            </div>
            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
            {successMessage && <p style={{ color: "green", marginBottom: "10px" }}>{successMessage}</p>}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#e8f0fe",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden", 
          }}
        >
          <img
            src="https://previews.123rf.com/images/nicolasmenijes/nicolasmenijes1505/nicolasmenijes150500658/40605587-3d-renderer-illustration-white-people-writing-sign-up-on-notebook-page-isolated-white-background.jpg"
            alt="Illustration"
            style={{
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
