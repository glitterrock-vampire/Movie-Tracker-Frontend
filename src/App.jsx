import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";

const App = () => {
  return (
    <Router>
      <AuthRedirect /> {/* Handles the initial login check */}
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/movies/:tmdbId" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

// Redirects if the user is already logged in
const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Check token
    if (token) {
      navigate("/home"); // If logged in, go to Home
    }
  }, []);

  return null; // Prevents unnecessary renders
};

// Protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // If not logged in, go to login
    }
  }, [token, navigate]);

  return token ? children : null;
};

export default App;