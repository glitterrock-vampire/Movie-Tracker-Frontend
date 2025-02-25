import React, { useState, useEffect } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard"; // Reuse or create a similar card
import "./RecommendationsPage.css"; // Optional styling

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get("/recommendations/");
      if (response.status === 200) {
        setRecommendations(response.data);
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err.response || err);
      setError(err.response?.data?.error || "Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="app-container flex justify-center items-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container flex justify-center items-center min-h-screen">
        <p className="error-message text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="section-title">Recommended Movies</h2>
      {recommendations.length === 0 ? (
        <p className="no-results">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-6 gap-6">
          {recommendations.map((rec) => (
            <MovieCard
              key={rec.tmdb_id || rec.title} // Use TMDB ID or title if no ID
              movie={{
                tmdb_id: rec.tmdb_id || null,
                title: rec.title,
                poster_path: null, // Fetch from TMDB or use placeholder
                vote_average: rec.vote_average || null,
                release_date: rec.release_date || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;