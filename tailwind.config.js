// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 🚨 이 부분이 필수입니다. Tailwind가 스타일을 스캔할 파일을 지정합니다.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}