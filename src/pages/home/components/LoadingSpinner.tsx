import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;