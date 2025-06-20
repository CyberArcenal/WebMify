// src/js/utils/notifications.js
class NotificationManager {
  constructor() {
    this.toastContainer = null;
    this.initContainer();
  }

  initContainer() {
    this.toastContainer = document.createElement("div");
    this.toastContainer.className = "fixed z-[9999] flex flex-col gap-3";
    this.setContainerPosition("top-right");
    document.body.appendChild(this.toastContainer);
  }

  setContainerPosition(position = "top-right") {
    const positions = {
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
    };

    this.toastContainer.className = `fixed z-[9999] flex flex-col gap-3 ${positions[position]}`;
  }

  createToast(message, type = "info", options = {}) {
    const toast = document.createElement("div");
    toast.className = this.getToastClasses(type);
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");

    const icon = this.getIcon(type);
    const progressBar = options.progressBar
      ? this.createProgressBar(options.duration, type)
      : null;

    toast.innerHTML = `
      <div class="flex items-start gap-3 p-4">
        ${icon}
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">${message}</p>
        </div>
        <button class="text-gray-600 hover:text-gray-700 transition-colors">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      ${progressBar?.outerHTML || ""}
    `;

    const closeButton = toast.querySelector("button");
    closeButton.addEventListener("click", () => this.removeToast(toast));

    this.toastContainer.appendChild(toast);

    // Add entrance animation
    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-y-6");
    }, 10);

    if (options.autoClose) {
      setTimeout(() => this.removeToast(toast), options.duration || 5000);
    }

    return toast;
  }

  getToastClasses(type) {
    const backgroundColors = {
      success: "bg-emerald-100",
      error: "bg-rose-100",
      warning: "bg-amber-100",
      info: "bg-sky-100"
    };

    const baseClasses = `
      w-80 opacity-0 translate-y-6 transform-gpu transition-all duration-300
      ${backgroundColors[type]} shadow-lg ring-1 ring-black ring-opacity-5 rounded-xl
      pointer-events-auto overflow-hidden
    `;
    
    return baseClasses;
  }

  getIcon(type) {
    const iconColors = {
      success: "text-emerald-600",
      error: "text-rose-600",
      warning: "text-amber-600",
      info: "text-sky-600"
    };

    const icons = {
      success: `<svg class="h-6 w-6 ${iconColors[type]}" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/>
              </svg>`,
      error: `<svg class="h-6 w-6 ${iconColors[type]}" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>`,
      warning: `<svg class="h-6 w-6 ${iconColors[type]}" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>`,
      info: `<svg class="h-6 w-6 ${iconColors[type]}" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
    };

    return `<div class="flex-shrink-0">${icons[type]}</div>`;
  }

  createProgressBar(duration, type) {
    const progressColors = {
      success: "bg-emerald-600",
      error: "bg-rose-600",
      warning: "bg-amber-600",
      info: "bg-sky-600"
    };

    const progressBar = document.createElement("div");
    progressBar.className = "h-1 bg-gray-200";
    progressBar.innerHTML = `
      <div class="h-full ${progressColors[type]} transition-all duration-${duration}" style="width: 100%"></div>
    `;

    setTimeout(() => {
      progressBar.querySelector("div").style.width = "0%";
    }, 10);

    return progressBar;
  }

  removeToast(toast) {
    toast.classList.add("opacity-0", "translate-y-6");
    setTimeout(() => toast.remove(), 300);
  }
}

// Singleton instance
const notificationManager = new NotificationManager();

export const showToast = (message, type = "info", options = {}) => {
  const defaultOptions = {
    duration: 5000,
    autoClose: true,
    progressBar: true,
    ...options,
  };

  return notificationManager.createToast(message, type, defaultOptions);
};

export const showSuccess = (message, options) =>
  showToast(message, "success", options);
export const showError = (message, options) =>
  showToast(message, "error", options);
export const showWarning = (message, options) =>
  showToast(message, "warning", options);
export const showInfo = (message, options) =>
  showToast(message, "info", options);
