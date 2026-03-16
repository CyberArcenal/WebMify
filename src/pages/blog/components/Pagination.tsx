import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-16 flex items-center justify-between border-t border-border-color pt-8">
      <div>
        <p className="text-sm text-secondary-text">
          Showing <span className="font-medium text-primary-text">{currentPage}</span> to{' '}
          <span className="font-medium text-primary-text">{totalPages}</span> of{' '}
          <span className="font-medium text-primary-text">{totalPages}</span> articles
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-prev px-4 py-2 bg-card border border-border-color rounded-lg text-secondary-text font-medium shadow hover:bg-card-secondary disabled:opacity-50 transition-colors"
        >
          <i className="fa-solid fa-chevron-left mr-2"></i> Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-next px-4 py-2 bg-primary text-white rounded-lg font-medium shadow hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          Next <i className="fa-solid fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;