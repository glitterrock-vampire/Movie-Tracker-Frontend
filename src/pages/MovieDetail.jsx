import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Star, Search as SearchIcon, Play } from "lucide-react";
import api from "../services/api";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [videos, setVideos] = useState([]); // New state for videos
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/movies/${tmdbId}/`);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (tmdbId) {
      fetchMovieDetails();
    }
  }, [tmdbId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get(`/movies/${tmdbId}/recommendations/`);
        setRecommendedMovies(response.data.results || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendedMovies([]);
      }
    };

    if (tmdbId) {
      fetchRecommendations();
    }
  }, [tmdbId]);

  // Fetch movie videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/movies/${tmdbId}/videos/`);
        setVideos(response.data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      }
    };

    if (tmdbId) {
      fetchVideos();
    }
  }, [tmdbId]);

  const handleMovieSelect = (selectedMovieId) => {
    navigate(`/movies/${selectedMovieId}`);
  };

  const handleAddToWatchlist = async () => {
    try {
      await api.post(`/collection/${tmdbId}/`);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error loading movie details</div>;
  }

  if (!movie) {
    return null;
  }

  const getImageUrl = (path, size = "w500") => {
    return path
      ? `https://image.tmdb.org/t/p/${size}${path}`
      : "/path/to/placeholder-image.jpg";
  };

  // Find the first YouTube trailer
  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
    <div className="movie-detail-container">
      <header className="app-header">
        <div className="app-title">
          <span>The</span>
          <span>Movie</span>
          <span>Tracker</span>
        </div>
      </header>

      <main>
        <div className="movie-header">
          <h1 className="movie-title">{movie.title}</h1>
          <button className="add-to-watchlist" onClick={handleAddToWatchlist}>
            <Bookmark size={20} />
            Add to watchlist
          </button>
        </div>

        <div className="movie-genre-tags">
          {movie.genres?.map((genre) => (
            <span key={genre.id} className="genre-tag">
              {genre.name}
            </span>
          ))}
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
                <span>{movie.vote_average?.toFixed(1)}/10</span>
                <span className="review-count">
                  {movie.vote_count ? `${movie.vote_count} Reviews` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="movie-info-section">
            <p className="movie-synopsis">{movie.overview}</p>

            {/* Display the trailer if available */}
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
                ></iframe>
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

        <section className="recommended-section">
          <h2>Recommended</h2>
          <div className="recommended-grid">
            {recommendedMovies.map((movie) => (
              <div
                key={movie.id}
                className="recommended-movie-card"
                onClick={() => handleMovieSelect(movie.tmdb_id)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-rating">
                  <Star size={14} className="star-icon" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MovieDetail;
