// home.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class HomePage {
  constructor() {
    this.profileData = null;
    this.featuredProjects = [];
    this.isLoading = true;
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchProfileData();
      await this.fetchFeaturedProjects();
      this.populateProfile();
      this.populateProjects();
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

  async fetchProfileData() {
    try {
      const response = await apiClient.get('/api/profile/');
      if (response.data) {
        this.profileData = response.data;
      } else {
        throw new Error('Empty profile data');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error('Failed to load profile data');
    }
  }

  async fetchFeaturedProjects() {
    try {
      const response = await apiClient.get('/api/projects/?featured=true');
      if (response.data?.status && Array.isArray(response.data.data)) {
        this.featuredProjects = response.data.data;
      } else {
        throw new Error('Invalid projects data');
      }
    } catch (error) {
      console.error('Projects fetch error:', error);
      throw new Error('Failed to load featured projects');
    }
  }

  populateProfile() {
    if (!this.profileData) return;

    const elements = {
      name: document.getElementById('profile-name'),
      title: document.getElementById('profile-title'),
      bio: document.getElementById('profile-bio'),
      email: document.getElementById('profile-email'),
      phone: document.getElementById('profile-phone'),
      address: document.getElementById('profile-address'),
      resume: document.getElementById('resume-button'),
      github: document.getElementById('github-link'),
      linkedin: document.getElementById('linkedin-link'),
      twitter: document.getElementById('twitter-link'),
      image: document.getElementById('profile-image-placeholder')
    };

    // Text content
    elements.name.textContent = this.profileData.name;
    elements.title.textContent = this.profileData.title;
    elements.bio.textContent = this.profileData.bio;
    elements.email.textContent = this.profileData.email;
    elements.phone.textContent = this.profileData.phone;
    elements.address.textContent = this.profileData.address;

    // Links
    elements.resume.href = this.profileData.resume_url;
    elements.github.href = this.profileData.github_url;
    elements.linkedin.href = this.profileData.linkedin_url;
    elements.twitter.href = this.profileData.twitter_url;

    // Profile image
    if (this.profileData.profile_image_url) {
      elements.image.outerHTML = `
        <img src="${this.profileData.profile_image_url}" 
             alt="${this.profileData.name}" 
             class="rounded-xl w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg">
      `;
    }
  }

  populateProjects() {
    const container = document.querySelector('.featured-projects .grid');
    if (!container || !this.featuredProjects.length) return;

    container.innerHTML = '';

    this.featuredProjects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2';
      
      card.innerHTML = `
        <div class="h-48 overflow-hidden">
          ${project.image_url ? 
            `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover transition duration-500 hover:scale-105">` : 
            `<div class="bg-gray-200 dark:bg-gray-600 w-full h-full"></div>`
          }
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${project.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${project.technologies_list.map(tech => `
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full">
                ${tech}
              </span>
            `).join('')}
          </div>
          <div class="flex gap-3 mt-4">
            ${project.demo_url ? `
              <a href="${project.demo_url}" 
                 class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
                 target="_blank">
                <i class="fa-solid fa-globe mr-1"></i> Demo
              </a>
            ` : ''}
            ${project.source_code_url ? `
              <a href="${project.source_code_url}" 
                 class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
                 target="_blank">
                <i class="fab fa-github mr-1"></i> Code
              </a>
            ` : ''}
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }

  addAnimations() {
    document.querySelectorAll('.hero > div > div, .featured-projects, .skills-preview')
      .forEach((section, index) => {
        section.classList.add('opacity-0', 'translate-y-6');
        setTimeout(() => {
          section.classList.add('transition-all', 'duration-500', 'ease-out');
          section.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + (index * 150));
      });
  }

  handleError(error) {
    console.error('Home page error:', error);
    showError('Failed to load page content');

    // Show error notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center';
    notification.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      <span>Failed to load content. Please refresh the page.</span>
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

// Initialize the home page
const homePage = new HomePage();
homePage.init();