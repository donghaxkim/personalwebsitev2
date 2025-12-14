/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        playing: {
          '0%': { transform: 'scaleY(0.1)' },
          '33%': { transform: 'scaleY(0.6)' },
          '66%': { transform: 'scaleY(0.9)' },
          '100%': { transform: 'scaleY(0.1)' },
        },
      },
      animation: {
        playing: 'playing 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

