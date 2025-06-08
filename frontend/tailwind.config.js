// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to scan your React components
    "./public/index.html",       // And your main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}