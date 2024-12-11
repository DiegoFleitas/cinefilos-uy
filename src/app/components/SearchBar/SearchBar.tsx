import React from 'react';
import styles from './SearchBar.module.css';

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

export default SearchBar;
