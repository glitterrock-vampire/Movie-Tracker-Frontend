// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import MovieCarousel from "../components/MovieCarousel";

function Home() {
  const [nowShowing, setNowShowing] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both "now_showing" and "popular" in parallel
    Promise.all([
      api.get("/movies/now_showing/"), // Endpoint for Now Showing
      api.get("/movies/popular/"), // Endpoint for Popular
    ])
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

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <MovieCarousel title="Now Showing" movies={nowShowing} />
      <MovieCarousel title="Popular" movies={popular} />
    </div>
  );
}

export default Home;
