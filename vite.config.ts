import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/habits-tracker/',
  build: {
    // Firebase is loaded after the local UI is ready, so its isolated async chunk can be larger.
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Agatsu — Mis hábitos',
        short_name: 'Agatsu',
        description: 'Un espacio sencillo para cuidar tus hábitos cada día.',
        theme_color: '#173b2c',
        background_color: '#f5f1e8',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/habits-tracker/',
        scope: '/habits-tracker/',
        lang: 'es',
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: '/habits-tracker/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
