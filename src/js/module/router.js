import { authStore } from "@js/api/authStore";

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
    this.pageScripts = {}; // Para sa page-specific scripts
  }

  async init() {
    window.addEventListener("hashchange", () => this.loadPage());
    await this.loadPage();
  }

  async loadPage() {
    try {
      const path = this.getPath();
      const route = this.routes[path] || this.routes["404"];
      // Authentication check
      // if (route.requiresAuth && !authStore.isAuthenticated()) {
      //   window.location.hash = "#login";
      //   return;
      // }
      // // Redirect authenticated users away from auth pages
      // if (route.isAuthPage && authStore.isAuthenticated()) {
      //   window.location.hash = "#index";
      //   return;
      // }
      // Mag-load ng HTML content
      const response = await fetch(route.component);
      const html = await response.text();

      // I-update ang DOM
      document.getElementById("app").innerHTML = html;

      // Mag-load ng page-specific scripts
      await this.loadPageScript(route);
    } catch (error) {
      console.error("Failed to load page:", error);
      document.getElementById("app").innerHTML = "<h1>Error loading page</h1>";
    }
  }

  async loadPageScript(route) {
    if (route.script) {
      try {
        console.log("Loading script for route:", route.script);
        // Dagdagan ng unique query parameter para ma-bypass ang caching kung kinakailangan
        const module = await import(/* @vite-ignore */ `${route.script}?t=${Date.now()}`);
        console.log("Module loaded:", module);

        // Kung ang default export ay isang function, subukan natin kung callable ito
        if (typeof module.default === "function") {
          try {
            // Subukang gamitin ang new kung posible (kung ito ay class constructor)
            new module.default();
          } catch (instantiationError) {
            // Kung pumalya ang paggamit ng new, subukan lang itong tawagan bilang function
            module.default();
          }
        } else {
          console.warn(
            "Walang callable default export na nahanap sa",
            route.script
          );
        }
      } catch (e) {
        console.error("Failed to load module:", e);
      }
    }
  }

  getPath() {
    // Get the first segment after # (ignore any additional segments)
    const hash = location.hash.slice(1);
    return hash.split('/')[0] || "index"; // Get only the first path segment
  }
}

/*  ROUTE MAP  – Future Portfolio Pages 
    ──────────────────────────────────────────
    Mga page na gagawin sa portfolio mo kasama na ang navigation:
*/

export const routes = {
  /* ────────────  HOME / INDEX  ──────────── */
  index: {
    path         : /^$/,                           // empty hash or "#"
    component    : '/src/pages/home.html',         // Home page display
    script       : '/src/js/modules/home.js',
    requiresAuth : false,
  },

  /* ────────────  ABOUT  ──────────── */
  about: {
    path         : /^about/,
    component    : '/src/pages/about.html',        // About page (detailed profile, work experience, education)
    script       : '/src/js/modules/about.js',
    requiresAuth : false,
  },

  /* ────────────  PROJECTS LISTING  ──────────── */
  projects: {
    path         : /^projects$/,
    component    : '/src/pages/projects.html',     // Listahan ng projects (may pagination)
    script       : '/src/js/modules/projects.js',
    requiresAuth : false,
  },

  /* ────────────  PROJECT DETAIL  ──────────── */
  "project-detail": {
    path         : /^projects\/\d+$/, // e.g., "#projects/6" (gamit ang numeric ID; pwede ring gamitin ang slug kung nais)
    component    : '/src/pages/project-detail.html', // Detalyadong view ng project
    script       : '/src/js/modules/project-detail.js',
    requiresAuth : false,
  },

  /* ────────────  SKILLS  ──────────── */
  skills: {
    path         : /^skills/,
    component    : '/src/pages/skills.html',       // Skills list (mga language, frameworks, etc.)
    script       : '/src/js/modules/skills.js',
    requiresAuth : false,
  },

  /* ────────────  BLOG LISTING  ──────────── */
  blog: {
    path         : /^blog$/,
    component    : '/src/pages/blog.html',         // Listahan ng blog posts (may pagination at filtering)
    script       : '/src/js/modules/blog.js',
    requiresAuth : false,
  },

  /* ────────────  BLOG DETAIL  ──────────── */
  "blog-detail": {
    path         : /^blog\/[a-z0-9-]+$/,  // e.g., "#blog/django-performance-tips" gamit ang slug
    component    : '/src/pages/blog-detail.html',// Full blog post content
    script       : '/src/js/modules/blog-detail.js',
    requiresAuth : false,
  },

  /* ────────────  TESTIMONIALS  ──────────── */
  testimonials: {
    path         : /^testimonials/,
    component    : '/src/pages/testimonials.html', // Testimonials page
    script       : '/src/js/modules/testimonials.js',
    requiresAuth : false,
  },

  /* ────────────  CONTACT  ──────────── */
  contact: {
    path         : /^contact/,
    component    : '/src/pages/contact.html',      // Contact form and info page
    script       : '/src/js/modules/contact.js',
    requiresAuth : false,
  },

  /* ────────────  GENERAL UTILITY  ──────────── */
  'offline-info': {
    component   : '/src/pages/offline.html',
    script      : null,
    requiresAuth: false,
  },

  /* ────────────  FALLBACK  ──────────── */
  404: {
    component : '/src/pages/custom404.html',
    script    : null,
  },
};

const router = new Router(routes);
