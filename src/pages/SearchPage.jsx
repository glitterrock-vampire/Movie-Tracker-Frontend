import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (query, type) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      let response;

      if (type === "person") {
        response = await api.get(
          `/api/search/advanced/?person=${encodeURIComponent(query)}`,
          config
        );
      } else if (type === "genre") {
        const genresResponse = await api.get("/api/genres/", config);
        const matchedGenre = genresResponse.data.find((genre) =>
          genre.name.toLowerCase().includes(query.toLowerCase())
        );
        if (matchedGenre) {
          response = await api.get(
            `/api/search/advanced/?genre_id=${matchedGenre.tmdb_id}`,
            config
          );
        } else {
          setSearchResults([]);
          setError("No matching genre found.");
          return;
        }
      } else if (type === "title") {
        response = await api.get(
          `/api/search/advanced/?title=${encodeURIComponent(query)}`,
          config
        );
      } else {
        response = await api.get(
          `/api/search/advanced/?title=${encodeURIComponent(query)}`,
          config
        );
      }

      console.log("Fetched search results:", response.data.results.length);
      setSearchResults(response.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch some search results.");
      setSearchResults([]); // Reset results on error, but keep UI usable
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    const type = params.get("type") || "title";
    if (query) {
      fetchMovies(query, type);
    }
  }, [location.search]);

  return (
    <div className="search-page">
      <h2>Search Results</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="results-grid">
          {searchResults.map((movie) => (
            <div
              key={movie.tmdb_id || movie.id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie.tmdb_id}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://placehold.co/200x300?text=No+Image"
                }
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
