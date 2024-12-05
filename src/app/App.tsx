import React, { useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { genres, blacklist } from './constants';
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

const isMovieBlacklisted = (movieId: number): boolean => {
  return blacklist.some((item) => item.tmdbID === movieId);
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

const SearchBar: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  isLoading: boolean;
}> = ({ query, setQuery, handleSearch, isLoading }) => (
  <div className={styles.paddingVertical}>
    <textarea
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={styles.input}
    />
    <button
      className={styles.button}
      onClick={handleSearch}
      disabled={isLoading}
    >
      {isLoading ? 'Buscando...' : 'Buscar'}
    </button>
  </div>
);

const Results: React.FC<{ results: Movie[][] }> = ({ results }) => (
  <div className={`${styles.results} ${styles['padding-vertical']}`}>
    {results.map((movies, index) => (
      <div key={index} className={styles.carouselContainer}>
        <Carousel className={styles.carousel}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Carousel>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const MAX_MOVIES = 15;

  const handleSearch = async () => {
    setIsLoading(true);
    const movieTitles = parseInput(query);
    const detailedMovies: Movie[] = [];

    const fetchMovieDetails = async (movieId: number) => {
      const response = await fetch(
        `/api/proxy/https://api.themoviedb.org/3/movie/${movieId}`
      );
      return response.json();
    };

    const fetchMovies = async (title: string) => {
      let page = 1;
      let totalPages = 1;
      const movies: Movie[] = [];

      while (page <= totalPages && movies.length < MAX_MOVIES) {
        const response = await fetch(
          `/api/proxy/https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            title
          )}&page=${page}`
        );
        const data = await response.json();
        totalPages = data.total_pages;

        if (data.results.length === 0) {
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(title)}`,
            '_blank'
          );
          setIsLoading(false);
          return [];
        }

        movies.push(...data.results);
        page++;
      }

      return movies.slice(0, MAX_MOVIES);
    };

    const movieTitlesArray = Array.isArray(movieTitles)
      ? movieTitles
      : [movieTitles];
    const moviePromises = movieTitlesArray.map((title) => fetchMovies(title));
    const moviesArray = await Promise.all(moviePromises);

    const allMovies = moviesArray.flat().slice(0, MAX_MOVIES);
    const movieDetailsPromises = allMovies.map((movie) =>
      fetchMovieDetails(movie.id)
    );
    const movieDetailsArray = await Promise.all(movieDetailsPromises);

    movieDetailsArray.forEach((details, index) => {
      detailedMovies.push({ ...allMovies[index], runtime: details.runtime });
    });

    setResults((prevResults) => [detailedMovies, ...prevResults]);
    setIsLoading(false);
  };

  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />
          <Results results={results} />
        </header>
      </div>
    </Router>
  );
};

export default App;
