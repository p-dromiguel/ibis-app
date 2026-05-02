import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy: quando o frontend chamar /api/qualquer-coisa,
    // o Vite redireciona para o backend em localhost:3001
    proxy: {
      '/auth': 'http://localhost:3001',
      '/phrases': 'http://localhost:3001',
    },
  },
});
