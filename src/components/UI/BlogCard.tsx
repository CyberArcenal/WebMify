import React from 'react';
import { Blog } from '@/api/core/blog';

interface Props {
  blog: Blog;
  isFeatured?: boolean;
}

const BlogCard: React.FC<Props> = ({ blog, isFeatured = false }) => {
  if (isFeatured) {
    return (
      <div className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48">
          {blog.imageURL ? (
            <img
              src={blog.imageURL}
              alt={blog.title}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed w-full h-full"></div>
          )}
          {blog.featured && (
            <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-tertiary-text mb-3">
            <span className="mr-4">{blog.publishDate}</span>
            <span>
              <i className="fa-regular fa-eye mr-1"></i> {blog.views} views
            </span>
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-3">{blog.title}</h3>
          <p className="text-secondary-text mb-4">{blog.summary}</p>
          <a
            href={`/blog-detail/${blog.slug}`}
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            Read more
            <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:flex">
      <div className="md:w-1/3">
        {blog.imageURL ? (
          <img
            src={blog.imageURL}
            crossOrigin="anonymous"
            alt={blog.title}
            className="w-full h-64 md:h-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed w-full h-64 md:h-full"></div>
        )}
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex items-center text-sm text-tertiary-text mb-3">
          <span className="mr-4">{blog.publishDate}</span>
          <span>
            <i className="fa-regular fa-eye mr-1"></i> {blog.views} views
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary-text mb-3">{blog.title}</h3>
        <p className="text-secondary-text mb-4">{blog.summary}</p>
        <a
          href={`/blog-detail/${blog.slug}`}
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
        >
          Read more
          <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    </div>
  );
};

export default BlogCard;