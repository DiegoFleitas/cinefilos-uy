import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import MovieCard from '../MovieCard/MovieCard';
import styles from './Results.module.css';
import { Movie } from '../../types';

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

export default Results;
