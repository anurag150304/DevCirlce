/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        loading: "loading 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(50%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: []
};