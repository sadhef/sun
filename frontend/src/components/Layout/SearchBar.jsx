import { useState, useEffect, useCallback } from 'react';
import useAppStore from '../../store/useAppStore';
import { debounce } from '../../utils/helpers';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setGlobalSearch } = useAppStore();

  const debouncedSearch = useCallback(
    debounce((value) => {
      setGlobalSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    setGlobalSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <i className="fas fa-magnifying-glass"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search across all pages..."
        />
        {searchTerm && (
          <span className="search-clear-btn" onClick={clearSearch}>
            &times;
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
