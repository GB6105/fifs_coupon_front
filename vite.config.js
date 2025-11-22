// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // .js와 .jsx 확장자를 생략할 수 있도록 추가
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});