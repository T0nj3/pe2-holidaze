/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#292929",
        olive: "#5B6B3A",
        text: "#FFFFFF",
      },
      fontFamily: {
        serif: ["Judson", "serif"],
      },
    },
  },
  plugins: [],
};