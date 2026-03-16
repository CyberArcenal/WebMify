import React, { useState, useEffect } from 'react';

interface Props {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(term);
    }, 300);
    return () => clearTimeout(timeout);
  }, [term, onSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i className="fa-solid fa-magnifying-glass text-tertiary-text"></i>
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full md:w-64 bg-card border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-text placeholder-tertiary-text"
        placeholder="Search articles..."
      />
    </div>
  );
};

export default SearchBar;