import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor dependencies
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot'],
          'vendor-flow': ['@xyflow/react'],
          'vendor-charts': ['mermaid'],

          // Group SDLC phase diagrams together
          'sdlc-phases': [
            './src/app/components/diagrams/FaseRequisitos',
            './src/app/components/diagrams/ProcesoPRD',
            './src/app/components/diagrams/RequisitosFuncionales',
            './src/app/components/diagrams/PlanificacionSprint',
            './src/app/components/diagrams/ProcesoDesarrollo',
            './src/app/components/diagrams/TestingQA',
            './src/app/components/diagrams/SeguridadSDLC',
            './src/app/components/diagrams/EntornosDespliegue',
          ],

          // Group management components
          management: [
            './src/app/components/diagrams/GestionPortafolio',
            './src/app/components/diagrams/GobernanzaWorkflow',
          ],

          // Group large feature components separately for better caching
          'feature-propuesta': ['./src/app/components/features/propuesta-mejora'],
          'feature-handoffs': ['./src/app/components/features/handoffs-templates'],
          'feature-integrity': ['./src/app/components/features/integrity-tests'],

          // Group documentation and tools
          documentation: [
            './src/app/components/diagrams/SitemapView',
            './src/app/components/diagrams/MarkdownViewer',
            './src/app/components/diagrams/HelpCenter',
            './src/app/components/diagrams/AgentsArchitecture',
          ],
        },
      },
    },

    // Increase chunk size warning limit since we're intentionally splitting
    chunkSizeWarningLimit: 1000,
  },
});
