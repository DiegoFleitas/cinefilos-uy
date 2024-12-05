import React, { useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { genres } from './constants';
import { Carousel } from 'react-responsive-carousel';
import { parseInput } from './utils/parseInput';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  genre_ids: number[];
  poster_path: string;
  release_date: string;
  runtime?: number;
}

const getGenreNames = (genreIds: number[]): string => {
  return genreIds
    .map((id) => genres.find((genre: Genre) => genre.id === id)?.name)
    .filter((name) => name)
    .join(', ');
};

const formatRuntime = (runtime?: number): string => {
  if (runtime === undefined) return 'N/A';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
};

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
        Genres: <em>{getGenreNames(movie.genre_ids)}</em>
      </p>
      <p className={styles.smallText}>
        Runtime: {formatRuntime(movie.runtime)}{' '}
        {movie.runtime && movie.runtime > 120 && '⏰⚠️🚨'}
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

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async () => {
    const movieTitles = parseInput(query);
    const detailedMovies: Movie[] = [];

    for (const title of Array.isArray(movieTitles)
      ? movieTitles
      : [movieTitles]) {
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await fetch(
          `/api/proxy/https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            title
          )}&page=${page}`
        );
        const data = await response.json();
        totalPages = data.total_pages;

        for (const movie of data.results) {
          const movieDetailsResponse = await fetch(
            `/api/proxy/https://api.themoviedb.org/3/movie/${movie.id}`
          );
          const movieDetails = await movieDetailsResponse.json();
          detailedMovies.push({ ...movie, runtime: movieDetails.runtime });
        }

        page++;
      }
    }

    setResults(detailedMovies);
  };

  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <div className={styles.paddingVertical}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.input}
            />
            <button className={styles.button} onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className={`${styles.results} ${styles['padding-vertical']}`}>
            <div className={styles.carouselContainer}>
              <Carousel className={styles.carousel}>
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </Carousel>
            </div>
          </div>
        </header>
      </div>
    </Router>
  );
};

export default App;
