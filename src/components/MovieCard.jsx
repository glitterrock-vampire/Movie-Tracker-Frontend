// src/components/MovieCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 0.5rem 1rem;  /* some spacing */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Poster = styled.img`
  width: 100%;
  height: auto;  /* maintain aspect ratio */
  display: block;
`;

const Info = styled.div`
  padding: 0.5rem;
  h3 {
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }
  p {
    margin: 0;
    color: #555;
  }
`;

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'; // fallback if no poster

  return (
    <Card>
      <Link to={`/movies/${movie.tmdb_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Poster src={posterUrl} alt={movie.title} />
        <Info>
          <h3>{movie.title}</h3>
          <p>⭐ {movie.vote_average || 'N/A'}</p>
        </Info>
      </Link>
    </Card>
  );
}

export default MovieCard;
