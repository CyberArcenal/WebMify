import React from 'react';

interface Props {
  categories: { name: string }[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, currentCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 category-button-container">
      <button
        onClick={() => onCategoryChange('All')}
        className={`px-4 py-2 rounded-lg font-medium shadow transition-colors ${
          currentCategory === 'All'
            ? 'bg-primary text-white'
            : 'bg-card text-secondary-text hover:bg-card-secondary'
        }`}
      >
        All Posts
      </button>
      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onCategoryChange(cat.name)}
          className={`px-4 py-2 rounded-lg font-medium shadow transition-colors ${
            currentCategory === cat.name
              ? 'bg-primary text-white'
              : 'bg-card text-secondary-text hover:bg-card-secondary'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;