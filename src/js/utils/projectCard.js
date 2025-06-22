export function createProjectCard(project) {
  // Map project types to Tailwind classes
  const typeClasses = {
    web: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
    },
    mobile: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
    },
    "open-source": {
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-200",
    },
    default: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-200",
    },
  };

  const typeClass = typeClasses[project.project_type] || typeClasses.default;

  // Format technologies as tags
  const techTags = project.technologies_list
    .map(
      (tech) =>
        `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">${tech}</span>`
    )
    .join("");

  const maxDescLength = 120;
  const displayDescription =
    project.description.length > maxDescLength
      ? project.description.substring(0, maxDescLength) + "..."
      : project.description;

  // Determine demo link text and icon based on project type
  let demoText = "Live Demo";
  let demoIcon =
    '<i class="fa-solid fa-arrow-up-right-from-square ml-1 text-sm"></i>';
  if (project.project_type === "mobile") {
    demoText = "App Store";
    demoIcon = '<i class="fa-brands fa-app-store-ios ml-1"></i>';
  }

  const card = document.createElement("div");
  card.className =
    "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl opacity-0 translate-y-6 project-card group";
  card.setAttribute("data-projectId", `${project.id}`);

  card.innerHTML = `
    <div class="relative">
      <div class="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        ${
          project.image_url
            ? `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">`
            : `<div class="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-full"></div>`
        }
        <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="view-project-btn px-5 py-2 bg-white text-primary-500 font-medium rounded-full shadow-md hover:bg-gray-100 transition-colors">
            View Project
          </button>
        </div>
        ${
          project.featured
            ? `
          <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            Featured
          </div>
        `
            : ""
        }
      </div>
      
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">${
            project.title
          }</h3>
          <span class="text-xs px-2 py-1 ${typeClass.bg} ${
    typeClass.text
  } rounded-full">
            ${
              project.project_type === "web"
                ? "Web App"
                : project.project_type === "mobile"
                ? "Mobile"
                : project.project_type === "open-source"
                ? "Open Source"
                : project.project_type
            }
          </span>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-3">
          ${displayDescription}
          ${
            project.description.length > maxDescLength
              ? `
            <span class="text-primary-500 dark:text-primary-400 cursor-pointer font-medium read-more" data-id="${project.id}">
              Read More
            </span>
          `
              : ""
          }
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${techTags}
        </div>
        <div class="flex justify-between">
          ${
            project.demo_url
              ? `
            <a href="${project.demo_url}" target="_blank" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
              ${demoText}
              ${demoIcon}
            </a>
          `
              : ""
          }
          ${
            project.source_code_url
              ? `
            <a href="${project.source_code_url}" target="_blank" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Source Code
              <i class="fab fa-github ml-1"></i>
            </a>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  return card;
}

export function showProjectModal(project) {
  // Define type classes again for modal scope
  const typeClasses = {
    web: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
    },
    mobile: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
    },
    "open-source": {
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-200",
    },
    default: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-200",
    },
  };

  const typeClass = typeClasses[project.project_type] || typeClasses.default;

  // Determine demo text for modal
  let demoText = "Live Demo";
  if (project.project_type === "mobile") {
    demoText = "App Store";
  }

  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("project-modal-content");

  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">${
            project.title
          }</h3>
          <button class="close-modal text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div class="mb-6">
          <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
            ${
              project.image_url
                ? `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover rounded-lg">`
                : `<div class="bg-gray-200 border-2 border-dashed rounded-lg w-full h-full"></div>`
            }
          </div>
          
          <div class="flex items-center mb-4">
            <span class="px-3 py-1 ${typeClass.bg} ${
    typeClass.text
  } rounded-full text-sm font-medium mr-4">
              ${
                project.project_type === "web"
                  ? "Web App"
                  : project.project_type === "mobile"
                  ? "Mobile"
                  : project.project_type === "open-source"
                  ? "Open Source"
                  : project.project_type
              }
            </span>
            ${
              project.featured
                ? `
              <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                Featured Project
              </span>
            `
                : ""
            }
          </div>
          
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            ${project.description}
          </p>
          
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Technologies Used</h4>
            <div class="flex flex-wrap gap-2">
              ${project.technologies_list
                .map(
                  (tech) =>
                    `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">${tech}</span>`
                )
                .join("")}
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4">
            ${
              project.demo_url
                ? `
              <a href="${project.demo_url}" target="_blank" class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                ${demoText}
                <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
              </a>
            `
                : ""
            }
            ${
              project.source_code_url
                ? `
              <a href="${project.source_code_url}" target="_blank" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Source Code
                <i class="fab fa-github ml-2"></i>
              </a>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
  document.querySelector(".close-modal")?.addEventListener("click", () => {
    this.hideProjectModal();
  });
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
  }, 10);
}
export function hideProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.classList.add("opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}





export function createBlogCard(blog, isFeatured = false) {
  const card = document.createElement('div');
  
  if (isFeatured) {
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl';
    card.innerHTML = `
      <div class="relative h-48">
        ${blog.imageURL 
          ? `<img src="${blog.imageURL}" alt="${blog.title}" class="w-full h-full object-cover">`
          : `<div class="bg-gray-200 border-2 border-dashed w-full h-full"></div>`
        }
        ${blog.featured ? `
          <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>` : ''
        }
      </div>
      <div class="p-6">
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span class="mr-4">${blog.publishDate}</span>
          <span><i class="fa-regular fa-eye mr-1"></i> ${blog.views} views</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${blog.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${blog.summary}</p>
        <a href="#blog-detail/${blog.slug}" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
          Read more
          <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    `;
  } else {
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:flex';
    card.innerHTML = `
      <div class="md:w-1/3">
        ${blog.imageURL 
          ? `<img src="${blog.imageURL}" alt="${blog.title}" class="w-full h-64 md:h-full object-cover">`
          : `<div class="bg-gray-200 border-2 border-dashed w-full h-64 md:h-full"></div>`
        }
      </div>
      <div class="p-6 md:w-2/3">
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span class="mr-4">${blog.publishDate}</span>
          <span><i class="fa-regular fa-eye mr-1"></i> ${blog.views} views</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">${blog.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${blog.summary}</p>
        <a href="#blog-detail/${blog.slug}" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
          Read more
          <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    `;
  }
  
  return card;
}