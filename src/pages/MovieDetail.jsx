import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Star, Search as SearchIcon } from "lucide-react";
import api from "../services/api";

const MovieDetail = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const movieResponse = await api.get(`/movies/${tmdbId}/`);
        setMovie(movieResponse.data);

        // Fetch recommended movies
        const recommendedResponse = await api.get("/recommendations/");
        setRecommendedMovies(recommendedResponse.data.results || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [tmdbId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(
        `/movies/search/?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.results);
      // Navigate to search results page or show results in a modal
      navigate("/search", {
        state: { results: response.data.results, query: searchQuery },
      });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleMovieSelect = (selectedMovieId) => {
    navigate(`/movie/${selectedMovieId}`);
  };

  const handleAddToWatchlist = async () => {
    try {
      await api.post(`/collection/${tmdbId}/`);
      // TODO: Add success notification
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      // TODO: Add error notification
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

  return (
    <div className="movie-detail-container">
      {/* Header with Logo and Search */}
      <header className="app-header">
        <div className="logo-search-container">
          <div className="app-title">
            <span className="block">The</span>
            <span className="block">
              Movie
              <form onSubmit={handleSearch} className="inline-search-form">
                <input
                  type="text"
                  placeholder="Search a movie or a series"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar"
                />
                <button type="submit" className="search-button">
                  <SearchIcon size={20} />
                </button>
              </form>
            </span>
            <span className="block">Tracker</span>
          </div>
        </div>
      </header>

      {/* Movie Detail Content */}
      <div className="movie-detail-content">
        <div className="movie-detail-left">
          <h1 className="movie-title">{movie.title}</h1>

          <div className="movie-genre-tags">
            {movie.genres &&
              movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
          </div>

          <div className="movie-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              onError={(e) => {
                e.target.src = "/path/to/placeholder-image.jpg";
              }}
            />
          </div>

          <div className="movie-rating">
            <div className="imdb-rating">
              <Star className="star-icon" />
              <span>{movie.vote_average.toFixed(1)}/10</span>
              <span className="review-count">
                {movie.vote_count ? `${movie.vote_count} Reviews` : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="movie-detail-right">
          <p className="movie-synopsis">{movie.overview}</p>

          <div className="movie-additional-info">
            <div className="info-item">
              <span className="info-label">Release Date:</span>
              <span>{movie.release_date}</span>
            </div>
            {movie.runtime && (
              <div className="info-item">
                <span className="info-label">Runtime:</span>
                <span>{movie.runtime} minutes</span>
              </div>
            )}
          </div>

          <button className="add-to-watchlist" onClick={handleAddToWatchlist}>
            <Bookmark />
            Add to watchlist
          </button>
        </div>
      </div>

      {/* Recommended Movies Section */}
      <div className="recommended-movies">
        <h2>Recommended</h2>
        <div className="recommended-grid">
          {recommendedMovies.map((recommendedMovie) => (
            <div
              key={recommendedMovie.id}
              className="recommended-movie-card"
              onClick={() => handleMovieSelect(recommendedMovie.tmdb_id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}`}
                alt={recommendedMovie.title}
                onError={(e) => {
                  e.target.src = "/path/to/placeholder-image.jpg";
                }}
              />
              <div className="movie-rating">
                <Star className="star-icon" />
                <span>{recommendedMovie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
