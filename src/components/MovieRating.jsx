import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const MovieRating = ({ tmdbId, userRating, updateRating }) => {
  const [rating, setRating] = useState(userRating || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRating(userRating); // Ensure it updates when userRating changes
  }, [userRating]);

  const handleRating = async (selectedRating) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to rate movies.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/movies/${tmdbId}/rate/`,
        { rating: selectedRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(selectedRating);
      updateRating(selectedRating); // Update parent component's rating
      alert("Your rating has been saved!");
    } catch (err) {
      console.error("Error rating movie:", err);
      setError("Failed to rate movie.");
    }
  };

  return (
    <div className="movie-rating">
      <h3>Your Rating:</h3>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "selected" : ""}`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MovieRating;
