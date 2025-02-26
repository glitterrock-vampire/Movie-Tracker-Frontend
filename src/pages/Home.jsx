import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MovieTracker.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const possiblePaths = [
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
        : null,
    ];
    const validPath = possiblePaths.find((path) => path !== null);
    setImageSrc(validPath || "https://placehold.co/300x450?text=No+Image");
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
  const navigate = useNavigate();
  const [nowShowing, setNowShowing] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("all");
  const [loading, setLoading] = useState({
    nowShowing: true,
    popular: true,
    recommendations: true,
  });
  const [error, setError] = useState({
    nowShowing: null,
    popular: null,
    recommendations: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const fetchNowShowing = api
      .get("/api/movies/now_showing/", config)
      .then((res) => setNowShowing(res.data.results || []))
      .catch((err) => {
        console.error("Error fetching now showing movies:", err);
        setError((prev) => ({
          ...prev,
          nowShowing: "Failed to load currently showing movies.",
        }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, nowShowing: false })));

    const fetchPopular = api
      .get("/api/movies/popular/", config)
      .then((res) => setPopular(res.data.results || []))
      .catch((err) => {
        console.error("Error fetching popular movies:", err);
        setError((prev) => ({
          ...prev,
          popular: "Failed to load popular movies.",
        }));
      })
      .finally(() => setLoading((prev) => ({ ...prev, popular: false })));

    const fetchRecommendations = api
      .get("/api/recommendations/", config)
      .then((res) => {
        console.log("Recommendations fetched:", res.data.results);
        setRecommendations(res.data.results || []);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setError((prev) => ({
          ...prev,
          recommendations: "Failed to load recommendations.",
        }));
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() =>
        setLoading((prev) => ({ ...prev, recommendations: false }))
      );
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading((prev) => ({ ...prev, searchResults: true }));
    setError((prev) => ({ ...prev, searchResults: null }));

    try {
      const token = localStorage.getItem("accessToken");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      let response;

      if (searchType === "person") {
        response = await api.get(
          `/api/search/advanced/?person=${encodeURIComponent(searchQuery)}`,
          config
        );
      } else if (searchType === "genre") {
        const genresResponse = await api.get("/api/genres/", config);
        const matchedGenre = genresResponse.data.find((genre) =>
          genre.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchedGenre) {
          response = await api.get(
            `/api/search/advanced/?genre_id=${matchedGenre.tmdb_id}`,
            config
          );
        } else {
          throw new Error("No matching genre found");
        }
      } else if (searchType === "title") {
        response = await api.get(
          `/api/search/advanced/?title=${encodeURIComponent(searchQuery)}`,
          config
        );
      } else {
        const peopleResponse = await api.get(
          `/api/people/search/?query=${encodeURIComponent(searchQuery)}`,
          config
        );
        if (peopleResponse.data.results?.length > 0) {
          const personId = peopleResponse.data.results[0].tmdb_id;
          response = await api.get(
            `/api/search/advanced/?person_id=${personId}`,
            config
          );
        } else {
          response = await api.get(
            `/api/search/advanced/?title=${encodeURIComponent(searchQuery)}`,
            config
          );
        }
      }

      console.log("Fetched search results:", response.data.results);
      setSearchResults(response.data.results || []);
      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
    } catch (err) {
      console.error("Search error:", err);
      setError((prev) => ({
        ...prev,
        searchResults: "Failed to search movies.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, searchResults: false }));
    }
  };

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

      <section className="mb-8">
        <h2 className="section-title">Suggested To Watch</h2>
        {loading.recommendations ? (
          <div className="flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error.recommendations ? (
          <p className="error-message text-red-500">{error.recommendations}</p>
        ) : recommendations.length === 0 ? (
          <p className="text-gray-500">
            No recommendations available. Add movies to your collection!
          </p>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {recommendations.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
            ))}
          </div>
        )}
      </section>

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
