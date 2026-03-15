import React from "react";
import { useBlog } from "./hooks/useBlog";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";
import BlogCard from "./components/BlogCard";
import SkeletonBlogCard from "@/components/UI/SkeletonBlogCard";
import Pagination from "@/components/UI/Pagination";
import BlogSidebar from "./components/BlogSidebar";
import SubscribeForm from "./components/SubscribeForm";

const BlogPage: React.FC = () => {
  const {
    blogs,
    popular,
    categories,
    pagination,
    loading,
    error,
    currentCategory,
    setCurrentCategory,
    setSearchTerm,
    handlePageChange,
  } = useBlog();

  const featuredBlogs = blogs.filter((b) => b.featured);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-danger/10 border border-danger rounded-lg p-4 text-center">
          <i className="fa-solid fa-triangle-exclamation text-danger text-xl mr-2"></i>
          <span className="text-danger">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page min-h-screen">
      {/* Page Header - unchanged */}
      <div className="relative py-24 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Blog
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on web development, design, and
              technology
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/60"></div>
      </div>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            {/* Filters - always visible */}
            <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
              <CategoryFilter
                categories={categories}
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
              />
              <SearchBar onSearch={setSearchTerm} />
            </div>

            {/* Featured Posts Section with Skeleton */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <i className="fa-solid fa-star text-warning mr-2"></i>
                Featured Articles
              </h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonBlogCard key={i} featured />
                  ))}
                </div>
              ) : featuredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} featured />
                  ))}
                </div>
              ) : null}
            </div>

            {/* All Posts Section */}
            <div>
              <h2 className="text-2xl font-bold text-primary-text mb-6">
                All Articles
              </h2>
              {loading ? (
                <div className="space-y-10">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonBlogCard key={i} />
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-secondary-text">
                    No blog posts found. Try a different search or category.
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && pagination.total_pages > 1 && (
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Sidebar */}
          <BlogSidebar
            popular={popular}
            categories={categories}
            onCategoryClick={setCurrentCategory}
          />
        </div>
      </div>

      {/* Newsletter Section - unchanged */}
      <div className="bg-card-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full p-3 mb-6">
            <i className="fa-solid fa-envelope-open-text text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-secondary-text max-w-2xl mx-auto mb-8">
            Subscribe to my newsletter to receive the latest articles and
            updates directly in your inbox.
          </p>
          <div className="max-w-xl mx-auto">
            <SubscribeForm />
            <p className="text-sm text-tertiary-text mt-3">
              No spam, just valuable content. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;