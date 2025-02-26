// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import "./MovieTracker.css";

// const LazyRecommendations = ({ movieCardComponent: MovieCard }) => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     try {
//       const response = await api.get("/api/recommendations/"); // Fixed typo
//       if (response.status === 200) {
//         setRecommendations(response.data.results || []); // Use .results based on your Home.js
//       } else {
//         throw new Error(`Unexpected response: ${response.status}`);
//       }
//     } catch (err) {
//       console.error("Error fetching recommendations:", err.response || err);
//       setError(err.response?.data?.error || "Failed to load recommendations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-5 gap-6">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <div key={index} className="movie-card skeleton"></div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="error-message text-red-500">{error}</p>;
//   }

//   return (
//     <div className="grid grid-cols-5 gap-6">
//       {recommendations.length === 0 ? (
//         <p className="no-results">No recommendations available.</p>
//       ) : (
//         recommendations.slice(0, 5).map((rec) => (
//           <MovieCard
//             key={rec.id || rec.tmdb_id || rec.title} // Fallback to title if no ID
//             movie={{
//               id: rec.id,
//               tmdb_id: rec.tmdb_id,
//               title: rec.title,
//               poster_path: rec.poster_path,
//               vote_average: rec.vote_average,
//               release_date: rec.release_date,
//               backdrop_path: rec.backdrop_path, // Include if available
//             }}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default LazyRecommendations;