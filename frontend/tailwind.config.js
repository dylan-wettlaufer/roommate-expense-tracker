// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    fontFamily: {
      sans1: ['Inter', 'sans-serif'],
      display: ['Manrope', 'sans-serif'],
    },
    extend: {
      colors: {
        "color-primary": "#0891b2",
        "color-secondary": "#6b7280",
        "color-accent": "#10b981",
        "color-warning": "#f59e0b",
        "color-error": "#ef4444",
        "bg-color": "#f9fafb",

        "color-blue": "#3B82F6",
        "color-green": "#10B981",
        "blue-light": "#E0F2FE",
        "green-light": "#D1FAE5",
        "blue-secondary": "#2563EB",
        "green-secondary": "#059669",
        "blue-dark": "#1E40AF",
        "green-dark": "#055141",
        "blue-tertiary": "#1E3A8A",
        "green-tertiary": "#044034",
        "blue-quaternary": "#1E2A5E",
        "green-quaternary": "#04312D",
        "blue-quinary": "#1E2348",
        "green-quinary": "#042626",
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'success-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      }
    },
  },
  plugins: [],
}
