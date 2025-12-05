// env.d.ts o vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Definición de tu variable VITE_API_URL
  readonly VITE_API_URL: string
  // Puedes añadir otras variables VITE_ aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}