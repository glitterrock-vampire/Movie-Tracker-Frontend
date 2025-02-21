// src/components/MovieCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import MovieCard from './MovieCard';

function MovieCarousel({ title, movies }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,      // how many slides on large screens
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // below 1024px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,  // below 768px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,  // below 480px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {title && <h2 style={{ marginBottom: '1rem' }}>{title}</h2>}
      <Slider {...settings}>
        {movies.map(movie => (
          <div key={movie.tmdb_id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MovieCarousel;
