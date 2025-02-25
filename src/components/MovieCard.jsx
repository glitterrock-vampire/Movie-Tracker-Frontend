import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default MovieCard;