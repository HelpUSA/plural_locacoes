// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // permite acesso externo (útil para preview na Vercel)
    port: 5173,      // porta local padrão
  },
  preview: {
    port: 4173,      // porta para "vite preview"
  },
  build: {
    outDir: 'dist',  // diretório de saída do build
    sourcemap: false // desabilita mapas de fonte para builds mais leves
  }
})
