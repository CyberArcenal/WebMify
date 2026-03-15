import React from 'react';

const SkeletonProfile: React.FC = () => (
  <div className="w-full md:w-3/5 text-center md:text-left">
    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
    <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded w-full mb-8 animate-pulse"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
    </div>
    <div className="flex justify-center md:justify-start gap-4">
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
    </div>
    <div className="flex justify-center md:justify-start gap-4 mt-8">
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
    </div>
  </div>
);

export default SkeletonProfile;