import { copyFileSync } from 'node:fs'
import path from 'node:path'

import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const spaFallback = (): Plugin => {
  let outDir = ''

  return {
    name: 'infraweaver:spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  base: '/InfraWeaver/',
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
