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
    // Prefer poster_path, fallback to backdrop_path
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
      validPath || "https://via.placeholder.com/300x450.png?text=Movie+Poster"
    );
  }, [movie]);

  const handleMovieClick = () => {
    navigate(`/movies/${movie.tmdb_id}`);
  };

  return (
    <div className="movie-card">
      <img
        src={imageSrc}
        alt={movie.title}
        className="movie-card-image cursor-pointer"
        onClick={handleMovieClick}
      />
      {movie.vote_average && (
        <div className="movie-rating">
          <span className="mr-1">★</span>
          {movie.vote_average.toFixed(1)}
        </div>
      )}
      <div className="movie-card-overlay">
        <h3>{movie.title}</h3>
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([api.get("/movies/now_showing/"), api.get("/movies/popular/")])
      .then(([nowRes, popRes]) => {
        setNowShowing(nowRes.data.results || []);
        setPopular(popRes.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // ✅ Redirects to SearchPage

    try {
      const response = await api.get(
        `/movies/search/?query=${encodeURIComponent(searchQuery)}`
      );
      console.log("Search results:", response.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  if (loading) {
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
        </form>
      </div>

      {/* Currently Showing Section */}
      <section className="mb-8">
        <h2 className="section-title">Currently Showing</h2>
        <div className="grid grid-cols-4 gap-6">
          {nowShowing.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Suggested To Watch Section */}
      <section className="mb-8">
        <h2 className="section-title">Suggested To Watch</h2>
        <div className="grid grid-cols-5 gap-6">
          {nowShowing.slice(4, 9).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* What's Popular Section */}
      <section>
        <h2 className="section-title">What's Popular?</h2>
        <div className="grid grid-cols-6 gap-6">
          {popular.slice(0, 6).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
