/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#0A0A0A', secondary: '#141414', elevated: '#1E1E1E' },
        foreground: { DEFAULT: '#FFFFFF', secondary: '#A3A3A3', muted: '#737373' },
        accent: { DEFAULT: '#C9A96E', hover: '#B8975A' },
        border: { DEFAULT: '#262626', hover: '#404040' },
        error: '#DC2626', success: '#16A34A',
      },
      fontFamily: { serif: ['Playfair Display', 'serif'], sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}

