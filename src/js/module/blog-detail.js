import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class BlogDetailPage {
  constructor() {
    this.blogData = null;
    this.isLoading = true;
    this.blogSlug = this.getBlogSlugFromUrl();
  }

  getBlogSlugFromUrl() {
    const hash = window.location.hash;
    if (hash.startsWith('#blog-detail/')) {
      return hash.split('/').pop();
    }
    return null;
  }

  async init() {
    if (!this.blogSlug) {
      this.handleError(new Error('Invalid blog slug'));
      return;
    }

    try {
      this.showLoadingState();
      await this.fetchBlogData();
      this.renderBlogDetails();
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
      const response = await apiClient.get(`/api/blog/${this.blogSlug}/`);
      if (response.data) {
        this.blogData = response.data;
        // Calculate read time based on word count
        const wordCount = this.blogData.content.split(/\s+/).length;
        this.blogData.readTime = Math.ceil(wordCount / 200); // 200 wpm reading speed
      } else {
        throw new Error('Blog data not found');
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
      throw new Error('Failed to load blog details');
    }
  }

  renderBlogDetails() {
    if (!this.blogData) return;

    // Update hero section
    const statusBadge = document.getElementById('blog-status');
    if (statusBadge) {
      statusBadge.textContent = this.blogData.status === 'published' 
        ? 'Published' 
        : 'Draft';
    }

    const titleEl = document.getElementById('blog-title');
    if (titleEl) titleEl.textContent = this.blogData.title;

    const heroDesc = document.getElementById('blog-hero-description');
    if (heroDesc) heroDesc.textContent = this.blogData.excerpt || this.blogData.content.substring(0, 150) + '...';

    // Update featured image
    const featuredImg = document.getElementById('blog-featured-image');
    if (featuredImg) {
      if (this.blogData.featured_image_url) {
        featuredImg.src = this.blogData.featured_image_url;
        featuredImg.classList.remove('hidden');
        featuredImg.alt = this.blogData.title;
        // Hide placeholder
        const placeholder = featuredImg.previousElementSibling;
        if (placeholder && placeholder.classList.contains('bg-gray-200')) {
          placeholder.classList.add('hidden');
        }
      }
    }

    // Update date and views
    const publishedDate = document.getElementById('blog-published-date');
    if (publishedDate) {
      publishedDate.textContent = this.formatDate(this.blogData.published_date || this.blogData.created_at);
    }

    const viewsEl = document.getElementById('blog-views');
    if (viewsEl) {
      viewsEl.innerHTML = `<i class="fa-regular fa-eye mr-1"></i> ${this.blogData.views} views`;
    }

    // Update read time
    const readTimeEl = document.querySelector('.fa-clock').parentNode;
    if (readTimeEl) {
      readTimeEl.innerHTML = `<i class="fa-regular fa-clock mr-1"></i> ${this.blogData.readTime} min read`;
    }

    // Update excerpt section
    const excerptContainer = document.querySelector('.bg-blue-50 p');
    if (excerptContainer) {
      excerptContainer.textContent = this.blogData.excerpt || 
        `"${this.blogData.content.substring(0, 120)}..."`;
    }

    // Update main content
    const contentContainer = document.getElementById('blog-content');
    if (contentContainer) {
      contentContainer.innerHTML = this.blogData.content;
    }

    // Update tags (if implemented in backend)
    if (this.blogData.tags && this.blogData.tags.length > 0) {
      const tagsContainer = document.querySelector('.flex.flex-wrap.gap-3.mt-12.mb-8');
      if (tagsContainer) {
        tagsContainer.innerHTML = '';
        this.blogData.tags.forEach(tag => {
          const tagEl = document.createElement('a');
          tagEl.href = '#';
          tagEl.className = 'px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700';
          tagEl.textContent = `#${tag}`;
          tagsContainer.appendChild(tagEl);
        });
      }
    }

    // Update author info (if implemented in backend)
    if (this.blogData.author) {
      const authorName = document.querySelector('.author-bio .text-xl');
      if (authorName) authorName.textContent = this.blogData.author.name;
      
      const authorBio = document.querySelector('.author-bio p');
      if (authorBio) authorBio.textContent = this.blogData.author.bio;
      
      const authorImg = document.querySelector('.author-bio .bg-gray-200');
      if (authorImg && this.blogData.author.image_url) {
        authorImg.style.backgroundImage = `url(${this.blogData.author.image_url})`;
        authorImg.classList.add('bg-cover', 'bg-center');
      }
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  updatePageMetadata() {
    // Update page title
    document.title = `${this.blogData.title} | Blog`;
    
    // Update Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.blogData.title;
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = this.blogData.excerpt || this.blogData.content.substring(0, 150);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && this.blogData.featured_image_url) {
      ogImage.content = this.blogData.featured_image_url;
    }
  }

  addAnimations() {
    const elementsToAnimate = [
      document.getElementById('blog-hero-section'),
      document.getElementById('blog-featured-image'),
      document.getElementById('blog-content-container'),
      document.querySelector('.author-bio')
    ];

    elementsToAnimate.forEach((el, index) => {
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