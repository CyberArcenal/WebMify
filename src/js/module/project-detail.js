import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";
import {
  createProjectCard,
  showProjectModal,
  hideProjectModal,
} from "../utils/projectCard";
export default class ProjectDetailPage {
  constructor() {
    this.projectData = null;
    this.isLoading = true;
    this.projectId = this.getProjectIdFromUrl();
    this.relatedProjects = [];
    this.categoryColors = {
      frontend: {
        bg: "bg-blue-100",
        darkBg: "dark:bg-blue-900",
        text: "text-blue-500",
      },
      backend: {
        bg: "bg-green-100",
        darkBg: "dark:bg-green-900",
        text: "text-green-500",
      },
      database: {
        bg: "bg-blue-100",
        darkBg: "dark:bg-blue-900",
        text: "text-blue-500",
      },
      cloud: {
        bg: "bg-yellow-100",
        darkBg: "dark:bg-yellow-900",
        text: "text-yellow-500",
      },
    };
  }

  getProjectIdFromUrl() {
    const hash = window.location.hash;
    if (hash.startsWith("#project-detail/")) {
      return hash.split("/").pop();
    }
    return null;
  }

  async init() {
    if (!this.projectId) {
      this.handleError(new Error("Invalid project ID"));
      return;
    }

    try {
      this.showLoadingState();
      await this.fetchProjectData();
      await this.fetchRelatedProjects();
      this.renderProjectDetails();
      this.updatePageMetadata();
      this.addAnimations();
      this.initEventListener();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }
  initEventListener() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".view-project-btn")) {
        const card = e.target.closest(".project-card");
        const projectId = card.getAttribute("data-projectId");
        const project = this.relatedProjects.find((p) => p.id == projectId);

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
        const project = this.relatedProjects.find((p) => p.id == projectId);
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
  showLoadingState() {
    this.isLoading = true;
    document.getElementById("app").classList.add("opacity-75");
    const loader = document.getElementById("project-loader");
    if (loader) loader.classList.remove("hidden");
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById("app").classList.remove("opacity-75");
    const loader = document.getElementById("project-loader");
    if (loader) loader.classList.add("hidden");
  }

  async fetchProjectData() {
    try {
      const response = await apiClient.get(`/api/projects/${this.projectId}/`);
      if (response.data) {
        this.projectData = response.data;

        // Remove hardcoded values - use API data directly
        this.projectData.development_time =
          this.projectData.development_time || "";
        this.projectData.client = this.projectData.client || "";

        // Use impact_stats from API
        this.projectData.impact_stats = this.projectData.impact_stats || {
          sales_increase: "",
          load_time: "",
          users: "",
          test_coverage: "",
        };

        // Use testimonial from API
        this.projectData.testimonial = this.projectData.testimonial || null;
      } else {
        throw new Error("Project data not found");
      }
    } catch (error) {
      console.error("Project fetch error:", error);
      throw new Error("Failed to load project details");
    }
  }

  async fetchRelatedProjects() {
    try {
      // This should come from your backend API
      const response = await apiClient.get(
        `/api/projects/?exclude=${this.projectId}&limit=3`
      );
      if (response.data?.data) {
        this.relatedProjects = response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch related projects:", error);
    }
  }

  renderProjectDetails() {
    if (!this.projectData) return;
    // Update sidebar details with API data
    const sidebarDate = document.getElementById("sidebar-completion-date");
    if (sidebarDate) {
      sidebarDate.textContent = this.formatDate(this.projectData.created_at);
    }

    // Client and development time
    const detailsContainer = document.querySelector(
      "#project-details-sidebar .space-y-4"
    );
    if (detailsContainer) {
      const clientEl =
        detailsContainer.children[3]?.querySelector("p:last-child");
      if (clientEl) clientEl.textContent = this.projectData.client || "N/A";

      const devTimeEl =
        detailsContainer.children[2]?.querySelector("p:last-child");
      if (devTimeEl)
        devTimeEl.textContent = this.projectData.development_time || "N/A";
    }

    // Update project overview
    this.renderProjectOverview();

    // Update technology stack
    this.renderTechStack();

    // Update project gallery
    this.renderProjectGallery();
    // Update hero section
    const typeBadge = document.getElementById("project-type-badge");
    if (typeBadge) {
      typeBadge.textContent = this.formatProjectType(
        this.projectData.project_type
      );
    }

    const titleEl = document.getElementById("project-title");
    if (titleEl) titleEl.textContent = this.projectData.title;

    const heroDesc = document.getElementById("project-hero-description");
    if (heroDesc) {
      heroDesc.textContent =
        this.projectData.description.length > 150
          ? this.projectData.description.substring(0, 150) + "..."
          : this.projectData.description;
    }

    // Update main image
    const mainImgContainer = document.getElementById("project-main-image");
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
    const sidebarType = document.getElementById("sidebar-project-type");
    if (sidebarType)
      sidebarType.textContent = this.formatProjectType(
        this.projectData.project_type
      );

    // Update technologies
    const techContainer = document.getElementById("sidebar-technologies");
    if (techContainer && this.projectData.technologies_list) {
      techContainer.innerHTML = "";
      this.projectData.technologies_list.forEach((tech) => {
        const span = document.createElement("span");
        span.className =
          "px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full";
        span.textContent = tech;
        techContainer.appendChild(span);
      });
    }

    // Update links
    const demoLink = document.getElementById("project-demo-link");
    if (demoLink && this.projectData.demo_url) {
      demoLink.href = this.projectData.demo_url;
    } else if (demoLink) {
      demoLink.style.display = "none";
    }

    const sourceLink = document.getElementById("project-source-link");
    if (sourceLink && this.projectData.source_code_url) {
      sourceLink.href = this.projectData.source_code_url;
    } else if (sourceLink) {
      sourceLink.style.display = "none";
    }

    // Update project overview
    this.renderProjectOverview();

    // Update technology stack (static for now)
    // This should come from backend if available

    // Update project gallery (static for now)
    // This should come from backend if available

    // Update project impact stats
    this.renderImpactStats();

    // Update testimonial
    this.renderTestimonial();

    // Update related projects
    this.renderRelatedProjects();
  }

  renderProjectOverview() {
    const overviewContainer = document.querySelector(
      "#project-overview .prose"
    );
    if (!overviewContainer || !this.projectData) return;

    // Features list
    let featuresHTML = "";
    if (this.projectData.features && this.projectData.features.length > 0) {
      featuresHTML = `
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
          Key Features
        </h3>
        <ul class="text-gray-600 dark:text-gray-300 mb-6 pl-5 list-disc space-y-2">
          ${this.projectData.features
            .map((feat) => `<li>${feat}</li>`)
            .join("")}
        </ul>
      `;
    }

    // Challenges & Solutions
    let challengesHTML = "";
    if (this.projectData.challenges || this.projectData.solutions) {
      challengesHTML = `
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
          Challenges & Solutions
        </h3>
        ${
          this.projectData.challenges
            ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${this.projectData.challenges}</p>`
            : ""
        }
        ${
          this.projectData.solutions
            ? `<p class="text-gray-600 dark:text-gray-300">${this.projectData.solutions}</p>`
            : ""
        }
      `;
    }

    overviewContainer.innerHTML = `
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        ${this.projectData.description}
      </p>
      ${featuresHTML}
      ${challengesHTML}
    `;
  }
  getIconClass(name, category) {
    const iconMap = {
      Django: "fa-brands fa-python",
      Vite: "fa-solid fa-bolt",
      Tailwind: "fa-solid fa-wind",
      CSS: "fa-brands fa-css3-alt",
      HTML: "fa-brands fa-html5",
      JavaScript: "fa-brands fa-js",
      React: "fa-brands fa-react",
      "Node.js": "fa-brands fa-node-js",
      PostgreSQL: "fa-solid fa-database",
      AWS: "fa-brands fa-aws",
      Redis: "fa-solid fa-database",
    };

    return (
      iconMap[name] ||
      (category === "database" ? "fa-solid fa-database" : "fa-solid fa-code")
    );
  }
  renderProjectGallery() {
    const container = document.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.gap-6"
    );
    if (!container || !this.projectData.gallery_images) return;

    container.innerHTML = "";

    this.projectData.gallery_images.slice(0, 4).forEach((image) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "rounded-xl overflow-hidden h-64";
      galleryItem.innerHTML = `
        <img src="${image.image_url}" 
             alt="Project gallery image" 
             class="w-full h-full object-cover">
      `;
      container.appendChild(galleryItem);
    });
  }
  renderTechStack() {
    const container = document.querySelector(
      ".grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.gap-6"
    );
    if (!container || !this.projectData.tech_stack_details) return;

    container.innerHTML = "";

    this.projectData.tech_stack_details.forEach((tech) => {
      const colors =
        this.categoryColors[tech.category] || this.categoryColors.frontend;
      const iconClass = this.getIconClass(tech.name, tech.category);

      const techEl = document.createElement("div");
      techEl.className =
        "flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow";
      techEl.innerHTML = `
        <div class="w-16 h-16 rounded-full ${colors.bg} ${colors.darkBg} flex items-center justify-center mb-3">
          <i class="${iconClass} text-3xl ${colors.text}"></i>
        </div>
        <span class="font-medium text-gray-800 dark:text-white">${tech.name}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">${tech.category}</span>
      `;
      container.appendChild(techEl);
    });
  }

  renderImpactStats() {
    const statsContainer = document.querySelector(".project-impact-container");
    if (!statsContainer) return;

    // Siguraduhin na mayroong impact_stats object, o gamitin ang empty object bilang fallback.
    const stats = this.projectData.impact_stats || {};

    // Helper function upang ma-determina kung ang value ay valid o dapat palitan ng "No data".
    function valueOrDefault(val) {
      // Kung ang val ay null o undefined, o kung ito ay isang string ngunit walang laman (o puro whitespace),
      // ibabalik ang "No data". Kung hindi, ibabalik nito ang original na value.
      if (val == null || (typeof val === "string" && val.trim() === "")) {
        return "N/A";
      }
      return val;
    }

    const salesIncrease = valueOrDefault(stats.sales_increase);
    const loadTime = valueOrDefault(stats.load_time);
    const users = valueOrDefault(stats.users);
    const testCoverage = valueOrDefault(stats.test_coverage);

    statsContainer.innerHTML = `
    <div class="flex items-center">
      <div class="mr-4 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 p-3 rounded-lg">
        <i class="fa-solid fa-chart-line text-xl"></i>
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">
          ${salesIncrease}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Increase in online sales
        </p>
      </div>
    </div>
    
    <div class="flex items-center">
      <div class="mr-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
        <i class="fa-solid fa-bolt text-xl"></i>
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">
          ${loadTime}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Average page load time
        </p>
      </div>
    </div>
    
    <div class="flex items-center">
      <div class="mr-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-3 rounded-lg">
        <i class="fa-solid fa-users text-xl"></i>
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">
          ${users}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Monthly active users
        </p>
      </div>
    </div>
    
    <div class="flex items-center">
      <div class="mr-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg">
        <i class="fa-solid fa-code text-xl"></i>
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">
          ${testCoverage}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Test coverage
        </p>
      </div>
    </div>
  `;
  }

  renderTestimonial() {
    if (!this.projectData.testimonial) {
      // Hide testimonial section if none exists
      const testimonialSection = document.querySelector(
        ".bg-gray-100.dark\\:bg-gray-800"
      );
      if (testimonialSection) testimonialSection.style.display = "none";
      return;
    }
    if (!this.projectData.testimonial) return;

    const testimonialContainer = document.querySelector(
      ".bg-gray-100.dark\\:bg-gray-800"
    );
    if (!testimonialContainer) return;

    testimonialContainer.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center justify-center bg-white/20 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full p-4 mb-6">
          <i class="fa-solid fa-quote-right text-2xl"></i>
        </div>
        <p class="text-2xl text-gray-800 dark:text-white italic max-w-3xl mx-auto mb-6">
          "${this.projectData.testimonial.content}"
        </p>
        <div class="flex items-center justify-center">
          <div class="mr-4">
            <div class="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16"></div>
          </div>
          <div class="text-left">
            <h4 class="font-bold text-gray-800 dark:text-white">${this.projectData.testimonial.author}</h4>
            <p class="text-primary-500 dark:text-primary-400">
              ${this.projectData.testimonial.position}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderRelatedProjects() {
    const container = document.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8"
    );
    if (!container) return;

    container.innerHTML = "";

    if (this.relatedProjects.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-folder-open text-gray-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">No projects found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try changing your filters or check back later.</p>
        </div>
      `;
      return;
    }

    this.relatedProjects.forEach((project) => {
      const projectCard = createProjectCard(project);
      container.appendChild(projectCard);

      // Remove animation classes immediately after appending
      setTimeout(() => {
        projectCard.classList.add("transition-all", "duration-500", "ease-out");
        projectCard.classList.remove("opacity-0", "translate-y-6");
      }, 10);
    });
  }

  formatProjectType(type) {
    const typeMap = {
      web: "Web Application",
      mobile: "Mobile Application",
      "open-source": "Open Source",
      design: "Design Project",
      other: "Other Project",
    };
    return typeMap[type] || type;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  updatePageMetadata() {
    if (!this.projectData) return;

    // Update page title
    document.title = `${this.projectData.title} | Project Details`;

    // Update Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.projectData.title;

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription)
      ogDescription.content = this.projectData.description.substring(0, 150);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && this.projectData.image_url) {
      ogImage.content = this.projectData.image_url;
    }
  }

  addAnimations() {
    const elementsToAnimate = [
      document.getElementById("project-hero-section"),
      document.getElementById("project-main-image"),
      document.getElementById("project-overview"),
      document.getElementById("project-details-sidebar"),
      document.querySelector(".bg-gray-100.dark\\:bg-gray-800"),
      document.querySelector(
        ".max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-16"
      ),
    ];

    elementsToAnimate.forEach((el, index) => {
      if (el) {
        el.classList.add("opacity-0", "translate-y-6");
        setTimeout(() => {
          el.classList.add("transition-all", "duration-500", "ease-out");
          el.classList.remove("opacity-0", "translate-y-6");
        }, 100 + index * 150);
      }
    });
  }

  handleError(error) {
    console.error("ProjectDetail error:", error);

    const errorContainer = document.getElementById("project-error");
    const contentContainer = document.getElementById(
      "project-content-container"
    );

    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-800 mb-2">Failed to load project details</h3>
          <p class="text-red-600 mb-4">${
            error.message || "Please try again later"
          }</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            <i class="fa-solid fa-rotate-right mr-2"></i> Reload Page
          </button>
        </div>
      `;
      errorContainer.classList.remove("hidden");
    }

    if (contentContainer) {
      contentContainer.classList.add("hidden");
    }
  }
}

// Initialize the project detail page
const projectDetailPage = new ProjectDetailPage();
projectDetailPage.init();
