import React from 'react';
import { ProjectGalleryImage } from '@/api/core/project';

interface Props {
  images: ProjectGalleryImage[];
}

const ProjectGallery: React.FC<Props> = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No gallery images available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {images.slice(0, 4).map((image, index) => (
        <div key={index} className="rounded-xl overflow-hidden h-64">
          <img
            src={image.image_url}
            alt={`Project gallery ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectGallery;