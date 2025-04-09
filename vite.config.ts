import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-build-paths',
      buildStart() {
        console.log('====================== PATH DEBUG INFO ======================')
        console.log('Current working directory:', process.cwd())
        console.log('__dirname value:', __dirname)
        console.log('@/ resolves to:', path.resolve(__dirname, './src'))
        console.log('==============================================================')
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})