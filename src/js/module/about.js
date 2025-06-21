// about.js
import { apiClient } from "@js/api/auth";
import { showError } from "@js/utils/notifications";

export default class AboutPage {
  constructor() {
    this.profileData = null;
    this.skillsData = [];
    this.workExperience = [];
    this.educationData = [];
    this.isLoading = true;
    this.init();
  }

  async init() {
    try {
      this.showLoadingState();
      await this.fetchProfileData();
      await this.fetchWorkExperience();
      await this.fetchEducationData();
      await this.fetchSkillsData();
      this.populateProfile();
      this.populateWorkExperience();
      this.populateEducation();
      this.addAnimations();
      this.populateSkills();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    this.isLoading = true;
    document.getElementById("app").classList.add("opacity-75");
  }

  hideLoadingState() {
    this.isLoading = false;
    document.getElementById("app").classList.remove("opacity-75");
  }

  async fetchProfileData() {
    try {
      const response = await apiClient.get("/api/profile/");
      if (response.data) {
        this.profileData = response.data;
      } else {
        showError("Empty profile data");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      showError(error)
    }
  }

  async fetchWorkExperience() {
    try {
      const response = await apiClient.get("/api/experience/");

      console.log(response.data);
      if (response.data?.data) {
        this.workExperience = response.data.data;
      }
    } catch (error) {
      console.error("Experience fetch error:", error);
      showError("Failed to load work experience");
    }
  }

  async fetchEducationData() {
    try {
      const response = await apiClient.get("/api/education/");
      if (response.data) {
        this.educationData = response.data.data;
      } else {
        showError("Invalid education data");
      }
    } catch (error) {
      console.error("Education fetch error:", error);
      showError("Failed to load education data");
    }
  }

  async fetchSkillsData(){
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
  "AWS": "fab fa-aws text-orange-500",
  "Android Studio": "fab fa-android text-green-600",
  "CSS": "fab fa-css3-alt text-blue-600",
  "Django": "fas fa-code text-green-700",
  "HTML5": "fab fa-html5 text-red-500",
  "Java": "fab fa-java text-red-600",
  "JavaScript": "fab fa-js text-yellow-500",
  "Kotlin": "fas fa-code text-purple-600",
  "Python": "fab fa-python text-blue-400",
  "VSCode": "fab fa-vscode text-blue-400",
  "tailwind": "fab fa-css3-alt text-teal-500",
  "React": "fab fa-react text-blue-500",
  "Node.js": "fab fa-node-js text-green-500",
  "Vue.js": "fab fa-vuejs text-green-500",
  "Express": "fas fa-server text-gray-500",
  "MongoDB": "fas fa-database text-green-700",
  "Bootstrap": "fab fa-bootstrap text-purple-600",
  "Sass": "fab fa-sass text-pink-500",
  "Git": "fab fa-git-alt text-orange-600",
  "PHP": "fab fa-php text-indigo-600",
  "Laravel": "fab fa-laravel text-red-500",
  "C++": "fas fa-code text-blue-600"
};


  // Select the container where all skill items will be appended.
  const skillsContainer = document.querySelector('.skills-container');
  if (!skillsContainer) return;  
  skillsContainer.innerHTML = '';

  // Check if skills data is available.
  if (!this.skillsData || !this.skillsData.length) {
    skillsContainer.innerHTML = '<p>No skills to display.</p>';
    return;
  }
  
  // Loop through each skill record and create a skill card.
  this.skillsData.forEach(skill => {
    // Decide the icon class:
    // If the skill name exists in defaultSkillIcons, use that.
    // Otherwise, use the API's icon, and if that is missing, fall back to a generic icon.
    const iconClass = defaultSkillIcons[skill.name] || (skill.icon ? skill.icon : "fas fa-star text-gray-400");
    
    // Create a container for the individual skill.
    const skillCard = document.createElement('div');
    skillCard.className = 'flex flex-col items-center skill-card mb-4';
    
    // Optionally add a featured class if the skill is marked as featured.
    if (skill.featured) {
      skillCard.classList.add('skill-featured');
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




  populateProfile() {
    if (!this.profileData) return;

    // Profile image
    const imgPlaceholder = document.querySelector(".profile-image-placeholder");
    if (imgPlaceholder && this.profileData.profile_image_url) {
      imgPlaceholder.outerHTML = `
        <img src="${this.profileData.profile_image_url}" 
             alt="${this.profileData.name}" 
             class="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg">
      `;
    }

    // Text content
    const nameEl = document.querySelector(".about-page h2.text-3xl");
    if (nameEl) nameEl.textContent = this.profileData.name;

    const titleEl = document.querySelector(".about-page h3.text-2xl");
    if (titleEl) titleEl.textContent = this.profileData.title;

    const bioEl = document.querySelector(".about-page p.text-lg");
    if (bioEl) bioEl.textContent = this.profileData.bio;

    // Contact info
    const contactElements = {
      email: document
        .querySelector(".about-page .contact-item .fa-envelope")
        .closest(".contact-item")
        .querySelector(".contact-details"),
      phone: document
        .querySelector(".about-page .contact-item .fa-phone")
        .closest(".contact-item")
        .querySelector(".contact-details"),
      address: document
        .querySelector(".about-page .contact-item .fa-location-dot")
        .closest(".contact-item")
        .querySelector(".contact-details"),
      status: document
        .querySelector(".my-status"),
    };

    if (contactElements.email)
      contactElements.email.textContent = this.profileData.email;
    if (contactElements.phone)
      contactElements.phone.textContent = this.profileData.phone;
    if (contactElements.address)
      contactElements.address.textContent = this.profileData.address;
    if(contactElements.status){
      contactElements.status.textContent = this.profileData.status;
    }

    // Social links
    const socialLinks = {
      github: document.querySelector(".about-page .fa-github").closest("a"),
      linkedin: document
        .querySelector(".about-page .fa-linkedin-in")
        .closest("a"),
      twitter: document.querySelector(".about-page .fa-twitter").closest("a"),
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
    const resumeBtn = document
      .querySelector(".about-page .fa-download")
      .closest("a");
    if (resumeBtn && this.profileData.resume_url) {
      resumeBtn.href = this.profileData.resume_url;
    }
  }
  populateWorkExperience() {
    const timelineContainer = document.querySelector(".timeline-container");
    if (!timelineContainer || !this.workExperience.length) return;

    // Alisin muna ang anumang existing na static timeline items
    const staticItems = timelineContainer.querySelectorAll(
      ".time-line-prototype"
    );
    staticItems.forEach((item) => item.remove());

    // I-loop ang workExperience data at i-render ang timeline entries
    this.workExperience.forEach((exp, index) => {
      const isEven = index % 2 === 0;
      const isLast = index === this.workExperience.length - 1;

      const experienceEl = document.createElement("div");
      // Idagdag ang spacing; kung last item, gumamit ng 'pb-8', kung hindi naman 'mb-16'
      experienceEl.className = `time-line-prototype flex flex-col lg:flex-row ${
        isLast ? "pb-8" : "mb-16"
      }`;

      // Component para sa company info (duration, position, company, logo)
      const infoHTML = `
      <div class="lg:w-1/2 ${
        isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"
      } mb-6 lg:mb-0">
        <div class="inline-block px-4 py-1 bg-blue-500 text-white rounded-full text-sm mb-3">${
          exp.duration
        }</div>
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white">${
          exp.position
        }</h3>
        <p class="text-xl text-blue-500 dark:text-blue-400 mb-4">${
          exp.company
        }</p>
        <div class="inline-flex justify-center ${
          isEven ? "lg:justify-end" : "lg:justify-start"
        } mb-4">
          ${
            exp.company_logo_url
              ? `<img src="${exp.company_logo_url}" alt="${exp.company}" class="w-16 h-16 object-contain">`
              : `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
          }
        </div>
      </div>
    `;

      // Component para sa timeline marker
      const markerHTML = `
      <div class="hidden lg:flex lg:w-1/2 lg:px-16 items-center justify-center">
        <div class="w-6 h-6 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 z-10"></div>
      </div>
    `;

      // Component para sa description at responsibilities
      const descHTML = `
      <div class="lg:w-1/2 lg:px-16">
        <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
          <p class="text-gray-600 dark:text-gray-300 mb-4">${
            exp.description
          }</p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2 list-disc pl-5">
            ${
              exp.responsibilities && exp.responsibilities.length
                ? exp.responsibilities
                    .map((resp) => `<li>${resp}</li>`)
                    .join("")
                : ""
            }
          </ul>
        </div>
      </div>
    `;
      if (isEven) {
        experienceEl.innerHTML = infoHTML + markerHTML + descHTML;
      } else {
        experienceEl.innerHTML = descHTML + markerHTML + infoHTML;
      }

      timelineContainer.appendChild(experienceEl);
    });
  }

  populateEducation() {
    const educationContainer = document.querySelector(".education-grid");
    if (!educationContainer || !this.educationData.length) return;

    // Pwede ding gamitin: educationContainer.innerHTML = '';
    while (educationContainer.firstChild) {
      educationContainer.removeChild(educationContainer.firstChild);
    }

    // Gumamit ng map para buuin ang HTML ng bawat education card
    const educationHTML = this.educationData
      .map(
        (edu) => `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${
              edu.degree
            }</h3>
            <p class="text-blue-500 dark:text-blue-400">${
              edu.field_of_study
            }</p>
          </div>
          ${
            edu.institution_logo_url
              ? `<img src="${edu.institution_logo_url}" alt="${edu.institution}" class="w-16 h-16 object-contain">`
              : `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>`
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
          ${
            edu.achievements
              ?.map(
                (ach) => `
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full mr-2">
              ${ach}
            </span>
          `
              )
              .join("") || ""
          }
        </div>
      </div>
    </div>
  `
      )
      .join("");

    educationContainer.innerHTML = educationHTML;
  }

  addAnimations() {
    document.querySelectorAll(".about-page > div").forEach((section, index) => {
      section.classList.add("opacity-0", "translate-y-6");
      setTimeout(() => {
        section.classList.add("transition-all", "duration-500", "ease-out");
        section.classList.remove("opacity-0", "translate-y-6");
      }, 100 + index * 150);
    });
  }

  handleError(error) {
    console.error("About page error:", error);
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

// Initialize the about page
new AboutPage();
