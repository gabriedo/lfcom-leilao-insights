import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  root: '.',
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      // '@' → frontend/src
      '@': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 5173,
    watch: { usePolling: true },
  },
  preview: { port: 5173 },
  // não inclua aqui nenhuma opção `esbuild.tsconfig`
}); 