// blog-detail.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class BlogDetailPage {
  constructor() {
    this.blogData = null;
    this.isLoading = true;
    this.slug = this.getSlugFromUrl();
  }

  getSlugFromUrl() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  }

  async init() {
    if (!this.slug) {
      this.handleError(new Error('Invalid blog slug'));
      return;
    }

    try {
      this.showLoadingState();
      await this.fetchBlogData();
      this.populateBlogData();
      this.updatePageMetadata();
      this.addAnimations();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    this.isLoading = true;
    document.getElementById('app').classList.add('opacity-75');
    const loader = document.getElementById('blog-loader');
    if (loader) loader.classList.remove('hidden');
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById('app').classList.remove('opacity-75');
    const loader = document.getElementById('blog-loader');
    if (loader) loader.classList.add('hidden');
  }

  async fetchBlogData() {
    try {
      const response = await apiClient.get(`/api/blog/${this.slug}/`);
      if (response.data) {
        this.blogData = response.data;
      } else {
        throw new Error('Blog data not found');
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
      throw new Error('Failed to load blog post');
    }
  }

  populateBlogData() {
    if (!this.blogData) return;

    // Featured image
    const featuredImg = document.getElementById('blog-featured-image');
    if (featuredImg && this.blogData.featured_image_url) {
      featuredImg.src = this.blogData.featured_image_url;
      featuredImg.alt = this.blogData.title;
      featuredImg.classList.remove('hidden');
    } else if (featuredImg) {
      featuredImg.classList.add('hidden');
    }

    // Title
    const titleEl = document.getElementById('blog-title');
    if (titleEl) titleEl.textContent = this.blogData.title;

    // Published date
    const dateEl = document.getElementById('blog-published-date');
    if (dateEl) {
      const date = new Date(this.blogData.published_date);
      dateEl.textContent = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      dateEl.dateTime = this.blogData.published_date;
    }

    // Content
    const contentEl = document.getElementById('blog-content');
    if (contentEl) contentEl.innerHTML = this.blogData.content;

    // View count
    const viewsEl = document.getElementById('blog-views');
    if (viewsEl) viewsEl.textContent = this.blogData.views.toLocaleString();

    // Status badge
    const statusEl = document.getElementById('blog-status');
    if (statusEl) {
      statusEl.textContent = this.blogData.status_display;
      statusEl.className = `px-3 py-1 rounded-full text-sm ${
        this.blogData.status === 'published' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`;
    }
  }

  updatePageMetadata() {
    // Update page title
    document.title = `${this.blogData.title} | My Portfolio Blog`;
    
    // Update Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.blogData.title;
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = this.blogData.excerpt;
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && this.blogData.featured_image_url) {
      ogImage.content = this.blogData.featured_image_url;
    }
  }

  addAnimations() {
    const blogElements = [
      document.getElementById('blog-featured-image'),
      document.getElementById('blog-header'),
      document.getElementById('blog-content')
    ];

    blogElements.forEach((el, index) => {
      if (el) {
        el.classList.add('opacity-0', 'translate-y-6');
        setTimeout(() => {
          el.classList.add('transition-all', 'duration-500', 'ease-out');
          el.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + (index * 150));
      }
    });
  }

  handleError(error) {
    console.error('BlogDetail error:', error);
    
    const errorContainer = document.getElementById('blog-error');
    const contentContainer = document.getElementById('blog-content-container');
    
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-800 mb-2">Failed to load blog post</h3>
          <p class="text-red-600 mb-4">${error.message || 'Please try again later'}</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            <i class="fa-solid fa-rotate-right mr-2"></i> Reload Page
          </button>
        </div>
      `;
      errorContainer.classList.remove('hidden');
    }
    
    if (contentContainer) {
      contentContainer.classList.add('hidden');
    }
  }
}

// Initialize the blog detail page
const blogDetailPage = new BlogDetailPage();
blogDetailPage.init();