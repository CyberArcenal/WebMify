// contact.js
import { apiClient } from "@js/api/auth";
import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
} from "@js/utils/notifications";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class ContactPage {
  constructor() {
    this.socialLinks = null;
    this.blogLoader = document.getElementById("blog-loader");
    this.form = document.getElementById("contact-form");
    this.statusElement = document.getElementById("form-status");
    this.faqButtons = document.querySelectorAll(
      ".bg-white.rounded-xl.shadow-lg button"
    );
    this.mapContainer = document.querySelector(".map-container");
    this.contactInfoSection = document.querySelector(".contact-info-section");
  }

  init() {
    this.showLoadingState()
    if (this.form) {
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    this.setupFAQ();
    this.loadLocationData();
    this.fetchSocialLinks();
    this.hideLoadingState();
  }

  async loadLocationData() {
    try {
      // Fetch location data from API
      const response = await apiClient.get("/api/location/");
      const locationData = response.data;

      // Update contact information section
      this.updateContactInfo(locationData);

      // Initialize map with fetched coordinates
      this.initMap(locationData.coordinates, locationData.address);
    } catch (error) {
      console.error("Failed to load location data:", error);
      showError("Failed to load location information. Please try again later.");
    }
  }

  async fetchSocialLinks() {
    try {
      const response = await apiClient.get("/api/social-links/");
      this.socialLinks = response.data;

      // Update social media links
      console.log("Social links fetched:", this.socialLinks);
      this.updateSocialLinks(this.socialLinks.data);
    } catch (error) {
      console.error("Failed to load social links:", error);
      showError("Failed to load social links. Please try again later.");
    }
  }

  updateSocialLinks(links) {
  if (!links || typeof links !== "object") {
    console.warn("No social links available to update.");
    return;
  }

  // Updated mapping: gumamit lamang ng specific icon class name (e.g., "fa-linkedin-in")
  const platformMap = {
    "fa-linkedin-in": "linkedin_url",
    "fa-github": "github_url",
    "fa-twitter": "twitter_url",
    "fa-youtube": "youtube_url",
    "fa-dribbble": "dribbble_url",
    "fa-instagram": "instagram_url",
  };

  const section = document.getElementById("social-links-section");
  if (!section) {
    console.error("Social links section not found");
    return;
  }

  // Hanapin ang lahat ng <a> sa loob ng section
  const socialLinks = section.querySelectorAll("a");
  
  socialLinks.forEach(link => {
    // Hanapin ang <i> elemento sa loob ng link
    const icon = link.querySelector("i");
    if (!icon) {
      console.warn("No icon found in social link:", link);
      return;
    }
    
    // I-loop sa icon.classList para hanapin kung alin sa klase ang tumutugma sa mapping
    let platformKey = null;
    icon.classList.forEach(cls => {
      if (platformMap.hasOwnProperty(cls)) {
        platformKey = platformMap[cls];
      }
    });
    
    if (!platformKey) {
      console.warn("No matching platform key for icon:", [...icon.classList].join(" "));
      return;
    }
    
    // Kunin ang URL mula sa API response para sa platform na ito
    const url = links[platformKey] || links[platformKey.toString()]; // simplify kung iba ang key
    console.log(`Updating link for ${platformKey}: ${url}`);
    if (url && url !== "N/A") {
      link.href = url;
    } else {
      link.style.display = "none"; // Itago kung walang URL na available
    }
  });
}


  updateContactInfo(data) {
    if (!this.contactInfoSection) return;

    // Update email
    const emailElement = this.contactInfoSection.querySelector(
      '[data-field="email"]'
    );
    if (emailElement) emailElement.textContent = data.email;

    // Update phone
    const phoneElement = this.contactInfoSection.querySelector(
      '[data-field="phone"]'
    );
    if (phoneElement) phoneElement.textContent = data.phone;

    // Update address
    const addressElement = this.contactInfoSection.querySelector(
      '[data-field="address"]'
    );
    if (addressElement) addressElement.textContent = data.address;

    // Update map description
    const mapDesc = document.querySelector(".max-w-7xl.mx-auto.mb-16 .p-6 p");
    if (mapDesc)
      mapDesc.textContent = `Based in ${data.address}, but available for remote work worldwide.`;
    
    // Update availability section
    const availElement = document.getElementById("availability");
    if (availElement && data.availability) {
      const paragraphs = data.availability.split(",");
      let availabilityHtml =
        '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-1">Availability</h3>';

      paragraphs.forEach((line) => {
        if (line.trim() !== "") {
          availabilityHtml += `<p class="text-gray-600 dark:text-gray-300">${line.trim()}</p>`;
        }
      });
      availElement.innerHTML = availabilityHtml;
    } else if (!data.availability) {
      console.warn("No availability data to update.");
    }
  }

  parseCoordinates(coordStr) {
    if (!coordStr) return null;
    const parts = coordStr.split(",");
    if (parts.length !== 2) {
      console.error("Invalid coordinate string:", coordStr);
      return null;
    }
    const numbers = parts.map((part) => parseFloat(part.trim()));
    if (numbers.some((num) => isNaN(num))) {
      console.error("One or both coordinates are invalid numbers:", numbers);
      return null;
    }
    return numbers;
  }

  initMap(coordString, address) {
    const coordinates = this.parseCoordinates(coordString);
    if (!window.L) {
      console.error(
        "Leaflet library not found. Please ensure it is included in your project."
      );
      return;
    }

    if (!this.mapContainer) {
      console.error("Map container or Leaflet library not found");
      return;
    }

    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      console.error("Invalid coordinates:", coordinates);
      return;
    }

    try {
      // Clear placeholder content
      this.mapContainer.innerHTML = "";
      this.mapContainer.classList.remove(
        "bg-gray-200",
        "border-2",
        "border-dashed"
      );

      // Initialize Leaflet map
      const map = L.map(this.mapContainer).setView(coordinates, 13);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker with popup
      L.marker(coordinates).addTo(map).bindPopup(address).openPopup();
    } catch (error) {
      console.error("Map initialization error:", error);
      this.mapContainer.innerHTML =
        '<p class="p-4 text-center">Map could not be loaded</p>';
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    try {
      // Show loading state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Sending...`;

      // Send form data to API
      const response = await apiClient.post("/api/contact/", formData);

      if (response.data.success) {
        this.showSuccess(response.data.message);
        this.form.reset();
      } else {
        this.showError(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showError("Failed to send message. Please try again later.");
    } finally {
      // Reset button state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane mr-2"></i> Send Message`;
    }
  }

  showSuccess(message) {
    this.statusElement.classList.remove("hidden");
    this.statusElement.classList.remove(
      "bg-red-100",
      "text-red-800",
      "dark:bg-red-900",
      "dark:text-red-200"
    );
    this.statusElement.classList.add(
      "bg-green-100",
      "text-green-800",
      "dark:bg-green-900",
      "dark:text-green-200"
    );

    const icon = this.statusElement.querySelector("i");
    icon.className = "fa-solid fa-circle-check mr-2";

    const messageSpan = this.statusElement.querySelector("span");
    messageSpan.textContent = message;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.statusElement.classList.add("hidden");
    }, 5000);
  }

  showError(message) {
    this.statusElement.classList.remove("hidden");
    this.statusElement.classList.remove(
      "bg-green-100",
      "text-green-800",
      "dark:bg-green-900",
      "dark:text-green-200"
    );
    this.statusElement.classList.add(
      "bg-red-100",
      "text-red-800",
      "dark:bg-red-900",
      "dark:text-red-200"
    );

    const icon = this.statusElement.querySelector("i");
    icon.className = "fa-solid fa-triangle-exclamation mr-2";

    const messageSpan = this.statusElement.querySelector("span");
    messageSpan.textContent = message;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.statusElement.classList.add("hidden");
    }, 5000);
  }

  setupFAQ() {
    this.faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector("i");

        if (content.classList.contains("hidden")) {
          content.classList.remove("hidden");
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        } else {
          content.classList.add("hidden");
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        }
      });
    });
  }

  showLoadingState() {
    this.isLoading = true;
    this.blogLoader.classList.remove("hidden");
  }

  hideLoadingState() {
    this.isLoading = false;
    this.blogLoader.classList.add("hidden");
  }
}


  const contactPage = new ContactPage();
  contactPage.init();
