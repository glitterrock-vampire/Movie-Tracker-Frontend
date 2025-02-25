import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css"; // Ensure this CSS file exists for animations

function Profile() {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State for alert animation

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const response = await api.get("/api/collection/");
      console.log("Profile collection data:", response.data); // Debugging log
      const data = Array.isArray(response.data) ? response.data : [];
      setCollection(data);
    } catch (err) {
      console.error("Error fetching collection:", err);
      if (err.response && err.response.status === 401) {
        setError("You need to log in to view your collection.");
        window.location.href = "/login"; // Redirect on 401
      } else {
        setError("Failed to load collection. Please try again later.");
      }
    }
  };

  // Function to simulate the alert message when a movie is added
  const handleMovieAdded = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="profile-container">
      <h2>My Collection</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      {/* Animated Alert */}
      {showAlert && <div className="alert-box">Movie added to your collection! 🎉</div>}

      <div className="movie-grid">
        {collection.length > 0 ? (
          collection.map((item) => (
            <div key={item.id} className="movie-card">
              <img
                src={
                  item.movie_details?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.movie_details.poster_path}`
                    : "https://placehold.co/150x225?text=No+Image" // Reliable fallback
                }
                alt={item.movie_details?.title || "No title available"}
                className="movie-poster"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x225?text=No+Image"; // Fallback if TMDB or placeholder fails
                }}
              />
              <div className="movie-details">
                <h3>{item.movie_details?.title || "Untitled Movie"}</h3>
                <p>Release Date: {item.movie_details?.release_date || "N/A"}</p>
                <p>Your Rating: {item.rating || "N/A"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-collection">Your collection is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;