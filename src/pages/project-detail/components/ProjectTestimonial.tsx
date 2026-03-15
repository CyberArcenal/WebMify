import React from 'react';
import { Project } from '@/api/core/project';

interface Props {
  testimonial: NonNullable<Project['testimonial']>;
}

const ProjectTestimonial: React.FC<Props> = ({ testimonial }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full p-4 mb-6">
          <i className="fa-solid fa-quote-right text-2xl"></i>
        </div>
        <p className="text-2xl text-gray-800 dark:text-white italic max-w-3xl mx-auto mb-6">
          "{testimonial.content}"
        </p>
        <div className="flex items-center justify-center">
          <div className="mr-4">
            {testimonial.author_image ? (
              <img
                src={testimonial.author_image}
                alt={testimonial.author}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16"></div>
            )}
          </div>
          <div className="text-left">
            <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.author}</h4>
            <p className="text-primary-500 dark:text-primary-400">{testimonial.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTestimonial;