import { authStore } from "@js/api/authStore";

// Check if we're in development mode (Vite specific)
const devMode = import.meta.env?.DEV;

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
    this.pageScripts = {};
  }

  async init() {
    window.addEventListener("hashchange", () => this.loadPage());
    await this.loadPage();
    
    // Add beforeunload handler to clear cache on navigation
    window.addEventListener("beforeunload", () => {
      this.clearPageCache();
    });
  }

  // New method to clear page cache
  clearPageCache() {
    this.pageScripts = {};
    const appElement = document.getElementById("app");
    if (appElement) appElement.innerHTML = "";
  }

  async loadPage() {
    try {
      this.clearPageCache(); // Clear previous page content
      
      const path = this.getPath();
      const route = this.routes[path] || this.routes["404"];
      
      // Authentication logic
      if (route.requiresAuth && !authStore.isAuthenticated()) {
        window.location.hash = "#login";
        return;
      }
      if (route.isAuthPage && authStore.isAuthenticated()) {
        window.location.hash = "#index";
        return;
      }

      // Get paths based on environment
      const { componentPath, scriptPath } = this.getAssetPaths(route);
      
      // Enhanced cache busting
      const cacheBuster = `t=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      let componentUrl = componentPath;
      if (componentUrl) {
        const separator = componentUrl.includes('?') ? '&' : '?';
        componentUrl = `${componentUrl}${separator}${cacheBuster}`;
      }

      // Fetch with cache prevention headers
      const response = await fetch(componentUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      
      const html = await response.text();
      document.getElementById("app").innerHTML = html;

      // Load script if it exists
      if (scriptPath) {
        await this.loadPageScript(scriptPath);
      }
    } catch (error) {
      console.error("Failed to load page:", error);
      document.getElementById("app").innerHTML = "<h1>Error loading page</h1>";
    }
  }

  getAssetPaths(route) {
    // Use development paths in dev mode
    if (devMode) {
      return {
        componentPath: route.component,
        scriptPath: route.script
      };
    }
    
    // Production paths
    const componentName = route.component?.split('/').pop() || '';
    const scriptName = route.script?.split('/').pop() || '';
    
    return {
      componentPath: componentName ? `/src/pages/${componentName}` : null,
      scriptPath: scriptName ? `/assets/${scriptName}` : null
    };
  }

  async loadPageScript(scriptPath) {
    if (!scriptPath) return;
    
    try {
      // Enhanced cache busting for scripts
      const cacheBuster = `t=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      let scriptUrl = scriptPath;
      const separator = scriptUrl.includes('?') ? '&' : '?';
      scriptUrl = `${scriptUrl}${separator}${cacheBuster}`;

      // Prevent reloading same script
      if (!this.pageScripts[scriptUrl]) {
       
        
        // Clear module cache
        delete window[scriptUrl];
        
        // Load with dynamic import
        const module = await import(/* @vite-ignore */ scriptUrl);
        this.pageScripts[scriptUrl] = true;

        if (typeof module.default === "function") {
          try {
            new module.default();
          } catch (e) {
            module.default();
          }
        } else {
          console.warn("No callable default export in", scriptUrl);
        }
      }
    } catch (e) {
      console.error("Failed to load module:", e);
    }
  }

  getPath() {
    const hash = location.hash.slice(1);
    return hash.split('/')[0] || "index";
  }
}

/*  ROUTE MAP  – Future Portfolio Pages 
    ──────────────────────────────────────────
    Mga page na gagawin sa portfolio mo kasama na ang navigation:
*/

export const routes = {
  /* ────────────  HOME / INDEX  ──────────── */
  index: {
    path         : /^$/,                          
    component    : '/src/pages/home.html',        
    script       : '/src/js/module/home.js',
    requiresAuth : false,
  },

  /* ────────────  ABOUT  ──────────── */
  about: {
    path         : /^about/,
    component    : '/src/pages/about.html',       
    script       : '/src/js/module/about.js',
    requiresAuth : false,
  },

  /* ────────────  PROJECTS LISTING  ──────────── */
  projects: {
    path         : /^projects$/,
    component    : '/src/pages/projects.html',    
    script       : '/src/js/module/projects.js',
    requiresAuth : false,
  },

  /* ────────────  PROJECT DETAIL  ──────────── */
  "project-detail": {
    path         : /^projects\/\d+$/,
    component    : '/src/pages/project-detail.html',
    script       : '/src/js/module/project-detail.js',
    requiresAuth : false,
  },

  /* ────────────  SKILLS  ──────────── */
  skills: {
    path         : /^skills/,
    component    : '/src/pages/skills.html',      
    script       : '/src/js/module/skills.js',
    requiresAuth : false,
  },

  /* ────────────  BLOG LISTING  ──────────── */
  blog: {
    path         : /^blog$/,
    component    : '/src/pages/blog.html',        
    script       : '/src/js/module/blog.js',
    requiresAuth : false,
  },

  /* ────────────  BLOG DETAIL  ──────────── */
  "blog-detail": {
    path         : /^blog\/[a-z0-9-]+$/,
    component    : '/src/pages/blog-detail.html',
    script       : '/src/js/module/blog-detail.js',
    requiresAuth : false,
  },

  /* ────────────  TESTIMONIALS  ──────────── */
  testimonials: {
    path         : /^testimonials/,
    component    : '/src/pages/testimonials.html',
    script       : '/src/js/module/testimonials.js',
    requiresAuth : false,
  },

  /* ────────────  CONTACT  ──────────── */
  contact: {
    path         : /^contact/,
    component    : '/src/pages/contact.html',
    script       : '/src/js/module/contact.js',
    requiresAuth : false,
  },

  terms: {
    component    : '/src/pages/terms.html',
    script       : '/src/js/module/terms.js',
    requiresAuth : false,
  },

  privacy: {
    component    : '/src/pages/privacy-policy.html',
    script       : '/src/js/module/privacy-policy.js',
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