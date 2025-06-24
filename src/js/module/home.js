// home.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";
import {
  createProjectCard,
  showProjectModal,
  hideProjectModal,
} from "../utils/projectCard";
export default class HomePage {
  constructor() {
    this.profileData = null;
    this.featuredProjects = [];
    this.isLoading = true;
    this.skillsData = [];
  }

  async init() {
    try {
      this.showLoadingState();
      this.createProjectsSkeleton();
      // await new Promise((resolve) => setTimeout(resolve, 7000));
      await this.fetchProfileData();
      await this.fetchFeaturedProjects();
      await this.fetchSkillsData();
      this.populateProfile();
      this.populateProjects();
      this.addAnimations();
      this.populateSkills();
      this.initEventListener();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }
  // Add these new methods for skeleton handling
  createProjectsSkeleton() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = "";

    // Create 3 skeleton cards
    for (let i = 0; i < 3; i++) {
      const skeletonCard = this.createSkeletonCard();
      container.appendChild(skeletonCard);
    }
  }

  createSkeletonCard() {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden animate-pulse";

    card.innerHTML = `
      <div class="h-48 bg-gray-200 dark:bg-gray-600"></div>
      <div class="p-6">
        <div class="h-7 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
        <div class="space-y-2 mb-5">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
        </div>
      </div>
    `;

    return card;
  }
  showLoadingState() {
    this.isLoading = true;
    document.getElementById("app").classList.add("opacity-75");
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById("app").classList.remove("opacity-75");
  }

