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
  const [searchType, setSearchType] = useState("all");
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
        setError((prev) => ({
          ...prev,
          nowShowing:
            "Failed to load currently showing movies. Please try again later.",
        }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, nowShowing: false })));

    const fetchPopular = api
      .get("/api/movies/popular/")
      .then((res) => {
        setPopular(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching popular movies:", err);
        setError((prev) => ({
          ...prev,
          popular: "Failed to load popular movies. Please try again later.",
        }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, popular: false })));

    const fetchRecommendations = api
      .get("/api/recommendations/")
      .then((res) => {
        setRecommendations(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setError((prev) => ({
          ...prev,
          recommendations:
            "Failed to load recommendations. Please try again later.",
        }));
      })
      .finally(() =>
        setLoading((prev) => ({ ...prev, recommendations: false }))
      );

    // No need for Promise.all; let each fetch run independently
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading((prev) => ({ ...prev, searchResults: true }));
    setError((prev) => ({ ...prev, searchResults: null }));

    try {
      let response = null; // Ensure only one API request is made

      if (searchType === "person") {
        response = await api.get(
          `/api/search/advanced/?person=${encodeURIComponent(searchQuery)}`
        );
      } else if (searchType === "genre") {
        const genresResponse = await api.get("/api/genres/");
        const matchedGenre = genresResponse.data.find((genre) =>
          genre.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchedGenre) {
          response = await api.get(
            `/api/search/advanced/?genre_id=${matchedGenre.tmdb_id}`
          );
        } else {
          throw new Error("No matching genre found");
        }
      } else if (searchType === "title") {
        response = await api.get(
          `/api/search/advanced/?title=${encodeURIComponent(searchQuery)}`
        );
      } else {
        // Default case: Try searching by person first, then title
        const peopleResponse = await api.get(
          `/api/people/search/?query=${encodeURIComponent(searchQuery)}`
        );

        if (peopleResponse.data.results?.length > 0) {
          const personId = peopleResponse.data.results[0].tmdb_id;
          response = await api.get(
            `/api/search/advanced/?person_id=${personId}`
          );
        } else {
          response = await api.get(
            `/api/search/advanced/?title=${encodeURIComponent(searchQuery)}`
          );
        }
      }

      if (!response || !response.data.results) {
        throw new Error("No results found.");
      }

      console.log("Fetched search results:", response.data.results); // Debugging
      setSearchResults(response.data.results);

      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
    } catch (err) {
      console.error("Search error:", err);
      setError((prev) => ({
        ...prev,
        searchResults:
          err.message || "Failed to search movies. Please try again later.",
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
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select mr-2"
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="person">Person</option>
            <option value="genre">Genre</option>
          </select>
          <input
            type="text"
            placeholder="Search movies, actors, genres..."
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
            <>
              <pre
                style={{ color: "white", overflowX: "auto", fontSize: "12px" }}
              >
                {JSON.stringify(searchResults, null, 2)}
              </pre>{" "}
              {/* 🔍 DEBUG: Prints all movies */}
              <div className="grid grid-cols-6 gap-6">
                {searchResults
                  .filter((movie) => movie && movie.title) // ✅ Ensure movie is valid
                  .map((movie, index) => (
                    <MovieCard
                      key={movie.id || movie.tmdb_id || index}
                      movie={movie}
                    />
                  ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;
