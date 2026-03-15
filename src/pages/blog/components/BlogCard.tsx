import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '@/api/core/blog';
import { formatDate } from '@/utils/formatters';

interface Props {
  blog: Blog;
  featured?: boolean;
}

const BlogCard: React.FC<Props> = ({ blog, featured = false }) => {
  const cardClasses = `bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
    featured ? '' : 'md:flex'
  }`;

  if (featured) {
    return (
      <div className={cardClasses}>
        <div className="relative h-48">
          {blog.imageURL ? (
            <img src={blog.imageURL} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <div className="bg-card-secondary border-2 border-dashed w-full h-full"></div>
          )}
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-tertiary-text mb-3">
            <span className="mr-4">{formatDate(blog.publishDate)}</span>
            <span><i className="fa-regular fa-eye mr-1"></i> {blog.views} views</span>
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-3 line-clamp-2">{blog.title}</h3>
          <p className="text-secondary-text mb-4 line-clamp-3">{blog.summary}</p>
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium group"
          >
            Read more
            <i className="fa-solid fa-arrow-right ml-2 text-sm transition-transform group-hover:translate-x-1"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <div className="md:w-1/3">
        {blog.imageURL ? (
          <img src={blog.imageURL} alt={blog.title} className="w-full h-64 md:h-full object-cover" />
        ) : (
          <div className="bg-card-secondary border-2 border-dashed w-full h-64 md:h-full"></div>
        )}
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex items-center text-sm text-tertiary-text mb-3">
          <span className="mr-4">{formatDate(blog.publishDate)}</span>
          <span><i className="fa-regular fa-eye mr-1"></i> {blog.views} views</span>
        </div>
        <h3 className="text-xl font-bold text-primary-text mb-3 line-clamp-2">{blog.title}</h3>
        <p className="text-secondary-text mb-4 line-clamp-3">{blog.summary}</p>
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium group"
        >
          Read more
          <i className="fa-solid fa-arrow-right ml-2 text-sm transition-transform group-hover:translate-x-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;