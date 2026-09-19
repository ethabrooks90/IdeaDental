import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Served from https://ethabrooks90.github.io/IdeaDental/, not the domain
  // root — without this, every built asset URL resolves to /assets/... and
  // 404s under that subpath, which is what a GitHub Pages deploy needs a
  // real build for in the first place (see the Pages workflow).
  base: '/IdeaDental/',
})
