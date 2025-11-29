/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#def2ff',
          200: '#b6e5ff',
          300: '#7cd3ff',
          400: '#39bdff',
          500: '#0aa5ff',
          600: '#0085db',
          700: '#006ab0',
          800: '#035992',
          900: '#0a4a77',
        },
      },
    },
  },
  plugins: [],
};