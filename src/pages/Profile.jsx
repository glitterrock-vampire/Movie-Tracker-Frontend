import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Star } from "lucide-react";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await api.get("/api/collection/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile collection data:", response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      setCollection(data);
      setError("");
    } catch (err) {
      console.error("Error fetching collection:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to load collection.");
      }
    }
  };

  const handleRemoveMovie = async (tmdbId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/api/collection/${tmdbId}/remove/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollection((prev) => prev.filter((item) => item.movie_details.tmdb_id !== tmdbId));
      setAlert("success", "Movie removed from your collection!");
      fetchCollection(); // Refetch to ensure sync
    } catch (err) {
      console.error("Error removing movie:", err);
      setAlert("error", err.response?.data?.error || "Failed to remove movie.");
    }
  };

  const handleRateMovie = async (tmdbId, rating) => {
    if (!rating || rating < 1 || rating > 5) {
      setAlert("error", "Rating must be between 1 and 5.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put(
        `/api/movies/${tmdbId}/rate/`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollection((prev) =>
        prev.map((item) =>
          item.movie_details.tmdb_id === tmdbId ? { ...item, rating: response.data.rating } : item
        )
      );
      setAlert("success", "Movie rated successfully!");
    } catch (err) {
      console.error("Error rating movie:", err);
      setAlert("error", err.response?.data?.error || "Failed to rate movie.");
    }
  };

  const handleMovieClick = (tmdbId) => {
    if (tmdbId) {
      navigate(`/movies/${tmdbId}`);
      setTimeout(fetchCollection, 500); // Delayed refetch to sync with MovieDetail
    } else {
      console.warn("No TMDB ID available:", tmdbId);
      setAlert("error", "Cannot navigate to movie details due to missing ID.");
    }
  };

  const setAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const paginatedCollection = collection.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );
  const totalPages = Math.ceil(collection.length / moviesPerPage);

  return (
    <div className="profile-container">
      <h2>My Collection</h2>

      {error && <p className="error-message">{error}</p>}

      {showAlert && (
        <div className={`alert-box animate-slide-in ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <div className="movie-grid">
        {collection.length > 0 ? (
          paginatedCollection.map((item) => {
            const movie = item.movie_details || {};
            const tmdbId = movie.tmdb_id;

            return (
              <div
                key={item.id}
                className="movie-card cursor-pointer"
                onClick={() => handleMovieClick(tmdbId)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://placehold.co/150x225?text=No+Image"
                  }
                  alt={movie.title || "No title available"}
                  className="movie-poster"
                  onError={(e) => (e.target.src = "https://placehold.co/150x225?text=No+Image")}
                />
                <div className="movie-details">
                  <h3>{movie.title || "Untitled Movie"}</h3>
                  <p>Release Date: {movie.release_date || "N/A"}</p>
                  <div className="rating-section">
                    {item.rating ? (
                      <p>
                        Your Rating: <Star size={16} className="star-icon" /> {item.rating}
                      </p>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rate (1-5)"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const rating = parseInt(e.target.value) || null;
                          if (rating && rating >= 1 && rating <= 5) {
                            handleRateMovie(tmdbId, rating);
                          }
                        }}
                        className="rating-input"
                        disabled={item.rating !== null}
                      />
                    )}
                  </div>
                  <button
                    className="btn btn-remove styled-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMovie(tmdbId);
                    }}
                  >
                    <Trash2 size={20} /> Remove
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-collection">Your collection is empty.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination flex justify-center mt-4 space-x-2">
          <button
            className="btn bg-gray-200 px-3 py-1 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`btn px-3 py-1 rounded ${
                currentPage === index + 1 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn bg-gray-200 px-3 py-1 rounded"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;