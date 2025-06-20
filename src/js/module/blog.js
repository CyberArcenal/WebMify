// blog.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class BlogPage {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.blogPosts = [];
    this.featuredPosts = [];
    this.popularPosts = [];
    this.categories = [];
    this.pagination = {
      currentPage: 1,
      pageSize: 5,
      totalPages: 1,
      totalItems: 0
    };
    this.isLoading = true;
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchBlogPosts();
      this.renderBlogPosts();
      this.setupEventListeners();
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
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById('app').classList.remove('opacity-75');
  }

  async fetchBlogPosts() {
    try {
      const params = {
        featured: true,
        page: this.pagination.currentPage,
        page_size: this.pagination.pageSize
      };

      const response = await apiClient.get('/api/blog/', { params });
      
      if (response.data?.status) {
        this.blogPosts = response.data.data || [];
        this.pagination = {
          currentPage: response.data.pagination?.current_page || 1,
          pageSize: response.data.pagination?.page_size || 5,
          totalPages: response.data.pagination?.total_pages || 1,
          totalItems: response.data.pagination?.count || 0
        };
        
        // Extract featured posts (first 2)
        this.featuredPosts = this.blogPosts.slice(0, 2);
        
        // For demo purposes, popular posts are the most viewed
        this.popularPosts = [...this.blogPosts]
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);
        
        // Mock categories for demo
        this.categories = [
          { name: "Web Development", count: 12 },
          { name: "JavaScript", count: 8 },
          { name: "UI/UX Design", count: 5 },
          { name: "Career Advice", count: 3 },
          { name: "Performance", count: 7 }
        ];
      } else {
        throw new Error('Invalid blog data');
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
      throw new Error('Failed to load blog posts');
    }
  }

  renderBlogPosts() {
    // Render featured posts
    this.renderFeaturedPosts();
    
    // Render all blog posts
    this.renderAllPosts();
    
    // Render popular posts
    this.renderPopularPosts();
    
    // Render categories
    this.renderCategories();
    
    // Update pagination
    this.updatePagination();
  }

  renderFeaturedPosts() {
    const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-8');
    if (!container || !this.featuredPosts.length) return;

    container.innerHTML = '';

    this.featuredPosts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl';
      
      postEl.innerHTML = `
        <div class="relative h-48">
          ${post.featured_image_url ? 
            `<img src="${post.featured_image_url}" alt="${post.title}" class="w-full h-full object-cover">` : 
            `<div class="bg-gray-200 border-2 border-dashed w-full h-full"></div>`
          }
          <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span class="mr-4">${new Date(post.published_date).toLocaleDateString()}</span>
            <span><i class="fa-regular fa-eye mr-1"></i> ${post.views} views</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${post.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${post.excerpt}</p>
          <a href="#blog/${post.slug}" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            Read more
            <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      `;
      
      container.appendChild(postEl);
    });
  }

  renderAllPosts() {
    const container = document.querySelector('.space-y-10');
    if (!container || !this.blogPosts.length) return;

    // Clear existing static content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this.blogPosts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:flex';
      
      postEl.innerHTML = `
        <div class="md:w-1/3">
          ${post.featured_image_url ? 
            `<img src="${post.featured_image_url}" alt="${post.title}" class="w-full h-64 md:h-full object-cover">` : 
            `<div class="bg-gray-200 border-2 border-dashed w-full h-64 md:h-full"></div>`
          }
        </div>
        <div class="p-6 md:w-2/3">
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span class="mr-4">${new Date(post.published_date).toLocaleDateString()}</span>
            <span><i class="fa-regular fa-eye mr-1"></i> ${post.views} views</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${post.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${post.excerpt}</p>
          <a href="#blog/${post.slug}" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            Read more
            <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      `;
      
      container.appendChild(postEl);
    });
  }

  renderPopularPosts() {
    const container = document.querySelector('.space-y-4');
    if (!container || !this.popularPosts.length) return;

    // Clear existing static content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this.popularPosts.forEach(post => {
      const postEl = document.createElement('a');
      postEl.href = `#blog/${post.slug}`;
      postEl.className = 'flex items-start group';
      
      postEl.innerHTML = `
        <div class="flex-shrink-0 mr-4">
          ${post.featured_image_url ? 
            `<img src="${post.featured_image_url}" alt="${post.title}" class="w-16 h-16 object-cover rounded-lg">` : 
            `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
          }
        </div>
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">${post.title}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${new Date(post.published_date).toLocaleDateString()}</p>
        </div>
      `;
      
      container.appendChild(postEl);
    });
  }

  renderCategories() {
    const container = document.querySelector('.space-y-2');
    if (!container || !this.categories.length) return;

    // Clear existing static content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this.categories.forEach(category => {
      const categoryEl = document.createElement('a');
      categoryEl.href = '#';
      categoryEl.className = 'flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 group';
      
      categoryEl.innerHTML = `
        <span class="text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400">${category.name}</span>
        <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded-full">${category.count}</span>
      `;
      
      container.appendChild(categoryEl);
    });
  }

  updatePagination() {
    const start = (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
    const end = Math.min(this.pagination.currentPage * this.pagination.pageSize, this.pagination.totalItems);
    
    const paginationInfo = document.querySelector('.text-sm.text-gray-700.dark\\:text-gray-300');
    if (paginationInfo) {
      paginationInfo.innerHTML = `
        Showing <span class="font-medium">${start}</span> to <span class="font-medium">${end}</span> 
        of <span class="font-medium">${this.pagination.totalItems}</span> articles
      `;
    }
    
    const prevButton = document.querySelector('.prevbtn');
    const nextButton = document.querySelector('.nextbtn');
    
    if (prevButton) {
      prevButton.disabled = this.pagination.currentPage === 1;
      if (this.pagination.currentPage === 1) {
        prevButton.classList.add('disabled:opacity-50', 'cursor-not-allowed');
      } else {
        prevButton.classList.remove('disabled:opacity-50', 'cursor-not-allowed');
      }
    }
    
    if (nextButton) {
      nextButton.disabled = this.pagination.currentPage === this.pagination.totalPages;
      if (this.pagination.currentPage === this.pagination.totalPages) {
        nextButton.classList.add('disabled:opacity-50', 'cursor-not-allowed');
      } else {
        nextButton.classList.remove('disabled:opacity-50', 'cursor-not-allowed');
      }
    }
  }

  setupEventListeners() {
    // Pagination buttons
    const prevButton = document.querySelector('.prevbtn');
    const nextButton = document.querySelector('.nextbtn');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (this.pagination.currentPage > 1) {
          this.pagination.currentPage--;
          this.reloadPosts();
        }
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (this.pagination.currentPage < this.pagination.totalPages) {
          this.pagination.currentPage++;
          this.reloadPosts();
        }
      });
    }
    
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.bg-white.dark\\:bg-gray-800');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        filterButtons.forEach(btn => {
          btn.classList.remove('bg-primary-500', 'text-white');
          btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        });
        
        // Add active class to clicked button
        button.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-primary-500', 'text-white');
        
        // In a real app, we would fetch filtered posts here
        // For now, just show a loading state
        this.showLoadingState();
        setTimeout(() => {
          this.hideLoadingState();
        }, 500);
      });
    });
    
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (searchInput.value.trim()) {
            // In a real app, we would fetch search results
            // For now, show loading state
            this.showLoadingState();
            setTimeout(() => {
              this.hideLoadingState();
            }, 500);
          }
        }, 500);
      });
    }
    
    // Newsletter subscription
    const subscribeButtons = document.querySelectorAll('.bg-primary-500.text-white');
    subscribeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const emailInput = button.previousElementSibling;
        
        if (emailInput && emailInput.value) {
          // In a real app, we would send the email to the server
          showError('Subscription functionality would be implemented in a real app');
        } else {
          showError('Please enter your email address');
        }
      });
    });
  }

  async reloadPosts() {
    try {
      this.showLoadingState();
      await this.fetchBlogPosts();
      this.renderBlogPosts();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  addAnimations() {
    document.querySelectorAll('.blog-page > div')
      .forEach((section, index) => {
        section.classList.add('opacity-0', 'translate-y-6');
        setTimeout(() => {
          section.classList.add('transition-all', 'duration-500', 'ease-out');
          section.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + (index * 150));
      });
  }

  handleError(error) {
    console.error('Blog page error:', error);
    showError('Failed to load blog content');

    // Show error notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center';
    notification.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      <span>Failed to load blog posts. Please refresh the page.</span>
      <button class="ml-4 text-white hover:text-gray-200 close-error">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.close-error').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Initialize the blog page
const blogPage = new BlogPage();
blogPage.init();