import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '@/api/core/blog';
import { formatDate } from '@/utils/formatters';

interface Props {
  articles: Blog[];
}

const RelatedArticles: React.FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-primary-text mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map(article => {
          const readTime = Math.ceil(article.content.split(/\s+/).length / 200);
          return (
            <div key={article.id} className="bg-card rounded-xl shadow overflow-hidden transition-transform hover:-translate-y-2">
              <div className="h-48 bg-card-secondary">
                {article.imageURL ? (
                  <img src={article.imageURL} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-color"></div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-tertiary-text mb-3">
                  <span className="mr-4">{formatDate(article.publishDate)}</span>
                  <span><i className="fa-regular fa-clock mr-1"></i> {readTime} min read</span>
                </div>
                <h4 className="text-xl font-bold text-primary-text mb-3">{article.title}</h4>
                <p className="text-secondary-text mb-4">
                  {article.excerpt || article.content.substring(0, 100) + '...'}
                </p>
                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                >
                  Read more
                  <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedArticles;