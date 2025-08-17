import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 5001,
    historyApiFallback: true, // Cho phép React Router xử lý route
  },
  base: '/', // dành cho TH f5 các trang có route /*/*
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Đảm bảo các chunk được xử lý tự động
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Chỉ định các dependency cần preload
  },
});
