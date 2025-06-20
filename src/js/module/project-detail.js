// project-detail.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class ProjectDetailPage {
  constructor() {
    this.projectData = null;
    this.isLoading = true;
    this.projectId = this.getProjectIdFromUrl();
  }

  getProjectIdFromUrl() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  }

  async init() {
    if (!this.projectId) {
      this.handleError(new Error('Invalid project ID'));
      return;
    }

    try {
      this.showLoadingState();
      await this.fetchProjectData();
      this.renderProjectDetails();
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
    const loader = document.getElementById('project-loader');
    if (loader) loader.classList.remove('hidden');
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById('app').classList.remove('opacity-75');
    const loader = document.getElementById('project-loader');
    if (loader) loader.classList.add('hidden');
  }

  async fetchProjectData() {
    try {
      const response = await apiClient.get(`/api/projects/${this.projectId}/`);
      if (response.data) {
        this.projectData = response.data;
      } else {
        throw new Error('Project data not found');
      }
    } catch (error) {
      console.error('Project fetch error:', error);
      throw new Error('Failed to load project details');
    }
  }

  renderProjectDetails() {
    if (!this.projectData) return;

    // Update hero section
    const typeBadge = document.getElementById('project-type-badge');
    if (typeBadge) {
      typeBadge.textContent = this.formatProjectType(this.projectData.project_type);
    }

    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = this.projectData.title;

    const heroDesc = document.getElementById('project-hero-description');
    if (heroDesc) heroDesc.textContent = this.projectData.description;

    // Update main image
    const mainImgContainer = document.getElementById('project-main-image');
    if (mainImgContainer) {
      if (this.projectData.image_url) {
        mainImgContainer.innerHTML = `
          <img src="${this.projectData.image_url}" 
               alt="${this.projectData.title}" 
               class="w-full h-full object-cover">
        `;
      } else {
        mainImgContainer.innerHTML = `
          <div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full"></div>
        `;
      }
    }

    // Update sidebar details
    const sidebarType = document.getElementById('sidebar-project-type');
    if (sidebarType) sidebarType.textContent = this.formatProjectType(this.projectData.project_type);

    const sidebarDate = document.getElementById('sidebar-completion-date');
    if (sidebarDate) {
      sidebarDate.textContent = this.formatDate(this.projectData.created_at);
    }

    // Update technologies
    const techContainer = document.getElementById('sidebar-technologies');
    if (techContainer && this.projectData.technologies_list) {
      techContainer.innerHTML = '';
      this.projectData.technologies_list.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full';
        span.textContent = tech;
        techContainer.appendChild(span);
      });
    }

    // Update links
    const demoLink = document.getElementById('project-demo-link');
    if (demoLink && this.projectData.demo_url) {
      demoLink.href = this.projectData.demo_url;
    } else if (demoLink) {
      demoLink.style.display = 'none';
    }

    const sourceLink = document.getElementById('project-source-link');
    if (sourceLink && this.projectData.source_code_url) {
      sourceLink.href = this.projectData.source_code_url;
    } else if (sourceLink) {
      sourceLink.style.display = 'none';
    }
  }

  formatProjectType(type) {
    const typeMap = {
      'web': 'Web Application',
      'mobile': 'Mobile Application',
      'open-source': 'Open Source'
    };
    return typeMap[type] || type;
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
    document.title = `${this.projectData.title} | Project Details`;
    
    // Update Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.projectData.title;
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = this.projectData.description;
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && this.projectData.image_url) {
      ogImage.content = this.projectData.image_url;
    }
  }

  addAnimations() {
    const elementsToAnimate = [
      document.getElementById('project-hero-section'),
      document.getElementById('project-main-image'),
      document.getElementById('project-overview'),
      document.getElementById('project-details-sidebar')
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
    console.error('ProjectDetail error:', error);
    
    const errorContainer = document.getElementById('project-error');
    const contentContainer = document.getElementById('project-content-container');
    
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-800 mb-2">Failed to load project details</h3>
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

// Initialize the project detail page
const projectDetailPage = new ProjectDetailPage();
projectDetailPage.init();