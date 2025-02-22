import React, { useState, useEffect } from "react";

const LoginPage = () => {
  // State for animation control
  const [isVisible, setIsVisible] = useState(false);
  const [isFormBouncing, setIsFormBouncing] = useState(false);

  // Animation effect for title fade-in
  useEffect(() => {
    // Fade in the title after 500ms
    const titleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Bounce effect for form after 1000ms
    const formTimer = setTimeout(() => {
      setIsFormBouncing(true);
    }, 1000);

    // Cleanup timers
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(formTimer);
    };
  }, []);

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
    opacity: isFormBouncing ? 1 : 0, // Initial opacity for fade-in
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
    fontSize: "75px",
    fontWeight: "600",
    lineHeight: "55.44px",
    fontFamily: '"Poppins", sans-serif', // Stylish, clean, and modern font
    letterSpacing: "0",
    marginBottom: "10px",
    opacity: isVisible ? 1 : 0, // Initial opacity for fade-in
    transition: "opacity 1s ease-in-out", // Smooth fade-in animation
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
    animation: isFormBouncing ? "bounce 0.5s ease-in-out" : "none", // Bounce animation for inputs
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
    animation: isFormBouncing ? "bounce 0.5s ease-in-out" : "none", // Bounce animation for button
  };

  // CSS keyframes for animations (inline for simplicity, but you can move to a CSS file)
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
      <style>{styles}</style> {/* Inject CSS keyframes */}
      <div style={containerStyles}>
        <div style={formContainerStyles}>
          {/* Logo */}
          <div style={formGroupStyles}>
            <div style={logoTextStyles}>The</div>
            <div style={logoTextStyles}>Movie</div>
            <div style={logoTextStyles}>Tracker</div>
          </div>

          {/* Form */}
          <div style={{ ...formGroupStyles, marginTop: "40px" }}>
            <input
              type="email"
              placeholder="sesib18540@meogl.com"
              style={inputStyles}
            />
            <input
              type="password"
              placeholder="••••••••••••••••"
              style={inputStyles}
            />
            <button style={buttonStyles}>Login</button>

            <div
              style={{
                textAlign: "center",
                marginTop: "15px",
                color: "#808080",
                fontSize: "14px",
                width: "100%",
                animation: isFormBouncing ? "fadeIn 0.5s ease-in-out" : "none", // Fade-in for signup text
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
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