  initEventListener() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".view-project-btn")) {
        const card = e.target.closest(".project-card");
        const projectId = card.getAttribute("data-projectId");
        const project = this.featuredProjects.find((p) => p.id == projectId);

        // if (project) {
        //   this.showProjectModal(project);
        // }

        window.location.href = `#project-detail/${projectId}`;
      }
    });

    document.addEventListener("click", (e) => {
      // Handle Read More clicks
      if (e.target.closest(".read-more")) {
        e.preventDefault();
        const readMore = e.target.closest(".read-more");
        const projectId = readMore.dataset.id;
        const project = this.featuredProjects.find((p) => p.id == projectId);
        console.log(project);
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
  async fetchProfileData() {
    try {
      const response = await apiClient.get("/api/profile/");
      if (response.data) {
        console.log(response.data);
        this.profileData = response.data;
      } else {
        throw new Error("Empty profile data");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw new Error("Failed to load profile data");
    }
  }

  async fetchFeaturedProjects() {
    try {
      const response = await apiClient.get("/api/projects/?featured=true");
      if (response.data?.status && Array.isArray(response.data.data)) {
        this.featuredProjects = response.data.data;
      } else {
        throw new Error("Invalid projects data");
      }
    } catch (error) {
      console.error("Projects fetch error:", error);
      throw new Error("Failed to load featured projects");
    }
  }

  populateProfile() {
    if (!this.profileData) return;

    const elements = {
      name: document.getElementById("profile-name"),
      title: document.getElementById("profile-title"),
      bio: document.getElementById("profile-bio"),
      email: document.getElementById("profile-email"),
      phone: document.getElementById("profile-phone"),
      address: document.getElementById("profile-address"),
      resume: document.getElementById("resume-button"),
      github: document.getElementById("github-link"),
      linkedin: document.getElementById("linkedin-link"),
      twitter: document.getElementById("twitter-link"),
      image: document.getElementById("profile-image-placeholder"),
    };
    // Function to remove placeholder styling
    const removePlaceholderClasses = (element) => {
      element.classList.remove(
        "animate-pulse",
        "bg-gray-300",
        "dark:bg-gray-700",
        "rounded",
        "h-10",
        "h-8",
        "h-24",
        "h-5",
        "w-64",
        "w-48",
        "w-full",
        "w-40",
        "w-32",
        "inline-block"
      );
      element.style.height = "";
      element.style.width = "";
    };
    // Text content
    // Remove placeholder classes and set real data
    elements.name.textContent = this.profileData.name;
    removePlaceholderClasses(elements.name);

    elements.title.textContent = this.profileData.title;
    removePlaceholderClasses(elements.title);

    elements.bio.textContent = this.profileData.bio;
    removePlaceholderClasses(elements.bio);

    elements.email.textContent = this.profileData.email;
    removePlaceholderClasses(elements.email);

    elements.phone.textContent = this.profileData.phone;
    removePlaceholderClasses(elements.phone);

    elements.address.textContent = this.profileData.address;
    removePlaceholderClasses(elements.address);

    // Links
    elements.resume.href = this.profileData.resume_url;
    elements.github.href = this.profileData.github_url;
    elements.linkedin.href = this.profileData.linkedin_url;
    elements.twitter.href = this.profileData.twitter_url;

    // Profile image
    if (this.profileData.profile_image_url) {
      const img = document.createElement("img");
      img.src = this.profileData.profile_image_url;
      img.alt = this.profileData.name;
      img.className =
        "rounded-xl w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg";

      // Replace placeholder with actual image
      elements.image.replaceWith(img);
    }
  }

  populateProjects() {
    const container = document.getElementById("projects-container"); // Updated selector
    if (!container) return;

    container.innerHTML = "";

    if (this.featuredProjects.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-folder-open text-gray-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">No projects found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try changing your filters or check back later.</p>
        </div>
      `;
      return;
    }

    this.featuredProjects.forEach((project) => {
      const projectCard = createProjectCard(project);
      container.appendChild(projectCard);

      // Remove animation classes immediately after appending
      setTimeout(() => {
        projectCard.classList.add("transition-all", "duration-500", "ease-out");
        projectCard.classList.remove("opacity-0", "translate-y-6");
      }, 10);
    });
  }

  addAnimations() {
    document
      .querySelectorAll(
        ".hero > div > div, .featured-projects, .skills-preview"
      )
      .forEach((section, index) => {
        section.classList.add("opacity-0", "translate-y-6");
        setTimeout(() => {
          section.classList.add("transition-all", "duration-500", "ease-out");
          section.classList.remove("opacity-0", "translate-y-6");
        }, 100 + index * 150);
      });
  }

  async fetchSkillsData() {
    try {
      const response = await apiClient.get("/api/skills/");
      if (response.data) {
        this.skillsData = response.data.data;
      } else {
        showError("Invalid skills data");
      }
    } catch (error) {
      console.error("Skills fetch error:", error);
      showError("Failed to load skills data");
    }
  }
  populateSkills() {
    // Define a mapping for default icons based on the skill name.
    const defaultSkillIcons = {
      AWS: "fab fa-aws text-orange-500",
      "Android Studio": "fab fa-android text-green-600",
      CSS: "fab fa-css3-alt text-blue-600",
      Django: "fas fa-code text-green-700",
      HTML5: "fab fa-html5 text-red-500",
      Java: "fab fa-java text-red-600",
      JavaScript: "fab fa-js text-yellow-500",
      Kotlin: "fas fa-code text-purple-600",
      Python: "fab fa-python text-blue-400",
      VSCode: "fab fa-vscode text-blue-400",
      tailwind: "fab fa-css3-alt text-teal-500",
      React: "fab fa-react text-blue-500",
      "Node.js": "fab fa-node-js text-green-500",
      "Vue.js": "fab fa-vuejs text-green-500",
      Express: "fas fa-server text-gray-500",
      MongoDB: "fas fa-database text-green-700",
      Bootstrap: "fab fa-bootstrap text-purple-600",
      Sass: "fab fa-sass text-pink-500",
      Git: "fab fa-git-alt text-orange-600",
      PHP: "fab fa-php text-indigo-600",
      Laravel: "fab fa-laravel text-red-500",
      "C++": "fas fa-code text-blue-600",
    };

    // Select the container where all skill items will be appended.
    const skillsContainer = document.querySelector(".skills-container");
    if (!skillsContainer) return;
    skillsContainer.innerHTML = "";

    // Check if skills data is available.
    if (!this.skillsData || !this.skillsData.length) {
      skillsContainer.innerHTML = "<p>No skills to display.</p>";
      return;
    }

    // Loop through each skill record and create a skill card.
    this.skillsData.forEach((skill) => {
      // Decide the icon class:
      // If the skill name exists in defaultSkillIcons, use that.
      // Otherwise, use the API's icon, and if that is missing, fall back to a generic icon.
      const iconClass =
        defaultSkillIcons[skill.name] ||
        (skill.icon ? skill.icon : "fas fa-star text-gray-400");

      // Create a container for the individual skill.
      const skillCard = document.createElement("div");
      skillCard.className = "flex flex-col items-center skill-card mb-4";

      // Optionally add a featured class if the skill is marked as featured.
      if (skill.featured) {
        skillCard.classList.add("skill-featured");
      }

      // Build the inner HTML for the skill card.
      // It includes a circular icon, the skill name, category, and a progress bar for proficiency.
      skillCard.innerHTML = `
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 skill-icon">
        <i class="${iconClass} text-4xl"></i>
      </div>
      <span class="skill-name font-medium text-gray-800 dark:text-gray-200">${skill.name}</span>
      <span class="skill-category text-sm text-gray-500 dark:text-gray-400">${skill.category}</span>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${skill.proficiency}%;"></div>
      </div>
    `;

      // Append the constructed skill card to the container.
      skillsContainer.appendChild(skillCard);
    });
  }
  handleError(error) {
    console.error("Home page error:", error);
    showError("Failed to load page content");

    // Show error notification
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center";
    notification.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      <span>Failed to load content. Please refresh the page.</span>
      <button class="ml-4 text-white hover:text-gray-200 close-error">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    document.body.appendChild(notification);

    notification.querySelector(".close-error").addEventListener("click", () => {
      notification.remove();
    });
  }
}

// Initialize the home page
const homePage = new HomePage();
homePage.init();
