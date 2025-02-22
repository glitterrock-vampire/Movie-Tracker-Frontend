import React, { useState, useEffect } from "react";
import axios from "axios"; // Using axios instead of fetch for consistency with your dependencies

const LoginPage = () => {
  // State for animation control
  const [isVisible, setIsVisible] = useState(false);
  const [isFormBouncing, setIsFormBouncing] = useState(false);

  // State for form and login
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animation effect for title fade-in and form bounce
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

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email, // Use email for authentication (matches CustomUser in Django)
        password,
      });

      const data = response.data;

      if (!response.status === 200) {
        throw new Error(data.detail || "Login failed");
      }

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

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
            onSubmit={handleLogin}
            style={{ ...formGroupStyles, marginTop: "40px" }}
          >
            {error && <div style={errorStyles}>{error}</div>}
            {isLoading && <div style={loadingStyles}>Loading...</div>}
            <input
              type="email" // Changed back to email type for better UX
              placeholder="movieuser@email.com" // Updated placeholder for email
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyles}
            />
            <input
              type="password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyles}
            />
            <button type="submit" style={buttonStyles}>
              {isLoading ? "Logging in..." : "Login"}
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
              You don't have an account?{" "}
              <a
                href="/signup"
                style={{
                  color: "#00BFFF",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                SignUp
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
