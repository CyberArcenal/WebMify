import { apiClient } from "@js/api/auth";
import { showSuccess, showWarning, showInfo, showError } from "@js/utils/notifications";

// DOM Elements
const blogLoader = document.getElementById("blog-loader");
const blogError = document.getElementById("blog-error");
const blogContent = document.querySelector(".blog-page");
const featuredContainer = document.querySelector(".mb-16 .grid");
const allArticlesContainer = document.querySelector(".space-y-10");
const paginationInfo = document.querySelector(".mt-16 .text-sm");
const prevButton = document.querySelector(".mt-16 button:first-child");
const nextButton = document.querySelector(".mt-16 button:last-child");
const categoryButtons = document.querySelectorAll(".flex.space-x-2 button");
const searchInput = document.querySelector('input[type="text"]');
const subscribeForms = document.querySelectorAll(".flex, .flex-col");

// State management
let state = {
  currentPage: 1,
  currentCategory: "All",
  searchTerm: "",
  blogData: [],
  pagination: {
    count: 0,
    current_page: 1,
    total_pages: 1,
    page_size: 10,
  },
};

// Utility functions
const showLoader = () => blogLoader.classList.remove("hidden");
const hideLoader = () => blogLoader.classList.add("hidden");

const hideError = () => blogError.classList.add("hidden");

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Fetch blog data
const fetchBlogs = async () => {
  showLoader();
  hideError();

  try {
    const data = await apiClient.get(
      `/api/blog/?page=${state.currentPage}&category=${state.currentCategory}&search=${state.searchTerm}`
    );

    if (!data.data.status) {
      throw new Error(data.data.message || "Failed to fetch blog data");
    }

    state.blogData = data.data.data;
    state.pagination = data.data.pagination;
    renderBlogs();
  } catch (error) {
    console.log(error);
    showError(error.message);
  } finally {
    hideLoader();
  }
};

// Render blog content
const renderBlogs = () => {
  // Filter data based on search and category
  let filteredData = [...state.blogData];

  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.summary.toLowerCase().includes(term)
    );
  }

  if (state.currentCategory !== "All") {
    filteredData = filteredData.filter(
      (blog) => blog.category === state.currentCategory
    );
  }

  // Render featured posts
  const featuredPosts = filteredData.filter((post) => post.featured);
  renderFeaturedPosts(featuredPosts);

  // Render all posts with pagination
  renderAllPosts(filteredData);

  // Update pagination UI
  updatePaginationUI();

  // Update active category button
  updateActiveCategory();
};

const renderFeaturedPosts = (posts) => {
  if (posts.length === 0) {
    featuredContainer.innerHTML = `
        <div class="col-span-2 text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No featured posts found</p>
        </div>
      `;
    return;
  }

  featuredContainer.innerHTML = posts
    .map(
      (post) => `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div class="relative h-48">
          ${
            post.imageURL
              ? `<img src="${post.imageURL}" alt="${post.title}" class="w-full h-full object-cover">`
              : `<div class="bg-gray-200 border-2 border-dashed w-full h-full"></div>`
          }
          <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span class="mr-4">${post.publishDate}</span>
            <span><i class="fa-regular fa-eye mr-1"></i> ${
              post.views
            } views</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${
            post.title
          }</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${post.summary}</p>
          <a href="#blog/${
            post.id
          }" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            Read more
            <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    `
    )
    .join("");
};

