/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vazirmatn: "var(--font-vazirmatn)",
      },
      colors: {
        'primary': '#997C70',
        'dark': '#685752',
        'light': '#FDF7F4',
        'accent': '#8EB486',
      }
    },
  },
  plugins: [],
};
