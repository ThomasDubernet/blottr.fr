import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk - React and core libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('@inertiajs')) {
              return 'vendor'
            }
            return 'vendor-libs'
          }

          // Forms chunk - form-related components
          if (
            id.includes('inertia/components/forms/') ||
            id.includes('inertia/services/form_service')
          ) {
            return 'forms'
          }

          // Gallery chunk - image/gallery components
          if (id.includes('inertia/components/gallery/')) {
            return 'gallery'
          }

          // Discovery chunk - artist/tattoo discovery
          if (id.includes('inertia/components/discovery/')) {
            return 'discovery'
          }

          // UI chunk - reusable components
          if (id.includes('inertia/components/ui/')) {
            return 'ui'
          }

          // Utilities chunk - hooks and services
          if (id.includes('inertia/hooks/') || id.includes('inertia/services/')) {
            return 'utils'
          }

          // Layout chunk
          if (id.includes('inertia/components/layout/')) {
            return 'layout'
          }
        },
      },
    },
  },
})
