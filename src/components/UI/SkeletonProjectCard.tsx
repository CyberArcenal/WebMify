import React from 'react';

const SkeletonProjectCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex justify-between mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProjectCard;