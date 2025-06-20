// contact.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class ContactPage {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.statusElement = document.getElementById('form-status');
    this.faqButtons = document.querySelectorAll('.bg-white.rounded-xl.shadow-lg button');
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    this.setupFAQ();
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      // Show loading state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Sending...`;
      
      // Send form data to API
      const response = await apiClient.post('/api/contact/', formData);
      
      if (response.data.status) {
        this.showSuccess(response.data.message);
        this.form.reset();
      } else {
        this.showError(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Failed to send message. Please try again later.');
    } finally {
      // Reset button state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane mr-2"></i> Send Message`;
    }
  }

  showSuccess(message) {
    this.statusElement.classList.remove('hidden');
    this.statusElement.classList.remove('bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-200');
    this.statusElement.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-200');
    
    const icon = this.statusElement.querySelector('i');
    icon.className = 'fa-solid fa-circle-check mr-2';
    
    const messageSpan = this.statusElement.querySelector('span');
    messageSpan.textContent = message;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.statusElement.classList.add('hidden');
    }, 5000);
  }

  showError(message) {
    this.statusElement.classList.remove('hidden');
    this.statusElement.classList.remove('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-200');
    this.statusElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-200');
    
    const icon = this.statusElement.querySelector('i');
    icon.className = 'fa-solid fa-triangle-exclamation mr-2';
    
    const messageSpan = this.statusElement.querySelector('span');
    messageSpan.textContent = message;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.statusElement.classList.add('hidden');
    }, 5000);
  }

  setupFAQ() {
    this.faqButtons.forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        } else {
          content.classList.add('hidden');
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        }
      });
    });
  }
}

// Initialize the contact page
const contactPage = new ContactPage();
contactPage.init();