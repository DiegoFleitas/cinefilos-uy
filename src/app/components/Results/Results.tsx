import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import MovieCard from '../MovieCard/MovieCard';
import { Movie } from '../../types';
import { Box, Container } from '@mui/material';

const Results: React.FC<{ results: Movie[][] }> = ({ results }) => {
  const [carouselIndices, setCarouselIndices] = useState<number[]>([]);

  useEffect(() => {
    // Always set the first carousel index to 0 when results change
    setCarouselIndices((prevIndices) => {
      const newIndices = [0, ...prevIndices];
      return newIndices.slice(0, results.length);
    });
  }, [results]);

  const handleCarouselChange = (index: number, carouselIndex: number) => {
    setCarouselIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      newIndices[carouselIndex] = index;
      return newIndices;
    });
  };

  return (
    <Container sx={{ paddingY: 4 }}>
      {results.map((movies, carouselIndex) => (
        <Box key={carouselIndex} sx={{ marginBottom: 4 }}>
          <Carousel
            selectedItem={carouselIndices[carouselIndex]}
            onChange={(index) => handleCarouselChange(index, carouselIndex)}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Carousel>
        </Box>
      ))}
    </Container>
  );
};

export default Results;
