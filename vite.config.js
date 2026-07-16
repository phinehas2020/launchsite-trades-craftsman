import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        whatWeDo: resolve(__dirname, 'what-we-do/index.html'),
        portfolio: resolve(__dirname, 'portfolio/index.html'),
        team: resolve(__dirname, 'team/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
})
