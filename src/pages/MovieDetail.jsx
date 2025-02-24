import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Star } from "lucide-react"; // or your icons
import api from "../services/api";
import "./MovieDetail.css";
import "./MovieTracker.css"; // or wherever your CSS is

function MovieDetail() {
  const { tmdbId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optional: track loading/error for recommended movies specifically
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState(null);

  // 1) Fetch main movie details
  useEffect(() => {
    if (!tmdbId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/movies/${tmdbId}/`);
        setMovie(response.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [tmdbId]);

  // 2) Fetch recommended movies
  useEffect(() => {
    if (!tmdbId) return;

    const fetchRecommendations = async () => {
      try {
        setRecommendLoading(true);
        const response = await api.get('/recommendations/');
        setRecommendedMovies(response.data.results || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendError(err);
      } finally {
        setRecommendLoading(false);
      }
    };

    fetchRecommendations();
  }, [tmdbId]);

  // 3) (Optional) Fetch videos or trailers
  useEffect(() => {
    if (!tmdbId) return;

    const fetchVideos = async () => {
      try {
        const response = await api.get(`/movies/${tmdbId}/videos/`);
        setVideos(response.data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [tmdbId]);

  const handleAddToWatchlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        alert("You must be logged in to add movies to your collection.");
        return;
      }
  
      await api.post(`/collection/${tmdbId}/`);
      alert("Movie added to watchlist!");
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      alert("Failed to add movie. Make sure you are logged in.");
    }
  };
  

  const handleMovieSelect = (selectedMovieId) => {
    navigate(`/movies/${selectedMovieId}`);
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
    return <div className="error-message">Error loading movie details.</div>;
  }

  if (!movie) {
    return null;
  }

  // Helper to get images from TMDB
  const getImageUrl = (path, size = "w500") => {
    return path
      ? `https://image.tmdb.org/t/p/${size}${path}`
      : "/path/to/placeholder-image.jpg";
  };

  // Possibly find first YouTube trailer
  const trailer = videos.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer"
  );

  // For a blurred background
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <div
      className="movie-detail-container"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        // If you want a blur/darken overlay, you can do that in CSS with ::before
      }}
    >

      {/* MAIN CONTENT */}
      <main>
        {/* Basic Info Row */}
        <div className="movie-header">
          <h1 className="movie-title">{movie.title}</h1>
          <button className="add-to-watchlist" onClick={handleAddToWatchlist}>
            <Bookmark size={20} />
            Add to watchlist
          </button>
        </div>

        {/* Genres */}
        <div className="movie-genre-tags">
          {movie.genres?.map((genre) => (
            <span key={genre.id} className="genre-tag">
              {genre.name}
            </span>
          ))}
        </div>

        {/* Poster + Info */}
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
                <span>{movie.vote_average?.toFixed(1)}/10</span>
                {movie.vote_count && (
                  <span className="review-count">
                    {movie.vote_count} Reviews
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="movie-info-section">
            <p className="movie-synopsis">{movie.overview}</p>

            {/* Trailer (if found) */}
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
                <span>{movie.release_date}</span>
              </div>
              {movie.runtime && (
                <div className="info-item">
                  <span className="info-label">Runtime</span>
                  <span>{movie.runtime} minutes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <section className="recommended-section">
          <h2>Recommended</h2>

          {/* If you want to handle states */}
          {recommendLoading && <p>Loading recommendations...</p>}
          {recommendError && (
            <p style={{ color: "red" }}>
              Error fetching recommended movies. Try again later.
            </p>
          )}
          {!recommendLoading && !recommendError && recommendedMovies.length === 0 && (
            <p>No recommended movies found.</p>
          )}

          <div className="recommended-grid">
            {recommendedMovies.map((recMovie) => (
              <div
                key={recMovie.id}
                className="recommended-movie-card"
                onClick={() => handleMovieSelect(recMovie.tmdb_id)}
              >
                <img
                  src={getImageUrl(recMovie.poster_path)}
                  alt={recMovie.title}
                />
                <div className="movie-rating">
                  <Star size={14} className="star-icon" />
                  <span>{recMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MovieDetail;
