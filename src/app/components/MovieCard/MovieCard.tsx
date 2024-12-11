import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { getGenreNames, formatRuntime, isMovieBlacklisted } from '../../utils';
import { Movie } from '../../types';

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <Card sx={{ maxWidth: 500, margin: 'auto' }}>
    <CardMedia
      component="img"
      image={
        movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : 'src/app/assets/default-poster.png'
      }
      alt={movie.title}
      sx={{ minWidth: 200, minHeight: 300 }}
    />
    <CardContent>
      <Typography variant="h5" component="div">
        {movie.title}
      </Typography>
      {!isNaN(new Date(movie.release_date).getFullYear()) && (
        <Typography variant="body2" color="text.secondary">
          ({new Date(movie.release_date).getFullYear()})
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        Generos: <em>{getGenreNames(movie.genre_ids)}</em>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Duracion: {formatRuntime(movie.runtime)}{' '}
        {movie.runtime && movie.runtime > 120 && '⏰⚠️🚨'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Eligibilidad:{' '}
        {isMovieBlacklisted(movie.id) ? '🎬🚫🔄 Ya la vimos!!' : '👌🎉👍'}
      </Typography>
      <Box sx={{ marginTop: '10px' }}>
        <a
          href={`https://www.themoviedb.org/movie/${movie.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fas fa-external-link-alt"></i>
        </a>
      </Box>
    </CardContent>
  </Card>
);

export default MovieCard;
