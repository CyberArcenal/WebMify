import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
      },
      external: [],
    },
    assetsInlineLimit: 4096,
    cssTarget: "chrome80",
    assetsDir: "assets",
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: "esbuild",
  },
  css: {
    preprocessorOptions: {},
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@js": resolve(__dirname, "./src/js"),
      "@styles": resolve(__dirname, "./src/css"),
    },
  },
});
