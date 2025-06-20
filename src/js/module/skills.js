// skills.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class SkillsPage {
  constructor() {
    this.skills = [];
    this.categories = {};
    this.isLoading = true;
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchSkills();
      this.processSkillsData();
      this.renderSkills();
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
    const loader = document.getElementById('skills-loader');
    if (loader) loader.classList.remove('hidden');
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById('app').classList.remove('opacity-75');
    const loader = document.getElementById('skills-loader');
    if (loader) loader.classList.add('hidden');
  }

  async fetchSkills() {
    try {
      const response = await apiClient.get('/api/skills/?page=1&page_size=50');
      
      if (response.data?.status) {
        this.skills = response.data.data;
      } else {
        throw new Error('Failed to load skills: Invalid API response');
      }
    } catch (error) {
      console.error('Skills fetch error:', error);
      throw new Error('Failed to load skills. Please try again later.');
    }
  }

  processSkillsData() {
    // Group skills by category
    this.categories = {};
    
    this.skills.forEach(skill => {
      if (!this.categories[skill.category]) {
        this.categories[skill.category] = [];
      }
      
      // Add icon color based on category
      const skillWithColor = {
        ...skill,
        color: this.getSkillColor(skill.category)
      };
      
      this.categories[skill.category].push(skillWithColor);
    });
  }

  getSkillColor(category) {
    const colorMap = {
      'language': 'text-indigo-500',
      'frontend': 'text-blue-500',
      'backend': 'text-green-500',
      'devops': 'text-yellow-500',
      'framework': 'text-purple-500',
      'design': 'text-pink-500'
    };
    
    return colorMap[category] || 'text-gray-500';
  }

  renderSkills() {
    // Map API categories to UI categories
    const categoryMap = {
      'language': 'Programming Languages',
      'frontend': 'Frontend Development',
      'backend': 'Backend & Databases',
      'devops': 'DevOps & Cloud',
      'framework': 'Frameworks & Libraries',
      'design': 'Design & Tools'
    };
    
    // Render each category
    Object.entries(this.categories).forEach(([category, skills]) => {
      const categoryName = categoryMap[category] || category;
      const container = document.querySelector(`[data-category="${categoryName}"] .skills-container`);
      
      if (container) {
        container.innerHTML = '';
        
        skills
          .sort((a, b) => b.order - a.order)
          .forEach(skill => {
            const skillEl = this.createSkillElement(skill);
            container.appendChild(skillEl);
          });
      }
    });
    
    // If no skills found, show empty state
    if (this.skills.length === 0) {
      this.showEmptyState();
    }
  }

  createSkillElement(skill) {
    const skillEl = document.createElement('div');
    skillEl.className = 'skill-item';
    
    skillEl.innerHTML = `
      <div class="flex justify-between mb-2">
        <span class="font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <i class="${skill.icon} ${skill.color} mr-2"></i> ${skill.name}
        </span>
        <span class="text-gray-600 dark:text-gray-400 font-medium">${skill.proficiency}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${skill.proficiency}%"></div>
      </div>
    `;
    
    return skillEl;
  }

  showEmptyState() {
    const gridContainer = document.getElementById('skills-grid');
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-laptop-code text-gray-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">No skills found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try refreshing the page or contact support.</p>
        </div>
      `;
    }
  }

  addAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
      item.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        item.classList.add('transition-all', 'duration-500', 'ease-out');
        item.classList.remove('opacity-0', 'translate-y-4');
      }, 100 + (index * 50));
    });
  }

  handleError(error) {
    console.error('Skills page error:', error);
    
    const errorContainer = document.getElementById('skills-error');
    const gridContainer = document.getElementById('skills-grid');
    
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-xl mr-2"></i>
          <span class="text-red-700">${error.message || 'Failed to load skills'}</span>
        </div>
      `;
      errorContainer.classList.remove('hidden');
    }
    
    if (gridContainer) {
      gridContainer.classList.add('hidden');
    }
  }
}

// Initialize the skills page
const skillsPage = new SkillsPage();
skillsPage.init();