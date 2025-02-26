import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import MovieCard from "../components/MovieCard";
import "./MovieTracker.css";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]); // Stores all movies
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("query");
    if (!searchQuery) return;

    setQuery(searchQuery);
    fetchMovies(searchQuery);
  }, [location.search]);

  const fetchMovies = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve token from local storage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No authentication token found.");
        setError("Unauthorized: Please log in.");
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/search/advanced/",
        {
          params: { person: searchQuery },
          headers: { Authorization: `Bearer ${token}` }, // ✅ Use dynamic token
        }
      );

      if (!response.data.results || response.data.results.length === 0) {
        setError("No results found.");
        setSearchResults([]);
      } else {
        console.log("Fetched search results:", response.data.results.length);
        setSearchResults(response.data.results); // ✅ Ensures all movies are stored
      }
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

  return (
    <div className="app-container">
      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search movies or actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-bar"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Search Results */}
      <section className="mb-8">
        <h2 className="section-title">
          Search Results for: <span className="query-highlight">{query}</span>
        </h2>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && <p className="error-message text-red-500">{error}</p>}

        {!loading && !error && searchResults.length === 0 && (
          <p className="no-results">No movies found.</p>
        )}

        {/* Display ALL fetched movies */}
        <div className="grid grid-cols-5 gap-6">
          {searchResults.map((movie, index) => (
            <MovieCard key={movie.id || movie.tmdb_id || index} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
