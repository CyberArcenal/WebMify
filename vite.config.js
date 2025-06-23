import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    copyPublicDir: true,
    rollupOptions: {
      input: {
        // Main entry points
        main: resolve(__dirname, "index.html"),
        router: resolve(__dirname, "src/js/module/router.js"),
        
        // Manually add all HTML pages
        home: resolve(__dirname, "src/pages/home.html"),
        about: resolve(__dirname, "src/pages/about.html"),
        projects: resolve(__dirname, "src/pages/projects.html"),
        "project-detail": resolve(__dirname, "src/pages/project-detail.html"),
        skills: resolve(__dirname, "src/pages/skills.html"),
        blog: resolve(__dirname, "src/pages/blog.html"),
        "blog-detail": resolve(__dirname, "src/pages/blog-detail.html"),
        testimonials: resolve(__dirname, "src/pages/testimonials.html"),
        contact: resolve(__dirname, "src/pages/contact.html"),
        terms: resolve(__dirname, "src/pages/terms.html"),
        privacy: resolve(__dirname, "src/pages/privacy-policy.html"),
        "offline-info": resolve(__dirname, "src/pages/offline.html"),
        "custom404": resolve(__dirname, "src/pages/custom404.html"),
      },
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/variables.scss";`
      },
    },
    devSourcemap: true,
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