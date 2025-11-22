// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // .js와 .jsx 확장자를 생략할 수 있도록 추가
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 5173, 
    allowedHosts: [
      'localhost', // 기존 허용
      '127.0.0.1', // 기존 허용
      'coupon.taegyunkim.com', 
      // '3.38.114.206' 
    ],
    host: true, // 외부 접속을 허용하려면 주석 해제 (필요시)
  }
});