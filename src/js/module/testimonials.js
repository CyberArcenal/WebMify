import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";
// testimonials.js
export default class TestimonialsPage {
  constructor() {
    this.testimonials = [];
    this.gridContainer = null;
    this.init();
  }

  async init() {
    try {
      this.locateGridContainer();
      this.showLoadingState();
      await this.fetchTestimonials();
      this.renderTestimonials();
    } catch (error) {
      this.handleError(error);
    }
  }

  locateGridContainer() {
    // Hanapin ang testimonials grid container gamit ang class structure
    const gridContainers = document.querySelectorAll('.testimonials-page .grid');
    this.gridContainer = gridContainers[0];
    
    if (!this.gridContainer) {
      throw new Error('Testimonials grid container not found');
    }
  }

  showLoadingState() {
    // Magpakita ng loading indicator habang nagfe-fetch ng data
    this.gridContainer.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fa-solid fa-spinner animate-spin text-3xl text-indigo-500 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Loading testimonials...</p>
      </div>
    `;
  }

  async fetchTestimonials() {
    try {
      // Gumamit ng fetch API para kunin ang testimonials data
      const response = await apiClient.get('/api/testimonials/');      
      const data = response.data;
      
      // I-filter para sa approved testimonials lamang
      this.testimonials = data.filter(testimonial => testimonial.approved);
      
      if (this.testimonials.length === 0) {
        throw new Error('No approved testimonials found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showError(error)
    }
  }

  renderTestimonials() {
    // Linisin ang existing content
    this.gridContainer.innerHTML = '';

    // I-render ang bawat testimonial
    this.testimonials.forEach(testimonial => {
      const testimonialCard = this.createTestimonialCard(testimonial);
      this.gridContainer.appendChild(testimonialCard);
    });
  }

  createTestimonialCard(testimonial) {
    // Lumikha ng card element
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2';
    
    // Gumawa ng star rating
    const starsHtml = this.generateStarRating(testimonial.rating);
    
    // Set inner HTML gamit ang testimonial data
    card.innerHTML = `
      <div class="flex items-center mb-6">
        <div class="flex-shrink-0 mr-4">
          <img 
            class="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
            src="${testimonial.author_image_url}" 
            alt="${testimonial.author}"
            onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\"bg-gray-200 border-2 border-dashed rounded-full w-16 h-16\"></div>'"
          >
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">${testimonial.author}</h3>
          <p class="text-primary-500 dark:text-primary-400">${testimonial.author_title}</p>
        </div>
      </div>
      <div class="flex mb-4">
        ${starsHtml}
      </div>
      <p class="text-gray-600 dark:text-gray-300 italic">
        "${testimonial.content}"
      </p>
      <div class="mt-6 text-right">
        <i class="fa-solid fa-quote-right text-3xl text-gray-200 dark:text-gray-700"></i>
      </div>
    `;
    
    return card;
  }

  generateStarRating(rating) {
    // Gumawa ng HTML para sa star rating
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Buong mga bituin
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa-solid fa-star text-yellow-400"></i>';
    }
    
    // Kalahating bituin kung kinakailangan
    if (hasHalfStar) {
      starsHtml += '<i class="fa-solid fa-star-half-alt text-yellow-400"></i>';
    }
    
    // Mga bakanteng bituin
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa-regular fa-star text-yellow-400"></i>';
    }
    
    return starsHtml;
  }

  handleError(error) {
    console.error('Testimonials error:', error);
    
    // Ipakita ang error message sa UI
    this.gridContainer.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Failed to load testimonials</h3>
        <p class="text-gray-600 dark:text-gray-400">${error.message || 'Please try again later.'}</p>
        <button class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors" onclick="location.reload()">
          <i class="fa-solid fa-rotate-right mr-2"></i> Reload Page
        </button>
      </div>
    `;
  }
}

// Auto-initialize kapag na-load ang page

new TestimonialsPage();
