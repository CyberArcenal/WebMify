import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];           // Array of image URLs
  initialIndex?: number;       // Starting image index (default 0)
  showThumbnails?: boolean;    // Option to show thumbnail strip
  allowZoom?: boolean;         // Enable zoom on click/scroll (future enhancement)
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  showThumbnails = true,
  allowZoom = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // Reset index when modal opens with new images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      onClose();
    }, 200);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-200 ${
          isAnimatingOut ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close viewer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div
        className={`relative h-full w-full flex items-center justify-center transition-all duration-200 ${
          isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous button */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image container */}
        <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {showThumbnails && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/60 rounded-lg max-w-[90vw] overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewerModal;