import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true, // Ensures the origin header matches the target
      },
    },
  },
});