import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      // browser-image-compression tries to import cordova which doesn't exist in web
      'cordova/modulemapper': '/src/utils/cordovaStub.js',
    },
  },
  optimizeDeps: {
    exclude: ['browser-image-compression'],
  },
});