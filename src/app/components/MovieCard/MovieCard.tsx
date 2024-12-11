import React from 'react';
import styles from './MovieCard.module.css';
import { getGenreNames, formatRuntime, isMovieBlacklisted } from '../../utils';
import { Movie } from '../../types';

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <div key={movie.id} className={styles.movie}>
    <img
      src={
        movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : 'src/app/default-poster.png'
      }
      alt={movie.title}
      className={styles['movie-img']}
      style={{ minWidth: '200px', minHeight: '300px' }}
    />
    <fieldset>
      <legend>{movie.title}</legend>
      {!isNaN(new Date(movie.release_date).getFullYear()) && (
        <p className={styles.smallText}>
          ({new Date(movie.release_date).getFullYear()})
        </p>
      )}
      <p className={styles.smallText}>
        Generos: <em>{getGenreNames(movie.genre_ids)}</em>
      </p>
      <p className={styles.smallText}>
        Duracion: {formatRuntime(movie.runtime)}{' '}
        {movie.runtime && movie.runtime > 120 && '⏰⚠️🚨'}
      </p>
      <p className={styles.smallText}>
        Eligibilidad:{' '}
        {isMovieBlacklisted(movie.id) ? '🎬🚫🔄 Ya la vimos!!' : '👌🎉👍'}
      </p>
      <a
        href={`https://www.themoviedb.org/movie/${movie.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['external-link']}
      >
        <i className="fas fa-external-link-alt"></i>
      </a>
    </fieldset>
  </div>
);

export default MovieCard;
