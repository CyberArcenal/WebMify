import React from 'react';
import { ProjectGalleryImage } from '@/api/core/project';

interface Props {
  images: ProjectGalleryImage[];
  onImageClick?: (index: number) => void;
}

const ProjectGallery: React.FC<Props> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-secondary-text">
        No gallery images available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden h-64 cursor-pointer group"
          onClick={() => onImageClick?.(index)}
        >
          <img
            src={image.image_url}
            alt={`Project gallery ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectGallery;