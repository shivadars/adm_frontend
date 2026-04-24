/**
 * dataService.js
 *
 * The single entry point for ALL data operations in the app.
 *
 * Switch the data source by changing VITE_DATA_SOURCE in your .env file:
 *   VITE_DATA_SOURCE=local  → uses localStorage via localService.js
 *   VITE_DATA_SOURCE=api    → uses Laravel REST API via apiService.js
 *
 * ⚠️ IMPORTANT: After changing .env, you MUST restart the dev server.
 *    `import.meta.env` is evaluated at build time, not at runtime.
 *
 * Both services expose IDENTICAL method signatures so no component
 * or slice changes are needed when switching.
 */

import localService from './localService';
import apiService   from './apiService';

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'local';
const USE_API     = DATA_SOURCE === 'api';

// ── Startup banner so you always know which mode is active ────────────────
if (USE_API) {
  console.warn(
    `%c[dataService] 🌐 API MODE — all requests go to: ${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}`,
    'background:#1e3a5f;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;'
  );
} else {
  console.info(
    '%c[dataService] 💾 LOCAL MODE — using localStorage',
    'background:#073b3a;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;'
  );
}

const dataService = USE_API ? apiService : localService;

export default dataService;
