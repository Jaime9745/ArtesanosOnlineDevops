import { defineConfig } from 'cypress';
import setupNodeEvents from './cypress/plugins/index.cjs';

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  env: {
    API_URL: 'http://localhost:4000',
  },
  e2e: {
    setupNodeEvents,
    baseUrl: 'http://localhost:5173',
  },
});