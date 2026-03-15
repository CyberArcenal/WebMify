import React from 'react';

const SkeletonSkills: React.FC = () => (
  <div className="skills-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 mb-4 shimmer"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2 shimmer"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12 shimmer"></div>
        <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-2 shimmer"></div>
      </div>
    ))}
  </div>
);

export default SkeletonSkills;