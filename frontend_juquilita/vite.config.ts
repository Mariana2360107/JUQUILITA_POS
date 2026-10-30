import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function filePathFromUrl(url: URL) {
  return decodeURIComponent(url.pathname).replace(/^\/([A-Za-z]:)/, '$1')
}

const configPath = filePathFromUrl(new URL(import.meta.url))
const __dirname = configPath.slice(0, configPath.lastIndexOf('/'))

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return filePathFromUrl(new URL(`./src/assets/${filename}`, import.meta.url))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': filePathFromUrl(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/JUQUILITA_POS/backend_juquilita',
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/api/, ''),
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})