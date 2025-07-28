// blog.js
import { apiClient } from "@js/api/auth";
import { showSuccess, showWarning, showError } from "@js/utils/notifications";
import { createBlogCard } from "../utils/projectCard";
export default class BlogPage {
  constructor() {
    this.blogData = [];
    this.popularArticles = [];
    this.categories = [];
    this.featuredCategories = [];
    this.categorySlug = "";

    this.pagination = {
      count: 0,
      current_page: 1,
      total_pages: 1,
      page_size: 10,
    };
    this.currentCategory = "All";
    this.searchTerm = "";
    this.isLoading = true;

    // DOM Elements

    this.blogLoader = document.getElementById("blog-loader");
    this.blogError = document.getElementById("blog-error");
    this.blogContent = document.querySelector(".blog-page");
    this.featuredContainer = document.querySelector(".mb-16 .grid");
    this.allArticlesContainer = document.querySelector(".space-y-10");
    this.paginationInfo = document.querySelector(".mt-16 .text-sm");
    this.prevButton = document.querySelector(".pagination-prev");
    this.nextButton = document.querySelector(".pagination-next");
    this.categoryButtonsContainer = document.querySelector(
      ".category-button-container"
    );
    this.searchInput = document.querySelector('input[type="text"]');
    this.subscribeForms = document.querySelectorAll(".subscribe-form");

    // Sidebar elements
    this.sidebar = document.querySelector(".w-full.lg\\:w-4\\/12");
    this.popularContainer = this.sidebar.querySelector(
      ".popular-articles-container"
    );
    this.categoriesContainer = this.sidebar.querySelector(
      ".category-sidebar-container"
    );

    // Create blog detail container
    this.blogDetailContainer = document.createElement("div");
    this.blogDetailContainer.id = "blog-detail-container";
    this.blogDetailContainer.className =
      "hidden min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:bg-gray-900";
    document.body.appendChild(this.blogDetailContainer);
  }

  async init() {
  
    try {
      this.showLoadingState();
      this.initEventListeners();
      // await new Promise((resolve) => setTimeout(resolve, 7000));



      await Promise.all([
        this.fetchBlogs(),
        this.fetchPopularArticles(),
        this.fetchCategories(),
      ]);


    } catch (error) {
      console.error("Initialization error:", error);
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    this.isLoading = true;
    this.blogLoader.classList.remove("hidden");
  }

  hideLoadingState() {
    this.isLoading = false;
    this.blogLoader.classList.add("hidden");
  }

  async fetchBlogs() {
    try {
      const categorySlug =
        this.categories.find((cat) => cat.name === this.currentCategory)
          ?.slug || "";

      const response = await apiClient.get(
        `/api/blog/?page=${this.pagination.current_page}&category=${categorySlug}&search=${this.searchTerm}`
      );

      // Debugging: Log the response structure
 

      // Check for successful response
      if (response.status !== 200 || !response.data?.status) {
        throw new Error(response.data?.message || "Failed to fetch blog data");
      }

      // Properly extract data from the response
      this.blogData = response.data.data || [];
      this.pagination = response.data.pagination || {
        count: 0,
        current_page: 1,
        total_pages: 1,
        page_size: 10,
      };

      this.renderBlogs();
    } catch (error) {
      console.error("Blog fetch error:", error);
      this.handleError(error);
    }
  }

  async fetchPopularArticles() {
    try {
      const response = await apiClient.get("/api/blog/popular/");
      if (response.data?.status) {
        this.popularArticles = response.data.data;
        this.renderPopularArticles();
      } else {
        throw new Error("Failed to load popular articles");
      }
    } catch (error) {
      console.error("Popular articles error:", error);
      this.renderPopularArticlesError();
    }
  }

  async fetchCategories() {
    try {
      const response = await apiClient.get("/api/categories/");
      if (response.data?.status) {
        this.categories = response.data.data;

        // Separate featured and non-featured categories
        this.featuredCategories = this.categories.filter((cat) => cat.featured);
        this.renderNavigationCategories();
        this.renderSidebarCategories();
      } else {
        throw new Error("Failed to load categories");
      }
    } catch (error) {
      console.error("Categories error:", error);
      this.renderCategoriesError();
    }
  }

  hideError() {
    this.blogError.classList.add("hidden");
  }

  renderBlogs() {
    // Start with an empty array if blogData is not defined
    let filteredData = [...(this.blogData || [])];

    // Apply search filter if search term exists
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (blog) =>
          (blog.title && blog.title.toLowerCase().includes(term)) ||
          (blog.summary && blog.summary.toLowerCase().includes(term))
      );
    }

