import React from 'react';

interface FilterButtonsProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web Apps' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'open-source', label: 'Open Source' },
  ];

  return (
    <div className="inline-flex bg-card rounded-lg shadow p-1">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={(e) => { e.stopPropagation(); onFilterChange(filter.value); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            currentFilter === filter.value
              ? 'bg-primary text-white'
              : 'text-secondary-text hover:bg-card-secondary'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;