import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'

import { defineConfig, type Plugin } from 'vitest/config'
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
      const shell = path.join(outDir, 'index.html')
      if (!existsSync(shell)) return

      copyFileSync(shell, path.join(outDir, '404.html'))
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
  test: {
    environment: 'node',
  },
})
