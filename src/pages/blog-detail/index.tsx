import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { markdownToHtml, styleMarkdownElements } from '@/utils/markdown';
import { formatDate } from '@/utils/formatters';
import { useBlogDetail } from './hooks/useBlogDetail';
import LoadingSpinner from '../home/components/LoadingSpinner';
import AuthorBio from './components/AuthorBio';
import CommentSection from './components/CommentSection';
import RelatedArticles from './components/RelatedArticles';
import SubscribeForm from './components/SubscribeForm';

const BlogDetailPage: React.FC = () => {
  const { blog, comments, relatedArticles, profile, loading, error, postComment, postReply } = useBlogDetail();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      styleMarkdownElements(contentRef.current);
    }
  }, [blog]);

  if (loading) return <LoadingSpinner />;
  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
          <h3 className="text-xl font-bold text-red-800 mb-2">Failed to load blog post</h3>
          <p className="text-red-600 mb-4">{error || 'Blog post not found'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const readTime = Math.ceil(blog.content.split(/\s+/).length / 200);
  const excerpt = blog.excerpt || blog.content.substring(0, 120) + '...';

  return (
    <div className="blog-detail-page min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-16 pb-24 md:py-32 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                {blog.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Author & Date Info */}
            <div className="flex items-center justify-center mt-8">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 bg-cover bg-center"
                     style={blog.author?.image_url ? { backgroundImage: `url(${blog.author.image_url})` } : {}}></div>
              </div>
              <div className="text-left">
                <p className="font-medium text-white">{blog.author?.name || 'Anonymous'}</p>
                <div className="flex items-center text-white/80 text-sm">
                  <span className="mr-4">{formatDate(blog.published_date || blog.created_at)}</span>
                  <span className="mr-4"><i className="fa-regular fa-clock mr-1"></i> {readTime} min read</span>
                  <span><i className="fa-regular fa-eye mr-1"></i> {blog.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-20">
        <div className="rounded-2xl shadow-xl overflow-hidden">
          {blog.imageURL ? (
            <img src={blog.imageURL} alt={blog.title} className="w-full h-64 md:h-96 object-cover" />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed w-full h-64 md:h-96"></div>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Excerpt */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded-lg mb-12">
          <p className="text-xl text-blue-800 dark:text-blue-200 italic">{excerpt}</p>
        </div>

        {/* Article Content */}
        <article
          ref={contentRef}
          className="markdown-content prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content) }}
        />

        {/* Categories */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-12 mb-8">
            {blog.categories.map(cat => (
              <a key={cat.id} href={`#${cat.slug}`} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                #{cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex items-center border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-12">
          <span className="text-gray-700 dark:text-gray-300 mr-4">Share:</span>
          <div className="flex space-x-4">
            <a data-share-twitter href={`https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800">
              <i className="fab fa-twitter"></i>
            </a>
            <a data-share-linkedin href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a data-share-github href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-900">
              <i className="fab fa-github"></i>
            </a>
            <a data-share-youtube href="#" className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Author Bio */}
        <AuthorBio profile={profile} author={blog.author} />

        {/* Comments */}
        <CommentSection
          comments={comments}
          blogId={blog.id}
          onPostComment={postComment}
          onPostReply={postReply}
        />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Newsletter */}
        <SubscribeForm />
      </div>
    </div>
  );
};

export default BlogDetailPage;