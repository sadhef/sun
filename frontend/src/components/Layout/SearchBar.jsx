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
    <div className="flex-grow flex justify-center">
      <div className="relative w-1/2 max-w-[500px]">
        <i className="fas fa-magnifying-glass absolute left-[15px] top-1/2 -translate-y-1/2 text-[#aaa]"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search across all pages..."
          className="w-full py-[10px] pr-5 pl-10 rounded-[20px] border border-[#e0e0e0] text-[14px]"
        />
        {searchTerm && (
          <span className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-[#aaa] text-[20px]" onClick={clearSearch}>
            &times;
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
