import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Star, Trash2 } from "lucide-react";
import api from "../services/api";
import "./MovieDetail.css";
// import "./MovieTracker.css";

function MovieDetail() {
  const { tmdbId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isInCollection, setIsInCollection] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect
  const [isRemoving, setIsRemoving] = useState(false); // For remove button animation

  useEffect(() => {
    if (!tmdbId || tmdbId < 0) {
      setError("Invalid movie ID.");
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token)
          throw new Error("No authentication token found. Please log in.");
        const response = await api.get(`/api/movies/${tmdbId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovie(response.data);
        setUserRating(response.data.user_rating);
        await checkCollectionStatus();
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.message || "Error loading movie details.");
        if (err.response?.status === 401) navigate("/login");
      }
    };

    const checkCollectionStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/api/collection/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const collection = Array.isArray(response.data) ? response.data : [];
        const movieExists = collection.some(
          (item) => item.movie_details?.tmdb_id === parseInt(tmdbId)
        );
        setIsInCollection(movieExists);
        const userMovie = collection.find(
          (item) => item.movie_details?.tmdb_id === parseInt(tmdbId)
        );
        setUserRating(userMovie?.rating || null);
      } catch (err) {
        console.error("Error checking collection status:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/api/recommendations/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendedMovies(response.data.results || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendedMovies([]);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await api.get(`/api/movies/${tmdbId}/videos/`);
        setVideos(response.data.results || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
    fetchVideos();
  }, [tmdbId, navigate]);

  const handleAddToCollection = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/api/collection/${tmdbId}/`,
        { rating: null, notes: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInCollection(true);
      setAlert("success", "Movie added to your collection! 🎉");
    } catch (err) {
      console.error("Error adding to collection:", err);
      const errorMsg = err.response?.data?.error || "Failed to add movie.";
      setAlert("error", errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleRemoveFromCollection = async () => {
    setIsRemoving(true); // Trigger animation
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/api/collection/${tmdbId}/remove/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(() => {
        setIsInCollection(false);
        setUserRating(null);
        setIsRemoving(false);
        setAlert("success", "Movie removed from your collection!");
      }, 500); // Match animation duration
    } catch (err) {
      console.error("Error removing from collection:", err);
      setIsRemoving(false);
      setAlert("error", err.response?.data?.error || "Failed to remove movie.");
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleRateMovie = async (rating) => {
    if (userRating !== null) {
      setAlert("info", "You can only rate this movie once!");
      return;
    }
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
      setUserRating(response.data.rating);
      setAlert("success", "Movie rated successfully!");
    } catch (err) {
      console.error("Error rating movie:", err);
      setAlert("error", err.response?.data?.error || "Failed to rate movie.");
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const setAlert = (type, message) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleMovieSelect = (selectedMovieId) => {
    if (selectedMovieId > 0) {
      navigate(`/movies/${selectedMovieId}`);
    } else {
      setAlert("error", "This movie is not available for details.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!movie) {
    return null;
  }

  const getImageUrl = (path, size = "w500") =>
    path
      ? `https://image.tmdb.org/t/p/${size}${path}`
      : "https://placehold.co/300x450?text=No+Image";

  const trailer = videos.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer"
  );
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <div
      className="movie-detail-container"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      {showAlert && (
        <div className={`alert-box animate-slide-in ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <main>
        <div className="movie-header">
          <h1 className="movie-title">{movie.title}</h1>
          {isInCollection ? (
            <button
              className={`remove-from-collection ${
                isRemoving ? "animate-remove" : ""
              }`}
              onClick={handleRemoveFromCollection}
              disabled={isRemoving}
            >
              <Trash2 size={20} /> Remove from Collection
            </button>
          ) : (
            <button
              className="add-to-watchlist"
              onClick={handleAddToCollection}
              disabled={isInCollection}
            >
              <Bookmark size={20} /> Add to Collection
            </button>
          )}
          {isInCollection && (
            <div className="star-rating">
              {userRating !== null ? (
                <p>
                  Your Rating:{" "}
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`star-icon ${i < userRating ? "filled" : ""}`}
                    />
                  ))}
                </p>
              ) : (
                <div
                  onMouseLeave={() => setHoverRating(0)}
                  className="star-rating-input"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`star-icon cursor-pointer ${
                        i < (hoverRating || 0) ? "hover-filled" : ""
                      }`}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onClick={() => handleRateMovie(i + 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="movie-main-content">
          <div className="movie-poster-section">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-stats">
              <div className="imdb-rating">
                <Star className="star-icon" />
                <span>{movie.vote_average?.toFixed(1) || "N/A"}/10 TMDB</span>
              </div>
              <div className="imdb-rating">
                <Star className="star-icon" />
                <span>{movie.imdb_rating?.toFixed(1) || "N/A"} IMDb</span>
              </div>
              <div className="imdb-rating">
                <Star className="star-icon" />
                <span>
                  {movie.rotten_tomatoes_rating
                    ? `${movie.rotten_tomatoes_rating}%`
                    : "N/A"}{" "}
                  RT
                </span>
              </div>
            </div>
          </div>

          <div className="movie-info-section">
            <p className="movie-synopsis">{movie.overview}</p>
            {trailer && (
              <div className="trailer-section">
                <h2>Watch Trailer</h2>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
            <div className="movie-additional-info">
              <div className="info-item">
                <span className="info-label">Release Date</span>
                <span>{movie.release_date || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="recommended-section">
          <h2>Recommended</h2>
          {recommendedMovies.length === 0 ? (
            <p>No recommended movies found.</p>
          ) : (
            <div className="recommended-grid">
              {recommendedMovies.map((recMovie) => (
                <div
                  key={recMovie.tmdb_id || recMovie.id}
                  className="recommended-movie-card"
                  onClick={() => handleMovieSelect(recMovie.tmdb_id)}
                >
                  <img
                    src={getImageUrl(recMovie.poster_path)}
                    alt={recMovie.title}
                  />
                  <div className="movie-rating">
                    <Star size={14} className="star-icon" />
                    <span>{recMovie.vote_average?.toFixed(1) || "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MovieDetail;
