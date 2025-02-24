import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieTracker.css"; // Ensure this contains styling

const SearchPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("query");
    if (!searchQuery) return;

    setQuery(searchQuery);
    fetchMovies(searchQuery);
  }, [location.search]);

  const fetchMovies = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/movies/search/?query=${searchQuery}`
      );
      setMovies(response.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleMovieClick = (tmdbId) => {
    navigate(`/movies/${tmdbId}`); // ✅ Navigates to MovieDetail page
  };

  return (
    <div className="search-results-container">
      {/* Header with Search Bar */}
      <header className="search-header">
        {/* <div className="app-title">
          <span>The</span>
          <span>Movie</span>
          <span>Tracker</span>
        </div> */}

        {/* Search Bar */}
        <div className="inline-search-form">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="🔍 Search a movie or a series"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-bar"
            />
            <button type="submit" className="search-button">🔍</button>
          </form>
        </div>
      </header>

      {/* Search Results */}
      <h2 className="section-title">
        Showing search results for: <span className="query-highlight">{query}</span>
      </h2>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && movies.length === 0 && <p className="no-results">No movies found.</p>}

      <div className="grid grid-cols-6">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card cursor-pointer" onClick={() => handleMovieClick(movie.tmdb_id)}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.jpg"
              }
              alt={movie.title}
              className="movie-card-image"
            />
            <div className="movie-card-overlay">
              <h3>{movie.title}</h3>
              <p className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
