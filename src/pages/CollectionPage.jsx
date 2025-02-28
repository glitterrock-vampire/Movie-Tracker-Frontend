// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import "./MovieTracker.css"; // Ensure styling

// // Movie Card Component
// const MovieCard = ({ movie, onRemove }) => {
//   const navigate = useNavigate();
//   const [imageSrc, setImageSrc] = useState("");

//   useEffect(() => {
//     // Prefer poster_path, fallback to backdrop_path, then use reliable placeholder
//     const possiblePaths = [
//       movie.poster_path
//         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//         : null,
//       movie.backdrop_path
//         ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
//         : null,
//     ];

//     const validPath = possiblePaths.find((path) => path !== null);
//     setImageSrc(
//       validPath || "https://placehold.co/300x450?text=No+Image" // Reliable fallback
//     );
//   }, [movie]);

//   const handleMovieClick = () => {
//     navigate(`/movies/${movie.tmdb_id}`);
//   };

//   return (
//     <div className="movie-card">
//       <img
//         src={imageSrc}
//         alt={movie.title || "No title available"}
//         className="movie-card-image cursor-pointer"
//         onClick={handleMovieClick}
//         onError={(e) => {
//           e.target.src = "https://placehold.co/300x450?text=No+Image"; // Fallback if TMDB or placeholder fails
//         }}
//       />
//       {movie.vote_average && (
//         <div className="movie-rating">
//           <span className="mr-1">★</span>
//           {movie.vote_average.toFixed(1)}
//         </div>
//       )}
//       <div className="movie-card-overlay">
//         <h3>{movie.title || "Untitled Movie"}</h3>
//         <p>Release Date: {movie.release_date || "N/A"}</p>
//         <p>Your Rating: {movie.user_rating || "N/A"}</p>
//         <div className="movie-actions">
//           <button className="btn btn-watch">Watch</button>
//           <button className="btn btn-info" onClick={handleMovieClick}>
//             Info
//           </button>
//           <button
//             className="btn btn-remove"
//             onClick={() => onRemove(movie.tmdb_id)}
//             disabled={false}
//           >
//             ❌ Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CollectionPage = () => {
//   const [collection, setCollection] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const moviesPerPage = 12; // Adjust based on grid size

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCollection();
//   }, []); // Empty dependency array ensures it runs only once on mount

//   const fetchCollection = async () => {
//     try {
//       const response = await api.get("/api/collection/");
//       console.log("Collection data:", response.data); // Debugging log
//       const data = Array.isArray(response.data) ? response.data : [];
//       setCollection(data);
//     } catch (err) {
//       console.error("Error fetching collection:", err);
//       if (err.response && err.response.status === 401) {
//         setError("You need to log in to view your collection.");
//         window.location.href = "/login";
//       } else {
//         setError("Failed to load collection. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveMovie = async (tmdbId) => {
//     try {
//       await api.delete(`/collection/${tmdbId}/`);
//       setCollection((prevCollection) =>
//         prevCollection.filter(
//           (entry) => entry?.movie_details?.tmdb_id !== tmdbId
//         )
//       );
//       setError(null);
//     } catch (err) {
//       console.error("Error removing movie:", err);
//       setError("Failed to remove movie from collection. Please try again.");
//     }
//   };

//   const handleMovieClick = (tmdbId) => {
//     if (tmdbId) {
//       navigate(`/movies/${tmdbId}`);
//     } else {
//       console.warn("Invalid TMDB ID for movie click:", tmdbId);
//       setError("Unable to navigate to movie details due to invalid ID.");
//     }
//   };

//   const paginatedCollection = collection.slice(
//     (currentPage - 1) * moviesPerPage,
//     currentPage * moviesPerPage
//   );

//   const totalPages = Math.ceil(collection.length / moviesPerPage);

//   if (loading) {
//     return (
//       <div className="app-container flex justify-center items-center min-h-screen">
//         <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="app-container flex justify-center items-center min-h-screen">
//         <p className="error-message text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       <h2 className="section-title">My Movie Collection</h2>
//       {collection.length === 0 ? (
//         <p className="no-results">Your collection is empty.</p>
//       ) : (
//         <>
//           <div className="grid grid-cols-6 gap-6">
//             {paginatedCollection.map((entry) => {
//               if (!entry || !entry.movie_details) {
//                 console.warn("Skipping invalid entry in collection:", entry);
//                 return null;
//               }

//               const {
//                 id,
//                 tmdb_id,
//                 title,
//                 poster_path,
//                 release_date,
//                 user_rating,
//                 vote_average,
//                 backdrop_path,
//               } = entry.movie_details;

//               const uniqueKey = id || tmdb_id;

//               return (
//                 <MovieCard
//                   key={uniqueKey}
//                   movie={{
//                     id,
//                     tmdb_id,
//                     title,
//                     poster_path,
//                     backdrop_path,
//                     release_date,
//                     user_rating,
//                     vote_average,
//                   }}
//                   onRemove={handleRemoveMovie}
//                 />
//               );
//             })}
//           </div>
//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="pagination flex justify-center mt-4 space-x-2">
//               <button
//                 className="btn bg-gray-200 px-3 py-1 rounded"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   className={`btn px-3 py-1 rounded ${
//                     currentPage === index + 1 ? "bg-green-500 text-white" : "bg-gray-200"
//                   }`}
//                   onClick={() => setCurrentPage(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//               <button
//                 className="btn bg-gray-200 px-3 py-1 rounded"
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;