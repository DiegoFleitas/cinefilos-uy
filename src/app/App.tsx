import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import { genres } from './constants';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
  // Add other properties as needed
}

function App(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async () => {
    const response = await fetch(
      `/api/proxy/https://api.themoviedb.org/3/search/movie?query=${query}`
    );
    const data = await response.json();
    setResults(data.results);
  };

  const getGenreNames = (genreIds: number[]): string => {
    return genreIds
      .map((id) => genres.find((genre: Genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(', ');
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
          <div className={`${styles['results']} ${styles['padding-vertical']}`}>
            <Carousel className={styles.carousel}>
              {results.map((movie) => (
                <div key={movie.id} className={styles['movie']}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : 'src/app/default-poster.png'
                    }
                    alt={movie.title}
                    className={styles['movie-img']}
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
                  </fieldset>
                </div>
              ))}
            </Carousel>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
