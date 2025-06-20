// projects.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class ProjectsPage {
  constructor() {
    this.projects = [];
    this.pagination = null;
    this.currentPage = 1;
    this.pageSize = 6; // Default page size
    this.filter = 'all';
    this.isLoading = true;
  }

  async init() {
    // Get initial page from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get('page')) || 1;
    this.filter = urlParams.get('filter') || 'all';

    // Set active filter button
    this.setActiveFilter(this.filter);

    try {
      this.showLoadingState();
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
    const grid = document.getElementById('projects-grid');
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
      const response = await apiClient.get(`/api/projects/?page=${this.currentPage}&page_size=${this.pageSize}&filter=${this.filter}`);
      
      if (response.data?.status) {
        this.projects = response.data.data;
        this.pagination = response.data.pagination;
      } else {
        throw new Error('Failed to load projects: Invalid API response');
      }
    } catch (error) {
      console.error('Projects fetch error:', error);
      throw new Error('Failed to load projects. Please try again later.');
    }
  }

  renderProjects() {
    const gridContainer = document.getElementById('projects-grid');
    if (!gridContainer) return;
    
    // Clear existing projects
    gridContainer.innerHTML = '';
    
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
    
    this.projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      gridContainer.appendChild(projectCard);
    });
  }

  createProjectCard(project) {
    // Map project types to Tailwind classes
    const typeClasses = {
      'web': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
      'mobile': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
      'open-source': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
      'default': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' }
    };
    
    const typeClass = typeClasses[project.project_type] || typeClasses.default;
    
    // Format technologies as tags
    const techTags = project.technologies_list.map(tech => 
      `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">${tech}</span>`
    ).join('');
    
    // Determine demo link text and icon based on project type
    let demoText = 'Live Demo';
    let demoIcon = '<i class="fa-solid fa-arrow-up-right-from-square ml-1 text-sm"></i>';
    if (project.project_type === 'mobile') {
      demoText = 'App Store';
      demoIcon = '<i class="fa-brands fa-app-store-ios ml-1"></i>';
    }
    
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl opacity-0 translate-y-6';
    card.innerHTML = `
      <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
        ${project.image_url ? 
          `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover">` : 
          `<div class="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-full"></div>`
        }
        ${project.featured ? `
          <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        ` : ''}
      </div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">${project.title}</h3>
          <span class="text-xs px-2 py-1 ${typeClass.bg} ${typeClass.text} rounded-full">
            ${project.project_type === 'web' ? 'Web App' : 
              project.project_type === 'mobile' ? 'Mobile' : 
              project.project_type === 'open-source' ? 'Open Source' : project.project_type}
          </span>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-5">${project.description}</p>
        <div class="flex flex-wrap gap-2 mb-6">
          ${techTags}
        </div>
        <div class="flex justify-between">
          ${project.demo_url ? `
            <a href="${project.demo_url}" target="_blank" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
              ${demoText}
              ${demoIcon}
            </a>
          ` : ''}
          ${project.source_code_url ? `
            <a href="${project.source_code_url}" target="_blank" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Source Code
              <i class="fab fa-github ml-1"></i>
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    return card;
  }

  updatePagination() {
    if (!this.pagination) return;
    
    // Update pagination info
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const startItem = (this.currentPage - 1) * this.pageSize + 1;
      const endItem = Math.min(this.currentPage * this.pageSize, this.pagination.count);
      paginationInfo.innerHTML = `
        Showing <span class="font-medium">${startItem}-${endItem}</span> 
        of <span class="font-medium">${this.pagination.count}</span> projects
      `;
    }
    
    // Update pagination controls
    const paginationContainer = document.getElementById('pagination-links');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('a');
    prevButton.href = this.pagination.previous ? `?page=${this.currentPage - 1}&filter=${this.filter}` : '#';
    prevButton.className = `relative inline-flex items-center px-2 py-2 rounded-l-md border ${
      this.pagination.previous ? 
        'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700' : 
        'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
    }`;
    prevButton.innerHTML = `
      <span class="sr-only">Previous</span>
      <i class="fa-solid fa-chevron-left h-5 w-5"></i>
    `;
    if (!this.pagination.previous) {
      prevButton.addEventListener('click', e => e.preventDefault());
    }
    paginationContainer.appendChild(prevButton);
    
    // Page numbers
    const totalPages = Math.ceil(this.pagination.count / this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = `?page=${i}&filter=${this.filter}`;
      pageLink.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
        i === this.currentPage ?
          'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400' :
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`;
      pageLink.textContent = i;
      paginationContainer.appendChild(pageLink);
    }
    
    // Next button
    const nextButton = document.createElement('a');
    nextButton.href = this.pagination.next ? `?page=${this.currentPage + 1}&filter=${this.filter}` : '#';
    nextButton.className = `relative inline-flex items-center px-2 py-2 rounded-r-md border ${
      this.pagination.next ? 
        'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700' : 
        'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
    }`;
    nextButton.innerHTML = `
      <span class="sr-only">Next</span>
      <i class="fa-solid fa-chevron-right h-5 w-5"></i>
    `;
    if (!this.pagination.next) {
      nextButton.addEventListener('click', e => e.preventDefault());
    }
    paginationContainer.appendChild(nextButton);
  }

  setActiveFilter(filter) {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('bg-primary-500', 'text-white');
        btn.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
      } else {
        btn.classList.remove('bg-primary-500', 'text-white');
        btn.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
      }
    });
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filter = btn.dataset.filter;
        this.currentPage = 1;
        this.setActiveFilter(this.filter);
        this.updateProjects();
        // Update URL without reloading page
        history.pushState({}, '', `?page=1&filter=${this.filter}`);
      });
    });
    
    // Pagination event delegation
    document.addEventListener('click', (e) => {
      if (e.target.closest('#pagination-links a')) {
        e.preventDefault();
        const href = e.target.closest('a').getAttribute('href');
        if (href && href !== '#') {
          const page = new URLSearchParams(href.split('?')[1]).get('page');
          if (page) {
            this.currentPage = parseInt(page);
            this.updateProjects();
          }
        }
      }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get('page')) || 1;
      const filter = urlParams.get('filter') || 'all';
      
      if (page !== this.currentPage || filter !== this.filter) {
        this.currentPage = page;
        this.filter = filter;
        this.setActiveFilter(filter);
        this.updateProjects();
      }
    });
  }

  async updateProjects() {
    try {
      this.showLoadingState();
      await this.fetchProjects();
      this.renderProjects();
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  addAnimations() {
    const projectCards = document.querySelectorAll('#projects-grid > div');
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('transition-all', 'duration-500', 'ease-out');
        card.classList.remove('opacity-0', 'translate-y-6');
      }, 100 + (index * 100));
    });
  }

  handleError(error) {
    console.error('Projects page error:', error);
    
    const gridContainer = document.getElementById('projects-grid');
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Failed to load projects</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">${error.message || 'Please try again later'}</p>
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