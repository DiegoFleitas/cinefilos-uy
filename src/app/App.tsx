import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { parseInput } from './utils';
import SearchBar from './components/SearchBar/SearchBar';
import Results from './components/Results/Results';
import { Movie } from './types';
import {
  Container,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [googleSearchLink, setGoogleSearchLink] = useState<string>('');

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
          setGoogleSearchLink(
            `https://www.google.com/search?q=${encodeURIComponent(title)}`
          );
          setShowNotification(true);
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

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleOpenGoogle = () => {
    window.open(googleSearchLink, '_blank');
    setShowNotification(false);
  };

  return (
    <Router>
      <Container sx={{ width: '100%', padding: 0 }}>
        <Box
          sx={{
            backgroundColor: '#282c34',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            padding: '20px 0',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              marginBottom: '20px',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
            }}
          >
            Peli OK?
          </Typography>
          <Box sx={{ width: '100%', maxWidth: '600px' }}>
            <SearchBar
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              isLoading={isLoading}
            />
            <Results results={results} />
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="info"
          sx={{ width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={handleOpenGoogle}>
              Buscar en Google
            </Button>
          }
        >
          <Box>
            <Typography>
              No se encontraron resultados para "{query}".
            </Typography>
            <Typography variant="caption">
              (Las búsquedas son más efectivas con el título original)
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Router>
  );
};

export default App;
