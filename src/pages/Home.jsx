import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import api from "../services/api";
import "./MovieTracker.css";

// Movie Card Component
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // Prefer poster_path, fallback to backdrop_path, then use placeholder
    const possiblePaths = [
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
        : null,
    ];

    const validPath = possiblePaths.find((path) => path !== null);
    setImageSrc(
      validPath || "https://placehold.co/300x450?text=No+Image" // Reliable fallback
    );
  }, [movie]);

  const handleMovieClick = () => {
    navigate(`/movies/${movie.tmdb_id}`);
  };

  return (
    <div className="movie-card">
      <img
        src={imageSrc}
        alt={movie.title || "No title available"}
        className="movie-card-image cursor-pointer"
        onClick={handleMovieClick}
        onError={(e) => {
          e.target.src = "https://placehold.co/300x450?text=No+Image";
        }}
      />
      {movie.vote_average && (
        <div className="movie-rating">
          <span className="mr-1">★</span>
          {movie.vote_average.toFixed(1)}
        </div>
      )}
      <div className="movie-card-overlay">
        <h3>{movie.title || "Untitled Movie"}</h3>
        <div className="movie-actions">
          <button className="btn btn-watch">Watch</button>
          <button className="btn btn-info" onClick={handleMovieClick}>
            Info
          </button>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const navigate = useNavigate(); // ✅ Define navigate inside Home()
  const [nowShowing, setNowShowing] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // State for recommendations
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [loading, setLoading] = useState({
    nowShowing: true,
    popular: true,
    recommendations: true,
  }); // Track loading state for each section
  const [error, setError] = useState({
    nowShowing: null,
    popular: null,
    recommendations: null,
  }); // Track errors for each section
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch data for each section independently
    const fetchNowShowing = api
      .get("/api/movies/now_showing/")
      .then((res) => {
        setNowShowing(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching now showing movies:", err);
        setError((prev) => ({ ...prev, nowShowing: "Failed to load currently showing movies. Please try again later." }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, nowShowing: false })));

    const fetchPopular = api
      .get("/api/movies/popular/")
      .then((res) => {
        setPopular(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching popular movies:", err);
        setError((prev) => ({ ...prev, popular: "Failed to load popular movies. Please try again later." }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, popular: false })));

    const fetchRecommendations = api
      .get("/api/recommendations/")
      .then((res) => {
        setRecommendations(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setError((prev) => ({ ...prev, recommendations: "Failed to load recommendations. Please try again later." }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, recommendations: false })));

    // No need for Promise.all; let each fetch run independently
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading((prev) => ({ ...prev, searchResults: true })); // Show loading for search
    setError((prev) => ({ ...prev, searchResults: null })); // Clear search errors

    try {
      const response = await api.get(
        `/api/movies/search/?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.results || []);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to SearchPage
      console.log("Search results:", response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError((prev) => ({
        ...prev,
        searchResults: "Failed to search movies. Please try again later.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, searchResults: false }));
    }
  };

  // Check if all sections are still loading
  const isLoading = Object.values(loading).some((isLoading) => isLoading);

  if (isLoading && !Object.values(error).some((err) => err)) {
    return (
      <div className="app-container flex justify-center items-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Search Bar Container */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search a movie or a series"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Currently Showing Section */}
      <section className="mb-8">
        <h2 className="section-title">Currently Showing</h2>
        {loading.nowShowing ? (
          <div className="flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error.nowShowing ? (
          <p className="error-message text-red-500">{error.nowShowing}</p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {nowShowing.slice(0, 4).map((movie) => (
              <MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Suggested To Watch Section (Replaced with Recommendations) */}
      <section className="mb-8">
        <h2 className="section-title">Suggested To Watch</h2>
        {loading.recommendations ? (
          <div className="flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error.recommendations ? (
          <p className="error-message text-red-500">{error.recommendations}</p>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {recommendations.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* What's Popular Section */}
      <section className="mb-8">
        <h2 className="section-title">What’s Popular?</h2>
        {loading.popular ? (
          <div className="flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error.popular ? (
          <p className="error-message text-red-500">{error.popular}</p>
        ) : (
          <div className="grid grid-cols-6 gap-6">
            {popular.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Search Results Section (Optional - Display on Home or Navigate) */}
      {searchResults.length > 0 && (
        <section>
          <h2 className="section-title">Search Results for "{searchQuery}"</h2>
          {loading.searchResults ? (
            <div className="flex justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : error.searchResults ? (
            <p className="error-message text-red-500">{error.searchResults}</p>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;