    // Apply category filter if category is selected
    if (this.currentCategory !== "All") {
      filteredData = filteredData.filter((blog) => {
        // Check if the blog has categories array and if any category matches the current slug
        if (blog.categories && Array.isArray(blog.categories)) {
          return blog.categories.some((cat) => cat.slug === this.categorySlug);
        }
        return false;
      });
    }

    // Render featured posts
    const featuredPosts = filteredData.filter((post) => post.featured);
    this.renderFeaturedPosts(featuredPosts);

    // Render all posts with pagination
    this.renderAllPosts(filteredData);

    // Update pagination UI
    this.updatePaginationUI();

    // Update active category button
    this.updateActiveCategory();
  }

  renderPopularArticles() {
    if (!this.popularContainer) return;

    if (this.popularArticles.length === 0) {
      this.popularContainer.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Popular Articles</h3>
        <div class="text-center py-4">
          <p class="text-gray-500 dark:text-gray-400">No popular articles found</p>
        </div>
      `;
      return;
    }

    this.popularContainer.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Popular Articles</h3>
      <div class="space-y-4">
        ${this.popularArticles
          .map(
            (article) => `
          <a href="#blog-detail/${article.slug}" class="flex items-start group">
            <div class="flex-shrink-0 mr-4">
              ${
                article.imageURL
                  ? `<img src="${article.imageURL}" alt="${article.title}" class="w-16 h-16 rounded-lg object-cover">`
                  : `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
              }
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">${
                article.title
              }</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">${
                article.publishDate
              }</p>
              <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <i class="fa-regular fa-eye mr-1"></i> ${article.views} views
              </div>
            </div>
          </a>
        `
          )
          .join("")}
      </div>
    `;
  }

  renderPopularArticlesError() {
    if (!this.popularContainer) return;

    this.popularContainer.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Popular Articles</h3>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <i class="fa-solid fa-triangle-exclamation text-yellow-500 text-xl mr-2"></i>
        <span class="text-yellow-700">Failed to load popular articles</span>
      </div>
    `;
  }

  renderNavigationCategories() {
    if (!this.categoryButtonsContainer) return;

    // Clear existing buttons except the first one (All Posts)
    while (this.categoryButtonsContainer.children.length > 1) {
      this.categoryButtonsContainer.removeChild(
        this.categoryButtonsContainer.lastChild
      );
    }

    // Add featured category buttons
    this.featuredCategories.forEach((category) => {
      const button = document.createElement("button");
      button.className =
        "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow hover:bg-gray-50 dark:hover:bg-gray-700";
      button.textContent = category.name;
      button.dataset.category = category.name;
      this.categoryButtonsContainer.appendChild(button);
    });

    // Update category buttons reference
    this.categoryButtons =
      this.categoryButtonsContainer.querySelectorAll("button");
  }

  renderSidebarCategories() {
    if (!this.categoriesContainer) return;

    if (this.categories.length === 0) {
      this.categoriesContainer.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Categories</h3>
        <div class="text-center py-4">
          <p class="text-gray-500 dark:text-gray-400">No categories found</p>
        </div>
      `;
      return;
    }

    this.categoriesContainer.innerHTML = `
  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Categories</h3>
  <div class="space-y-2">
    ${this.categories
      .map(
        (category, index) => `
      <a href="#" class="flex justify-between items-center py-2 ${
        index < this.categories.length - 1
          ? "border-b border-gray-100 dark:border-gray-700"
          : ""
      } group" data-slug="${category.slug}">  <!-- Change to data-slug -->
        <span class="text-gray-700 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400">${
          category.name
        }</span>
        <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded-full">${
          category.count
        }</span>
      </a>
    `
      )
      .join("")}
  </div>
`;

    // Add category filter event listeners
    this.categoriesContainer
      .querySelectorAll("a[data-slug]")
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const slug = link.dataset.slug;
          const category = this.categories.find((cat) => cat.slug === slug);

          this.currentCategory = category.name;
          this.categorySlug = slug;
          this.pagination.current_page = 1;
          this.fetchBlogs();
        });
      });
  }

  renderCategoriesError() {
    if (!this.categoriesContainer) return;

    this.categoriesContainer.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Categories</h3>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <i class="fa-solid fa-triangle-exclamation text-yellow-500 text-xl mr-2"></i>
        <span class="text-yellow-700">Failed to load categories</span>
      </div>
    `;
  }

  renderFeaturedPosts(posts) {
    if (!this.featuredContainer) return;

    this.featuredContainer.innerHTML = "";

    if (posts.length === 0) {
      this.featuredContainer.innerHTML = `
      <div class="col-span-2 text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No featured posts found</p>
      </div>
    `;
      return;
    }

    posts.forEach((post) => {
      const card = createBlogCard(post, true);
      this.featuredContainer.appendChild(card);
    });
  }

  renderAllPosts(posts) {
    if (!this.allArticlesContainer) return;

    this.allArticlesContainer.innerHTML = "";

    if (posts.length === 0) {
      this.allArticlesContainer.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No blog posts found. Try a different search or category.</p>
      </div>
    `;
      return;
    }

    posts.forEach((post) => {
      const card = createBlogCard(post);
      this.allArticlesContainer.appendChild(card);
    });
  }

  updatePaginationUI() {
    const startIndex =
      (this.pagination.current_page - 1) * this.pagination.page_size + 1;
    const endIndex = Math.min(
      this.pagination.current_page * this.pagination.page_size,
      this.blogData.length
    );

    this.paginationInfo.innerHTML = `
        Showing <span class="font-medium">${startIndex}</span> 
        to <span class="font-medium">${endIndex}</span> 
        of <span class="font-medium">${this.blogData.length}</span> articles
      `;

    this.prevButton.disabled = this.pagination.current_page === 1;
    this.nextButton.disabled =
      this.pagination.current_page === this.pagination.total_pages;
  }

  updateActiveCategory() {
    this.categoryButtonsContainer
      .querySelectorAll("button")
      ?.forEach((button) => {
        const buttonCategory = button.textContent.trim();

        if (buttonCategory === "All Posts" && this.currentCategory === "All") {
          button.className =
            "px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow";
        } else if (buttonCategory === this.currentCategory) {
          button.className =
            "px-4 py-2 bg-primary-500 text-white rounded-lg font-medium shadow";
        } else {
          button.className =
            "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow hover:bg-gray-50 dark:hover:bg-gray-700";
        }
      });
  }

  // Function to show blog list view
  showBlogList() {
    this.blogDetailContainer.classList.add("hidden");
    this.blogContent.classList.remove("hidden");
  }

  // Function to show blog detail view
  showBlogDetail() {
    this.blogContent.classList.add("hidden");
    this.blogDetailContainer.classList.remove("hidden");
  }

  // Fetch blog detail data
  async loadBlogDetail(blogSlug) {
    this.showLoadingState();

    try {
      const response = await apiClient.get(`/api/blog-detail/${blogSlug}`);

      if (!response.data.status) {
        throw new Error(
          response.data.message || "Failed to fetch blog details"
        );
      }

      const blog = response.data.data;
    
      if (blog) {
        this.renderBlogDetail(blog);
        this.showBlogDetail();
      }
    } catch (error) {
      console.error("Blog detail error:", error);
      showError(
        error.message || "Failed to load blog post. Please try again later."
      );
      // Return to blog list view on error
      this.showBlogList();
    } finally {
      this.hideLoadingState();
    }
  }

  // Render blog detail content
  renderBlogDetail(blog) {
    this.blogDetailContainer.innerHTML = `
      <div class="mb-8">
        <button id="back-to-blog" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          <i class="fa-solid fa-arrow-left mr-2"></i> Back to Blog
        </button>
      </div>
      
      <article class="prose dark:prose-invert max-w-none">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">${
          blog.title
        }</h1>
        
        <div class="flex items-center text-gray-600 dark:text-gray-400 mb-8">
          <span class="mr-6">${blog.publishDate}</span>
          <span><i class="fa-regular fa-eye mr-1"></i> ${
            blog.views
          } views</span>
        </div>
        
        ${
          blog.imageURL
            ? `<img src="${blog.imageURL}" alt="${blog.title}" class="w-full h-auto rounded-xl mb-8">`
            : `<div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mb-8"></div>`
        }
        
        <div class="text-gray-700 dark:text-gray-300">
          ${blog.content}
        </div>
      </article>
    `;

    // Add event listener to back button
    document.getElementById("back-to-blog").addEventListener("click", () => {
      window.location.hash = "";
      this.showBlogList();
    });
  }

  // Handle URL hash changes for routing
  handleHashChange() {
    const hash = window.location.hash;
    const match = hash.match(/^#blog-detail\/([a-z0-9-]+)$/);

    if (match) {
      const blogSlug = match[1];
      this.loadBlogDetail(blogSlug);
    } else {
      this.showBlogList();
    }
  }

  // Event handlers
  handleCategoryFilter(e) {
    const category = e.target.textContent.trim();
    // Find category object to get slug
    const categoryObj = this.categories.find((cat) => cat.name === category);

    this.currentCategory = categoryObj ? categoryObj.name : "All";
    this.categorySlug = categoryObj ? categoryObj.slug : ""; // Store slug separately
    this.pagination.current_page = 1;
    this.fetchBlogs();
  }

  handleSearch = () => {
    this.searchTerm = this.searchInput.value;
    this.pagination.current_page = 1;
    this.fetchBlogs();
  };

  handlePagination(direction) {
    if (direction === "prev" && this.pagination.current_page > 1) {
      this.pagination.current_page--;
    } else if (
      direction === "next" &&
      this.pagination.current_page < this.pagination.total_pages
    ) {
      this.pagination.current_page++;
    }
    this.fetchBlogs();
  }

  async handleSubscribe(e) {
    e.preventDefault();
    const form = e.target.closest("div");
    const emailInput = form.querySelector(".email-subscribe-input");
    const email = emailInput.value.trim();

    if (!email) {
      showWarning("Please enter a valid email address");
      return;
    }

    try {
      const response = await apiClient.post("/api/subscribe/", { email });

      if (response.data.status) {
        showSuccess(response.data.message);
        emailInput.value = "";
      } else {
        throw new Error(
          response.data.errors?.email?.[0] || "Subscription failed"
        );
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showError(
        error.response?.data?.message ||
          "Subscription failed. Please try again later."
      );
    }
  }

  // Initialize event listeners
  initEventListeners() {
    // Use event delegation for category buttons since they're dynamic
    this.categoryButtonsContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        this.handleCategoryFilter(e);
      }
    });

    this.searchInput.addEventListener("input", () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(this.handleSearch.bind(this), 300);
    });

    this.prevButton.addEventListener("click", () =>
      this.handlePagination("prev")
    );
    this.nextButton.addEventListener("click", () =>
      this.handlePagination("next")
    );

    this.subscribeForms.forEach((form) => {
      const button = form.querySelector("button");

      if (button) {
        button.addEventListener("click", this.handleSubscribe.bind(this));
      }
    });

    // Add hashchange event listener for routing
    window.addEventListener("hashchange", this.handleHashChange.bind(this));

    // Check initial URL hash for routing
    this.handleHashChange();
  }

  handleError(error) {
    console.error("Blog page error:", error);

    if (this.blogError) {
      this.blogError.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-xl mr-2"></i>
          <span class="text-red-700">${
            error.message || "Failed to load blog posts"
          }</span>
        </div>
      `;
      this.blogError.classList.remove("hidden");
    }
  }
}

// Initialize the blog page
const blogPage = new BlogPage();
blogPage.init();
