import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import styles from './SearchBar.module.css';

const SearchBar: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  isLoading: boolean;
}> = ({ query, setQuery, handleSearch, isLoading }) => (
  <Box
    sx={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      placeholder="nombra una pelicula y dale buscar..."
      className={styles.input}
      InputProps={{
        sx: {
          backgroundColor: 'white',
          color: 'black',
        },
      }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSearch}
      disabled={isLoading}
      className={styles.button}
      sx={{ marginTop: '20px', padding: '10px 20px' }}
    >
      {isLoading ? 'Buscando...' : 'Buscar'}
    </Button>
  </Box>
);

export default SearchBar;
