// projects.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";
import {
  createProjectCard,
  showProjectModal,
  hideProjectModal,
} from "../utils/projectCard";
export default class ProjectsPage {
  constructor() {
    this.projects = [];
    this.pagination = null;
    this.currentPage = 1;
    this.pageSize = 6; // Default page size
    this.filter = "all";
    this.isLoading = true;
  }

  async init() {
    // Get initial page from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get("page")) || 1;
    this.filter = urlParams.get("filter") || "all";

    // Set active filter button
    this.setActiveFilter(this.filter);

    try {
      this.showLoadingState();
      // await new Promise((resolve) => setTimeout(resolve, 7000));
      await this.fetchProjects();
      this.renderProjects();
      this.updatePagination();
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
    const grid = document.getElementById("projects-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      `;
    }
  }

  hideLoadingState() {
    this.isLoading = false;
  }

  async fetchProjects() {
    try {
      const response = await apiClient.get(
        `/api/projects/?page=${this.currentPage}&page_size=${this.pageSize}&filter=${this.filter}`
      );

      if (response.data?.status) {
        this.projects = response.data.data;
        this.pagination = response.data.pagination;
      } else {
        throw new Error("Failed to load projects: Invalid API response");
      }
    } catch (error) {
      console.error("Projects fetch error:", error);
      throw new Error("Failed to load projects. Please try again later.");
    }
  }

  renderProjects() {
    const gridContainer = document.getElementById("projects-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    if (this.projects.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-folder-open text-gray-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">No projects found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try changing your filters or check back later.</p>
        </div>
      `;
      return;
    }

    this.projects.forEach((project) => {
      const projectCard = createProjectCard(project);
      gridContainer.appendChild(projectCard);
      
      // Remove animation classes immediately after appending
      setTimeout(() => {
        projectCard.classList.add("transition-all", "duration-500", "ease-out");
        projectCard.classList.remove("opacity-0", "translate-y-6");
      }, 10);
    });
  }



  updatePagination() {
    if (!this.pagination) return;

    // Update pagination info
    const paginationInfo = document.querySelector(".pagination-info");
    if (paginationInfo) {
      const startItem = (this.currentPage - 1) * this.pageSize + 1;
      const endItem = Math.min(
        this.currentPage * this.pageSize,
        this.pagination.count
      );
      paginationInfo.innerHTML = `
        Showing <span class="font-medium">${startItem}-${endItem}</span> 
        of <span class="font-medium">${this.pagination.count}</span> projects
      `;
    }

    // Update pagination controls
    const paginationContainer = document.getElementById("pagination-links");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    // Previous button
    const prevButton = document.createElement("a");
    prevButton.href = this.pagination.previous
      ? `?page=${this.currentPage - 1}&filter=${this.filter}`
      : "#";
    prevButton.className = `relative inline-flex items-center px-2 py-2 rounded-l-md border ${
      this.pagination.previous
        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
    }`;
    prevButton.innerHTML = `
      <span class="sr-only">Previous</span>
      <i class="fa-solid fa-chevron-left h-5 w-5"></i>
    `;
    if (!this.pagination.previous) {
      prevButton.addEventListener("click", (e) => e.preventDefault());
    }
    paginationContainer.appendChild(prevButton);

    // Page numbers
    const totalPages = Math.ceil(this.pagination.count / this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = `?page=${i}&filter=${this.filter}`;
      pageLink.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
        i === this.currentPage
          ? "z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`;
      pageLink.textContent = i;
      paginationContainer.appendChild(pageLink);
    }

    // Next button
    const nextButton = document.createElement("a");
    nextButton.href = this.pagination.next
      ? `?page=${this.currentPage + 1}&filter=${this.filter}`
      : "#";
    nextButton.className = `relative inline-flex items-center px-2 py-2 rounded-r-md border ${
      this.pagination.next
        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
    }`;
    nextButton.innerHTML = `
      <span class="sr-only">Next</span>
      <i class="fa-solid fa-chevron-right h-5 w-5"></i>
    `;
    if (!this.pagination.next) {
      nextButton.addEventListener("click", (e) => e.preventDefault());
    }
    paginationContainer.appendChild(nextButton);
  }

  setActiveFilter(filter) {
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    filterButtons.forEach((btn) => {
      if (btn.dataset.filter === filter) {
        btn.classList.add("bg-primary-500", "text-white");
        btn.classList.remove(
          "text-gray-700",
          "dark:text-gray-300",
          "hover:bg-gray-100",
          "dark:hover:bg-gray-700"
        );
      } else {
        btn.classList.remove("bg-primary-500", "text-white");
        btn.classList.add(
          "text-gray-700",
          "dark:text-gray-300",
          "hover:bg-gray-100",
          "dark:hover:bg-gray-700"
        );
      }
    });
  }

  setupEventListeners() {
    // document.querySelectorAll('.project-card')?.forEach(project => {
    //   project.addEventListener("click", ()=>{
    //     localStorage.setItem("project-detail-id", `${project.getAttribute('data-projectId')}`);
    //     window.location.href="#project-detail";
    //   });
    // });
    // Filter buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".view-project-btn")) {
        const card = e.target.closest(".project-card");
        const projectId = card.getAttribute("data-projectId");
        const project = this.projects.find((p) => p.id == projectId);

        // if (project) {
        //   this.showProjectModal(project);
        // }

        window.location.href=`#project-detail/${projectId}`
      }
    });
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filter = btn.dataset.filter;
        this.currentPage = 1;
        this.setActiveFilter(this.filter);
        this.updateProjects();
        // Update URL without reloading page
        history.pushState({}, "", `?page=1&filter=${this.filter}`);
      });
    });

    // Pagination event delegation
    document.addEventListener("click", (e) => {
      if (e.target.closest("#pagination-links a")) {
        e.preventDefault();
        const href = e.target.closest("a").getAttribute("href");
        if (href && href !== "#") {
          const page = new URLSearchParams(href.split("?")[1]).get("page");
          if (page) {
            this.currentPage = parseInt(page);
            this.updateProjects();
          }
        }
      }
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get("page")) || 1;
      const filter = urlParams.get("filter") || "all";

      if (page !== this.currentPage || filter !== this.filter) {
        this.currentPage = page;
        this.filter = filter;
        this.setActiveFilter(filter);
        this.updateProjects();
      }
    });

    document.addEventListener("click", (e) => {
      // Handle Read More clicks
      if (e.target.closest(".read-more")) {
        e.preventDefault();
        const readMore = e.target.closest(".read-more");
        const projectId = readMore.dataset.id;
        const project = this.projects.find((p) => p.id == projectId);
        
        if (project) {
          showProjectModal(project);
        }
      }

      // Close modal when clicking close button or outside
      if (
        e.target.classList.contains("close-modal") ||
        e.target.classList.contains("project-modal-overlay")
      ) {
        hideProjectModal();
      }
    });
  }

  async updateProjects() {
    try {
      this.showLoadingState();
      await this.fetchProjects();
      this.renderProjects();
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  addAnimations() {
    const projectCards = document.querySelectorAll("#projects-grid > div");
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("transition-all", "duration-500", "ease-out");
        card.classList.remove("opacity-0", "translate-y-6");
      }, 100 + index * 100);
    });
  }

  handleError(error) {
    console.error("Projects page error:", error);

    const gridContainer = document.getElementById("projects-grid");
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Failed to load projects</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">${
            error.message || "Please try again later"
          }</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Reload Page
          </button>
        </div>
      `;
    }
  }
}

// Initialize the projects page
const projectsPage = new ProjectsPage();
projectsPage.init();
