import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '@/api/core/blog';
import { Category } from '@/api/core/category';
import SubscribeForm from './SubscribeForm';

interface Props {
  popular: Blog[];
  categories: Category[];
  onCategoryClick: (category: string) => void;
}

const BlogSidebar: React.FC<Props> = ({ popular, categories, onCategoryClick }) => {
  return (
    <div className="w-full lg:w-4/12">
      {/* About Card */}
      <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-primary-text mb-4">About the Blog</h3>
        <p className="text-secondary-text mb-4">
          Welcome to my development blog where I share insights, tutorials, and experiences from my journey as a full-stack developer.
        </p>
        <p className="text-secondary-text">Subscribe to get notified when new articles are published.</p>
        <div className="mt-6">
          <SubscribeForm />
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-primary-text mb-4">Popular Articles</h3>
        {popular?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-tertiary-text">No popular articles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {popular?.map(article => (
              <Link key={article.id} to={`/blog/${article.slug}`} className="flex items-start group">
                <div className="flex-shrink-0 mr-4">
                  {article.imageURL ? (
                    <img src={article.imageURL} alt={article.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="bg-card-secondary border-2 border-dashed rounded-lg w-16 h-16"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-primary-text group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-tertiary-text">{article.publishDate}</p>
                  <div className="flex items-center mt-1 text-xs text-tertiary-text">
                    <i className="fa-regular fa-eye mr-1"></i> {article.views} views
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-primary-text mb-4">Categories</h3>
        {categories.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-tertiary-text">No categories found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.name)}
                className="flex justify-between items-center py-2 w-full text-left border-b border-border-color last:border-0 group"
              >
                <span className="text-secondary-text group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <span className="bg-card-secondary text-tertiary-text text-xs font-medium px-2 py-1 rounded-full">
                  {category.count || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSidebar;