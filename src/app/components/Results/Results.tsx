import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import MovieCard from '../MovieCard/MovieCard';
import { Movie } from '../../types';
import { Box, Container } from '@mui/material';

const Results: React.FC<{ results: Movie[][] }> = ({ results }) => (
  <Container sx={{ paddingY: 4 }}>
    {results.map((movies, index) => (
      <Box key={index} sx={{ marginBottom: 4 }}>
        <Carousel>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Carousel>
      </Box>
    ))}
  </Container>
);

export default Results;
