// about.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class AboutPage {
  constructor() {
    this.profileData = null;
    this.workExperience = [];
    this.educationData = [];
    this.isLoading = true;
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchProfileData();
      await this.fetchWorkExperience();
      await this.fetchEducationData();
      this.populateProfile();
      this.populateWorkExperience();
      this.populateEducation();
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

  async fetchWorkExperience() {
    try {
      const response = await apiClient.get('/api/experience/');
      if (response.data?.data) {
        this.workExperience = response.data.data;
      } else {
        throw new Error('Invalid experience data');
      }
    } catch (error) {
      console.error('Experience fetch error:', error);
      throw new Error('Failed to load work experience');
    }
  }

  async fetchEducationData() {
    try {
      const response = await apiClient.get('/api/education/');
      if (Array.isArray(response.data)) {
        this.educationData = response.data;
      } else {
        throw new Error('Invalid education data');
      }
    } catch (error) {
      console.error('Education fetch error:', error);
      throw new Error('Failed to load education data');
    }
  }

  populateProfile() {
    if (!this.profileData) return;

    // Profile image
    const imgPlaceholder = document.querySelector('.about-page .bg-gray-200');
    if (imgPlaceholder && this.profileData.profile_image_url) {
      imgPlaceholder.outerHTML = `
        <img src="${this.profileData.profile_image_url}" 
             alt="${this.profileData.name}" 
             class="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg">
      `;
    }

    // Text content
    const nameEl = document.querySelector('.about-page h2.text-3xl');
    if (nameEl) nameEl.textContent = this.profileData.name;

    const titleEl = document.querySelector('.about-page h3.text-2xl');
    if (titleEl) titleEl.textContent = this.profileData.title;

    const bioEl = document.querySelector('.about-page p.text-lg');
    if (bioEl) bioEl.textContent = this.profileData.bio;

    // Contact info
    const contactElements = {
      email: document.querySelector('.about-page .fa-envelope').closest('div').nextElementSibling.querySelector('p:last-child'),
      phone: document.querySelector('.about-page .fa-phone').closest('div').nextElementSibling.querySelector('p:last-child'),
      address: document.querySelector('.about-page .fa-location-dot').closest('div').nextElementSibling.querySelector('p:last-child')
    };

    if (contactElements.email) contactElements.email.textContent = this.profileData.email;
    if (contactElements.phone) contactElements.phone.textContent = this.profileData.phone;
    if (contactElements.address) contactElements.address.textContent = this.profileData.address;

    // Social links
    const socialLinks = {
      github: document.querySelector('.about-page .fa-github').closest('a'),
      linkedin: document.querySelector('.about-page .fa-linkedin-in').closest('a'),
      twitter: document.querySelector('.about-page .fa-twitter').closest('a')
    };

    if (socialLinks.github && this.profileData.github_url) {
      socialLinks.github.href = this.profileData.github_url;
    }
    if (socialLinks.linkedin && this.profileData.linkedin_url) {
      socialLinks.linkedin.href = this.profileData.linkedin_url;
    }
    if (socialLinks.twitter && this.profileData.twitter_url) {
      socialLinks.twitter.href = this.profileData.twitter_url;
    }

    // Resume button
    const resumeBtn = document.querySelector('.about-page .fa-download').closest('a');
    if (resumeBtn && this.profileData.resume_url) {
      resumeBtn.href = this.profileData.resume_url;
    }
  }

  populateWorkExperience() {
    const timelineContainer = document.querySelector('.bg-gray-100 .relative');
    if (!timelineContainer || !this.workExperience.length) return;

    // Clear existing static content
    const staticItems = timelineContainer.querySelectorAll('.flex.flex-col');
    staticItems.forEach(item => item.remove());

    this.workExperience.forEach((exp, index) => {
      const isEven = index % 2 === 0;
      const positionClass = isEven ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left';
      const orderClass = isEven ? '' : 'lg:flex-row-reverse';
      const contentOrder = isEven ? '' : 'order-3 lg:order-1';

      const experienceEl = document.createElement('div');
      experienceEl.className = `flex flex-col lg:flex-row mb-16 ${orderClass}`;
      experienceEl.innerHTML = `
        <div class="lg:w-1/2 ${positionClass} mb-6 lg:mb-0 ${isEven ? '' : contentOrder}">
          <div class="inline-block px-4 py-1 bg-blue-500 text-white rounded-full text-sm mb-3">${exp.duration}</div>
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">${exp.position}</h3>
          <p class="text-xl text-blue-500 dark:text-blue-400 mb-4">${exp.company}</p>
          <div class="inline-flex justify-center lg:justify-${isEven ? 'end' : 'start'} mb-4">
            ${exp.company_logo_url ? 
              `<img src="${exp.company_logo_url}" alt="${exp.company}" class="w-16 h-16 object-contain">` : 
              `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
            }
          </div>
        </div>
        
        <div class="hidden lg:flex lg:w-1/2 lg:px-16 items-center justify-center">
          <div class="w-6 h-6 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 z-10"></div>
        </div>
        
        <div class="lg:w-1/2 lg:px-16 ${isEven ? '' : 'order-1 lg:order-3'}">
          <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
            <p class="text-gray-600 dark:text-gray-300 mb-4">${exp.description}</p>
            <ul class="text-gray-600 dark:text-gray-300 space-y-2 list-disc pl-5">
              ${exp.responsibilities?.map(resp => `<li>${resp}</li>`).join('') || ''}
            </ul>
          </div>
        </div>
      `;
      
      timelineContainer.appendChild(experienceEl);
    });
  }

  populateEducation() {
    const educationContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-8');
    if (!educationContainer || !this.educationData.length) return;

    // Clear existing static content
    while (educationContainer.firstChild) {
      educationContainer.removeChild(educationContainer.firstChild);
    }

    this.educationData.forEach(edu => {
      const educationEl = document.createElement('div');
      educationEl.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2';
      educationEl.innerHTML = `
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${edu.degree}</h3>
              <p class="text-blue-500 dark:text-blue-400">${edu.field_of_study}</p>
            </div>
            ${edu.institution_logo_url ? 
              `<img src="${edu.institution_logo_url}" alt="${edu.institution}" class="w-16 h-16 object-contain">` : 
              `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
            }
          </div>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <i class="fa-solid fa-graduation-cap mr-2"></i>
            <span>${edu.institution}</span>
          </div>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <i class="fa-solid fa-calendar-days mr-2"></i>
            <span>${edu.duration}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${edu.description}</p>
          <div class="mt-4">
            ${edu.achievements?.map(ach => `
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full mr-2">
                ${ach}
              </span>
            `).join('') || ''}
          </div>
        </div>
      `;
      
      educationContainer.appendChild(educationEl);
    });
  }

  addAnimations() {
    document.querySelectorAll('.about-page > div')
      .forEach((section, index) => {
        section.classList.add('opacity-0', 'translate-y-6');
        setTimeout(() => {
          section.classList.add('transition-all', 'duration-500', 'ease-out');
          section.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + (index * 150));
      });
  }

  handleError(error) {
    console.error('About page error:', error);
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

// Initialize the about page
const aboutPage = new AboutPage();
aboutPage.init();