import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { markdownToHtml, styleMarkdownElements } from "@/utils/markdown";
import { formatDate } from "@/utils/formatters";
import { useBlogDetail } from "./hooks/useBlogDetail";
import LoadingSpinner from "../home/components/LoadingSpinner";
import AuthorBio from "./components/AuthorBio";
import CommentSection from "./components/CommentSection";
import RelatedArticles from "./components/RelatedArticles";
import SubscribeForm from "./components/SubscribeForm";

const BlogDetailPage: React.FC = () => {
  const {
    blog,
    comments,
    commentPagination,
    relatedArticles,
    profile,
    loading,
    error,
    loadingReplies,
    loadRepliesPage,
    replyPagination,
    postComment,
    postReply,
    fetchCommentsPage,
    loadRepliesForComment,
  } = useBlogDetail();

  const contentRef = useRef<HTMLDivElement>(null);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      styleMarkdownElements(contentRef.current);
    }
  }, [blog]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll to comment section when pagination changes
  useEffect(() => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [commentPagination]);

  if (loading) return <LoadingSpinner />;
  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-danger/10 border border-danger rounded-lg p-6 text-center">
          <i className="fa-solid fa-triangle-exclamation text-danger text-3xl mb-4"></i>
          <h3 className="text-xl font-bold text-danger mb-2">
            Failed to load blog post
          </h3>
          <p className="text-danger mb-4">{error || "Blog post not found"}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger-dark transition"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const readTime = Math.ceil(blog.content.split(/\s+/).length / 200);
  const excerpt = blog.excerpt || blog.content.substring(0, 120) + "...";

  return (
    <div className="blog-detail-page min-h-screen">
      {/* Hero Section - original gradient */}
      <div className="relative pt-16 pb-24 md:py-32 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                {blog.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Author & Date Info */}
            <div className="flex items-center justify-center mt-8">
              <div className="flex-shrink-0 mr-4">
                {blog.author?.image_url ? (
                  <img
                    src={blog.author.image_url}
                    alt={blog.author.name}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-white">
                  {blog.author?.name || "Anonymous"}
                </p>
                <div className="flex items-center text-white/80 text-sm">
                  <span className="mr-4">
                    {formatDate(blog.published_date || blog.created_at)}
                  </span>
                  <span className="mr-4">
                    <i className="fa-regular fa-clock mr-1"></i> {readTime} min read
                  </span>
                  <span>
                    <i className="fa-regular fa-eye mr-1"></i> {blog.views} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Featured Image (if exists) */}
      {blog.imageURL && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-20">
          <div className="rounded-xl shadow-xl overflow-hidden">
            <img
              src={blog.imageURL}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Blog Content - wider container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Excerpt */}
        <div className="bg-primary-light/20 border-l-4 border-primary p-6 rounded-lg mb-12">
          <p className="text-xl text-primary-text italic">{excerpt}</p>
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
            {blog.categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="px-4 py-2 bg-card-secondary text-secondary-text rounded-lg text-sm font-medium hover:bg-card-secondary/80"
              >
                #{cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex items-center border-t border-b border-color py-6 mb-12">
          <span className="text-secondary-text mr-4">Share:</span>
          <div className="flex space-x-4">
            <a
              data-share-twitter
              href={`https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              data-share-linkedin
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              data-share-github
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-900"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              data-share-youtube
              href="#"
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Author Bio */}
        <AuthorBio profile={profile} author={blog.author} />

        {/* Comments with pagination - with ref for scrolling */}
        <div ref={commentSectionRef}>
          <CommentSection
  comments={comments}
  blogId={blog.id}
  pagination={commentPagination}
  onPageChange={fetchCommentsPage}
  onPostComment={postComment}
  onPostReply={postReply}
  loadRepliesForComment={loadRepliesForComment}
  loadingReplies={loadingReplies}
  loadRepliesPage={loadRepliesPage}          // ✅ idagdag
  replyPagination={replyPagination}          // ✅ idagdag
/>
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Newsletter */}
        <SubscribeForm />
      </div>
    </div>
  );
};

export default BlogDetailPage;