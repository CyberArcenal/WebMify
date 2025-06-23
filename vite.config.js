import { defineConfig } from "vite";
import { resolve } from "path";

// List of all pages
const pages = [
  'home', 'about', 'projects', 'project-detail', 'skills', 
  'blog', 'blog-detail', 'testimonials', 'contact', 
  'terms', 'privacy-policy', 'offline', 'custom404'
];

// Create input object for Rollup
const rollupInput = {
  main: resolve(__dirname, "index.html"),
  router: resolve(__dirname, "src/js/module/router.js"),
};

// Add all pages to input
pages.forEach(page => {
  rollupInput[page] = resolve(__dirname, `src/pages/${page}.html`);
});

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    copyPublicDir: true,
    rollupOptions: {
      input: rollupInput,
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
      },
    },
    assetsInlineLimit: 4096,
    cssTarget: "chrome80",
    assetsDir: "assets",
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: "esbuild",
  },
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@js": resolve(__dirname, "./src/js"),
      "@styles": resolve(__dirname, "./src/css"),
      "@pages": resolve(__dirname, "./src/pages"),
    },
  },
});