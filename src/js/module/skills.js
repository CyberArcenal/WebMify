// skills.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

// Constants for category templates
const CATEGORY_TEMPLATES = {
  language: {
    title: 'Programming Languages',
    icon: 'fa-code',
    color: 'text-indigo-500'
  },
  frontend: {
    title: 'Frontend Development',
    icon: 'fa-palette',
    color: 'text-blue-500'
  },
  backend: {
    title: 'Backend & Databases',
    icon: 'fa-database',
    color: 'text-green-500'
  },
  devops: {
    title: 'DevOps & Cloud',
    icon: 'fa-cloud',
    color: 'text-yellow-500'
  },
  framework: {
    title: 'Frameworks & Libraries',
    icon: 'fa-cubes',
    color: 'text-purple-500'
  },
  design: {
    title: 'Design & Tools',
    icon: 'fa-screwdriver-wrench',
    color: 'text-pink-500'
  }
};

export default class SkillsPage {
  constructor() {
    this.featuredSkills = [];
    this.additionalSkills = [];
    this.categories = {};
    this.isLoading = true;
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchSkills();
      this.processSkillsData();
      this.clearPrototypeSkills();
      this.renderFeaturedSkills();
      this.renderAdditionalSkills();
      this.addAnimations();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    this.isLoading = true;
    document.getElementById("app").classList.add("opacity-75");
    const loader = document.getElementById("skills-loader");
    if (loader) loader.classList.remove("hidden");
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById("app").classList.remove("opacity-75");
    const loader = document.getElementById("skills-loader");
    if (loader) loader.classList.add("hidden");
  }

  clearPrototypeSkills() {
    const skillContainers = document.querySelectorAll('.skills-container');
    skillContainers.forEach(container => {
      container.innerHTML = '';
    });
    
    const categoryCards = document.querySelectorAll('[data-category]');
    categoryCards.forEach(card => {
      card.style.display = 'none';
    });
  }

  async fetchSkills() {
    try {
      const response = await apiClient.get("/api/skills/?page=1&page_size=50");

      if (response.data?.status) {
        this.featuredSkills = response.data.data.filter(skill => skill.featured);
        this.additionalSkills = response.data.data.filter(skill => !skill.featured);
      } else {
        throw new Error("Failed to load skills: Invalid API response");
      }
    } catch (error) {
      console.error("Skills fetch error:", error);
      throw new Error("Failed to load skills. Please try again later.");
    }
  }

  processSkillsData() {
    this.categories = {};
    
    this.featuredSkills.forEach(skill => {
      if (!this.categories[skill.category]) {
        this.categories[skill.category] = [];
      }
      this.categories[skill.category].push(skill);
    });
  }

  renderFeaturedSkills() {
    const gridContainer = document.getElementById('skills-grid');
    if (!gridContainer) return;
    
    Object.entries(this.categories).forEach(([category, skills]) => {
      const template = CATEGORY_TEMPLATES[category];
      if (!template) return;
      
      let card = this.getOrCreateCategoryCard(category, gridContainer);
      this.renderSkillsInCard(card, skills);
    });
    
    if (this.featuredSkills.length === 0) {
      this.showEmptyState();
    }
  }

  getOrCreateCategoryCard(category, gridContainer) {
    const template = CATEGORY_TEMPLATES[category];
    if (!template) return null;
    
    let card = document.querySelector(`[data-category="${template.title}"]`);
    
    if (!card) {
      card = this.createCategoryCard(category);
      gridContainer.appendChild(card);
    }
    
    card.style.display = 'block';
    return card;
  }

  createCategoryCard(category) {
    const template = CATEGORY_TEMPLATES[category];
    if (!template) return null;
    
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6';
    card.dataset.category = template.title;
    
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <div class="mr-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 p-3 rounded-lg">
          <i class="fa-solid ${template.icon} text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">${template.title}</h3>
      </div>
      <div class="space-y-5 skills-container"></div>
    `;
    
    return card;
  }

  renderSkillsInCard(card, skills) {
    const container = card.querySelector('.skills-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    skills
      .sort((a, b) => b.order - a.order)
      .forEach(skill => {
        container.appendChild(this.createSkillElement(skill));
      });
  }

  createSkillElement(skill) {
    const skillEl = document.createElement('div');
    skillEl.className = 'skill-item opacity-0 translate-y-4';
    
    const template = CATEGORY_TEMPLATES[skill.category];
    const color = template?.color || 'text-gray-500';
    const icon = skill.icon || 'fa-solid fa-code';
    
    skillEl.innerHTML = `
      <div class="flex justify-between mb-2">
        <span class="font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <i class="${icon} ${color} mr-2"></i> ${skill.name}
        </span>
        <span class="text-gray-600 dark:text-gray-400 font-medium">${skill.proficiency}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${skill.proficiency}%"></div>
      </div>
    `;
    
    return skillEl;
  }

  renderAdditionalSkills() {
    const container = document.querySelector('.additional-skills-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.additionalSkills.forEach(skill => {
      container.appendChild(this.createAdditionalSkillElement(skill));
    });
    
    this.toggleAdditionalSkillsSection();
  }

  createAdditionalSkillElement(skill) {
    const skillEl = document.createElement('div');
    skillEl.className = 'px-5 py-3 bg-white dark:bg-gray-700 rounded-lg shadow flex items-center';
    
    const color = CATEGORY_TEMPLATES[skill.category]?.color || 'text-gray-500';
    const icon = skill.icon || 'fa-solid fa-code';
    
    skillEl.innerHTML = `
      <i class="${icon} text-xl mr-2 ${color}"></i>
      <span>${skill.name}</span>
    `;
    
    return skillEl;
  }

  toggleAdditionalSkillsSection() {
    const section = document.querySelector('.additional-skills-section');
    if (section) {
      section.style.display = this.additionalSkills.length > 0 ? 'block' : 'none';
    }
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