import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "https://placehold.co/300x450?text=No+Image";
  };

  return (
    <div className="movie-card">
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title || "No title available"}
        className="movie-card-image cursor-pointer"
        onClick={() => navigate(`/movies/${movie.tmdb_id}`)}
        onError={(e) => {
          e.target.src = "https://placehold.co/300x450?text=No+Image";
        }}
      />
      <div className="movie-card-overlay">
        <h3>{movie.title || "Untitled Movie"}</h3>
        {movie.vote_average && (
          <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
