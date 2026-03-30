import { Category } from '@/api/core/category';
import React from 'react';

interface FilterButtonsProps {
  categories: Category[];
  currentFilter: number;
  onFilterChange: (filter: number) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ categories, currentFilter, onFilterChange }) => {
  return (
    <div className="inline-flex bg-card rounded-lg shadow p-1">
      <select
        value={currentFilter ?? ""}
        onChange={(e) => onFilterChange(Number(e.target.value))}
        className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-card-secondary text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All</option>
        {categories.map((filter) => (
          <option key={filter.id} value={filter.id}>
            {filter.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterButtons;