const renderAllPosts = (posts) => {
  if (posts.length === 0) {
    allArticlesContainer.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No blog posts found. Try a different search or category.</p>
        </div>
      `;
    return;
  }

  // Apply pagination
  const startIndex = (state.currentPage - 1) * state.pagination.page_size;
  const paginatedPosts = posts.slice(
    startIndex,
    startIndex + state.pagination.page_size
  );

  allArticlesContainer.innerHTML = paginatedPosts
    .map(
      (post) => `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:flex">
        <div class="md:w-1/3">
          ${
            post.imageURL
              ? `<img src="${post.imageURL}" alt="${post.title}" class="w-full h-64 md:h-full object-cover">`
              : `<div class="bg-gray-200 border-2 border-dashed w-full h-64 md:h-full"></div>`
          }
        </div>
        <div class="p-6 md:w-2/3">
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span class="mr-4">${post.publishDate}</span>
            <span><i class="fa-regular fa-eye mr-1"></i> ${
              post.views
            } views</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${
            post.title
          }</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${post.summary}</p>
          <a href="#blog/${
            post.id
          }" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            Read more
            <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    `
    )
    .join("");
};

const updatePaginationUI = () => {
  const startIndex = (state.currentPage - 1) * state.pagination.page_size + 1;
  const endIndex = Math.min(
    state.currentPage * state.pagination.page_size,
    state.blogData.length
  );

  paginationInfo.innerHTML = `
      Showing <span class="font-medium">${startIndex}</span> 
      to <span class="font-medium">${endIndex}</span> 
      of <span class="font-medium">${state.blogData.length}</span> articles
    `;

  prevButton.disabled = state.currentPage === 1;
  nextButton.disabled = state.currentPage === state.pagination.total_pages;
};

const updateActiveCategory = () => {
  categoryButtons.forEach((button) => {
    const buttonCategory = button.textContent.trim();
    if (buttonCategory === "All Posts" && state.currentCategory === "All") {
      button.classList.add("bg-primary-500", "text-white");
      button.classList.remove(
        "bg-white",
        "dark:bg-gray-800",
        "text-gray-700",
        "dark:text-gray-300"
      );
    } else if (buttonCategory === state.currentCategory) {
      button.classList.add("bg-primary-500", "text-white");
      button.classList.remove(
        "bg-white",
        "dark:bg-gray-800",
        "text-gray-700",
        "dark:text-gray-300"
      );
    } else {
      button.classList.remove("bg-primary-500", "text-white");
      button.classList.add(
        "bg-white",
        "dark:bg-gray-800",
        "text-gray-700",
        "dark:text-gray-300"
      );
    }
  });
};

// Event handlers
const handleCategoryFilter = (e) => {
  const category = e.target.textContent.trim();
  state.currentCategory = category === "All Posts" ? "All" : category;
  state.currentPage = 1;
  fetchBlogs();
};

const handleSearch = debounce(() => {
  state.searchTerm = searchInput.value;
  state.currentPage = 1;
  fetchBlogs();
}, 300);

const handlePagination = (direction) => {
  if (direction === "prev" && state.currentPage > 1) {
    state.currentPage--;
  } else if (
    direction === "next" &&
    state.currentPage < state.pagination.total_pages
  ) {
    state.currentPage++;
  }
  fetchBlogs();
};

const handleSubscribe = async (e) => {
  e.preventDefault();
  const form = e.target.closest("div");
  const emailInput = form.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!email) {
    showWarning("Please enter a valid email address");
    return;
  }
  
  try {
    const response = await apiClient.post("/api/subscribe/", { email });
    
    if(response.data.status) {
      showSuccess(response.data.message);
      emailInput.value = "";
    } else {
      throw new Error(response.data.errors?.email?.[0] || "Subscription failed");
    }
  } catch(error) {
    console.error("Subscription error:", error);
    showError(error.response.data.message || "Subscription failed. Please try again later.");
  }
};

// Initialize event listeners
const initEventListeners = () => {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", handleCategoryFilter);
  });

  searchInput.addEventListener("input", handleSearch);

  prevButton.addEventListener("click", () => handlePagination("prev"));
  nextButton.addEventListener("click", () => handlePagination("next"));

  subscribeForms.forEach((form) => {
    const button = form.querySelector("button");
    if (button) {
      button.addEventListener("click", handleSubscribe);
    }
  });
};

// Initialize the page
const init = () => {
  initEventListeners();
  fetchBlogs();
};

// Initialize the application
init();
