/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1a1a1a",
        dark2: "#2a2a2a",
        dark3: "#3a3a3a",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
