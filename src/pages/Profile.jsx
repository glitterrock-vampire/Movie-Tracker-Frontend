import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css"; // Ensure this CSS file exists for animations

function Profile() {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false); // ✅ State for alert animation

  useEffect(() => {
    api.get("/collection/")
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {
        setError("Failed to load collection. Are you logged in?");
        console.error(err);
      });
  }, []);

  // ✅ Function to simulate the alert message when a movie is added
  const handleMovieAdded = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="profile-container">
      <h2>My Collection</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      {/* ✅ Animated Alert */}
      {showAlert && <div className="alert-box">Movie added to your collection! 🎉</div>}

      <div className="movie-grid">
        {collection.length > 0 ? (
          collection.map((item) => (
            <div key={item.id} className="movie-card">
              <img
                src={
                  item.movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.movie.poster_path}`
                    : "https://via.placeholder.com/150x225?text=No+Image"
                }
                alt={item.movie.title}
                className="movie-poster"
              />
              <div className="movie-details">
                <h3>{item.movie.title}</h3>
                <p>Release Date: {item.movie.release_date || "N/A"}</p>
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
