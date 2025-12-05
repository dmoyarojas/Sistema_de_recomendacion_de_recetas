// config.ts
// Usar la variable de Vite (VITE_API_URL) y el objeto de entorno de Vite (import.meta.env)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";