import React from 'react';

interface Props {
  featured?: boolean;
}

const SkeletonBlogCard: React.FC<Props> = ({ featured = false }) => {
  if (featured) {
    return (
      <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="relative h-48 bg-card-secondary"></div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-4 w-24 bg-card-secondary rounded"></div>
            <div className="h-4 w-16 bg-card-secondary rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-card-secondary rounded mb-3"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-card-secondary rounded"></div>
            <div className="h-4 w-5/6 bg-card-secondary rounded"></div>
            <div className="h-4 w-4/6 bg-card-secondary rounded"></div>
          </div>
          <div className="h-5 w-24 bg-card-secondary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse md:flex">
      <div className="md:w-1/3">
        <div className="h-64 md:h-full bg-card-secondary"></div>
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-4 w-24 bg-card-secondary rounded"></div>
          <div className="h-4 w-16 bg-card-secondary rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-card-secondary rounded mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-card-secondary rounded"></div>
          <div className="h-4 w-5/6 bg-card-secondary rounded"></div>
          <div className="h-4 w-4/6 bg-card-secondary rounded"></div>
        </div>
        <div className="h-5 w-24 bg-card-secondary rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonBlogCard;