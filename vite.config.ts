import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'app': path.resolve(__dirname, 'src/app'),
      'components': path.resolve(__dirname, 'src/components'),
      'features': path.resolve(__dirname, 'src/features'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'services': path.resolve(__dirname, 'src/services'),
      'store': path.resolve(__dirname, 'src/store'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'styles': path.resolve(__dirname, 'src/styles'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'types': path.resolve(__dirname, 'src/types'),
      'lib': path.resolve(__dirname, 'src/lib'),
    }
  }
})
