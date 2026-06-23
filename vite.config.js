import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Use relative paths for assets so Github Pages works without knowing the repo name
  build: {
    rollupOptions: {
      input: {
        // Main Future Gaming site
        main: resolve(__dirname, 'index.html'),
        // Future eSport sub-site
        esport: resolve(__dirname, 'esport/index.html'),
      },
    },
  },
});
