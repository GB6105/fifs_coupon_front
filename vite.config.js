// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 5173, 
    allowedHosts: [
      'localhost', // 기존 허용
      '127.0.0.1', // 기존 허용
      'coupon.taegyunkim.com', 
    ],
    host: true,
  }
});