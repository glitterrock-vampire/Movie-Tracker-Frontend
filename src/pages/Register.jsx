// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterPage = () => {
  // State for animation control
  const [isVisible, setIsVisible] = useState(false);
  const [isFormBouncing, setIsFormBouncing] = useState(false);

  // State for form and registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animate title fade-in and form bounce
  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const formTimer = setTimeout(() => {
      setIsFormBouncing(true);
    }, 1000);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(formTimer);
    };
  }, []);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // POST /register/ (Your DRF endpoint)
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email,
        password,
      });

      if (response.status !== 201) {
        // If it doesn't return 201, treat as error
        throw new Error(response.data?.error || "Registration failed");
      }

      const data = response.data;
      // Access & refresh tokens returned by your /register/ endpoint
      const { refresh, access } = data.tokens;

      // Store tokens in localStorage for subsequent authenticated requests
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Optionally redirect user after successful registration
      window.location.href = "/"; // or /login
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable styles (similar to your LoginPage)
  const containerStyles = {
    backgroundColor: "#0D1B2A",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  };

  const formContainerStyles = {
    backgroundColor: "transparent",
    padding: "40px",
    borderRadius: "10px",
    width: "450px",
    border: "2px solid #00BFFF",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    opacity: isFormBouncing ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
    animation: isFormBouncing ? "bounce 1s ease-in-out" : "none",
  };

  const formGroupStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };

  const logoTextStyles = {
    color: "#00E05A",
    fontSize: "80px",
    fontWeight: "600",
    lineHeight: "55.44px",
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: "0",
    marginBottom: "10px",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 1s ease-in-out",
  };

  const inputStyles = {
    backgroundColor: "#D9D9D9",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    width: "100%",
    textAlign: "center",
    border: "none",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    animation: isFormBouncing ? "bounce 0.5s ease-in-out" : "none",
  };

  const buttonStyles = {
    backgroundColor: "#00BFFF",
    color: "white",
    borderRadius: "10px",
    padding: "15px",
    width: "100%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "5px",
    boxSizing: "border-box",
    animation: isFormBouncing ? "bounce 0.5s ease-in-out" : "none",
  };

  const errorStyles = {
    color: "red",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  };

  const loadingStyles = {
    textAlign: "center",
    color: "white",
    marginBottom: "15px",
    fontSize: "16px",
  };

  const styles = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={containerStyles}>
        <div style={formContainerStyles}>
          {/* Logo */}
          <div style={formGroupStyles}>
            <div style={logoTextStyles}>The</div>
            <div style={logoTextStyles}>Movie</div>
            <div style={logoTextStyles}>Tracker</div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            style={{ ...formGroupStyles, marginTop: "40px" }}
          >
            {error && <div style={errorStyles}>{error}</div>}
            {isLoading && <div style={loadingStyles}>Registering...</div>}

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyles}
              required
            />
            <input
              type="password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyles}
              required
            />
            <button type="submit" style={buttonStyles}>
              {isLoading ? "Please wait..." : "Sign Up"}
            </button>

            <div
              style={{
                textAlign: "center",
                marginTop: "15px",
                color: "#808080",
                fontSize: "14px",
                width: "100%",
                animation: isFormBouncing ? "fadeIn 0.5s ease-in-out" : "none",
              }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#00BFFF",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
