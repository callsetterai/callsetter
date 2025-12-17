/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0A12",
        panel: "#11101a",
        brand: "#5A46F6",
        brand2: "#7C6CFD",
      },
    },
  },
  plugins: [],
};
